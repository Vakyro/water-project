import { embeddingClient } from '@/src/infrastructure/clients/embedding.client'
import { llmClient }       from '@/src/infrastructure/clients/llm.client'
import { chunksRepository } from '@/src/infrastructure/repositories/chunks.repository'
import { RAG_SYSTEM_PROMPT, CHAT_MESSAGES } from '@/src/core/constants'
import { ValidationError } from '@/src/core/errors'
import type { RAGChunk, Paper, Citation, RAGResponse } from '@/src/core/types'

// ─── Entity type display names ────────────────────────────────────────────────
const ENTITY_TYPE_LABELS: Record<string, string> = {
  city:            'Ciudad',
  facility:        'Instalación',
  microplastics:   'Microplásticos',
  contamination:   'Contaminación',
  'water-quality': 'Calidad del Agua',
}

interface StreamMeta {
  citations:  Citation[]
  chunksUsed: number
  confidence: number
}

class RAGService {
  /**
   * Streaming variant: runs embedding + search + DB fetch first, then
   * pipes the LLM response as a newline-delimited JSON stream so the
   * caller can forward it to the browser without waiting for full completion.
   *
   * Protocol lines emitted by the llmStream:
   *   {"type":"delta","content":"..."}
   *   {"type":"done"}
   */
  async generateResponseStream(query: string): Promise<{ meta: StreamMeta; llmStream: ReadableStream<Uint8Array> }> {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new ValidationError('Query must be a non-empty string')
    }

    const queryEmbedding = await embeddingClient.generateEmbedding(query.trim())
    const rawChunks      = await chunksRepository.searchAllChunks({
      queryEmbedding,
      matchThreshold: 0.3,
      matchCount:     5,
    })

    if (rawChunks.length === 0) {
      const encoder = new TextEncoder()
      const noResultStream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'delta', content: CHAT_MESSAGES.NO_RESULTS }) + '\n'))
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'))
          controller.close()
        },
      })
      return { meta: { citations: [], chunksUsed: 0, confidence: 0 }, llmStream: noResultStream }
    }

    const topChunks = rawChunks.sort((a, b) => b.similarity - a.similarity)

    const paperIds = [
      ...new Set(
        topChunks
          .filter(c => c.source === 'paper' && c.paper_id)
          .map(c => c.paper_id!)
      ),
    ]
    const papers   = await chunksRepository.findPapersByIds(paperIds)
    const paperMap = new Map<string, Paper>(papers.map(p => [p.id, p]))

    const context     = this.buildContext(topChunks, paperMap)
    const citations   = this.buildCitations(topChunks, paperMap)
    const confidence  = this.avgSimilarity(topChunks)
    const systemPrompt = RAG_SYSTEM_PROMPT.replace('{context}', context)

    const llmStream = await llmClient.completeStream([
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: query.trim() },
    ])

    return { meta: { citations, chunksUsed: topChunks.length, confidence }, llmStream }
  }

  async generateResponse(query: string): Promise<RAGResponse> {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new ValidationError('Query must be a non-empty string')
    }

    // ── Step 1: Embed the user query ─────────────────────────────────────────
    const queryEmbedding = await embeddingClient.generateEmbedding(query.trim())

    // ── Step 2: Retrieve relevant chunks from DB ──────────────────────────────
    const rawChunks = await chunksRepository.searchAllChunks({
      queryEmbedding,
      matchThreshold: 0.3,
      matchCount:     5,
    })

    // ── Step 3: No results → return without calling the LLM ──────────────────
    if (rawChunks.length === 0) {
      return {
        response:   CHAT_MESSAGES.NO_RESULTS,
        citations:  [],
        chunksUsed: 0,
        confidence: 0,
      }
    }

    // Sort by similarity descending (already limited to 5 by matchCount)
    const topChunks = rawChunks.sort((a, b) => b.similarity - a.similarity)

    // ── Step 4: Fetch real paper metadata (only papers that exist in DB) ──────
    const paperIds = [
      ...new Set(
        topChunks
          .filter(c => c.source === 'paper' && c.paper_id)
          .map(c => c.paper_id!)
      ),
    ]
    const papers   = await chunksRepository.findPapersByIds(paperIds)
    const paperMap = new Map<string, Paper>(papers.map(p => [p.id, p]))

    // ── Step 5: Build numbered context for the LLM ────────────────────────────
    // Each chunk gets a sequential number [1], [2], … that the LLM must use
    // when citing. Numbers are passed to the LLM and reflected in citations.
    const context = this.buildContext(topChunks, paperMap)

    // ── Step 6: Generate response with Groq (strict system prompt) ───────────
    const systemPrompt = RAG_SYSTEM_PROMPT.replace('{context}', context)

    const llmResponse = await llmClient.complete([
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: query.trim() },
    ])

    // ── Step 7: Build citations ONLY from real retrieved chunks ───────────────
    // Citations are derived exclusively from what was fetched in steps 2-4.
    // If the LLM mentions a [N] that doesn't exist, that's its mistake —
    // our citations array will never contain hallucinated sources.
    const citations = this.buildCitations(topChunks, paperMap)

    const confidence = this.avgSimilarity(topChunks)

    return {
      response: llmResponse,
      citations,
      chunksUsed: topChunks.length,
      confidence,
    }
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  /**
   * Builds the context string passed to the LLM.
   * Each source gets a number [N] so the LLM can cite it.
   * Paper chunks are labeled "PAPER"; entity chunks are labeled "DATOS DE PLATAFORMA".
   */
  private buildContext(
    chunks: RAGChunk[],
    paperMap: Map<string, Paper>,
  ): string {
    return chunks
      .map((chunk, index) => {
        const n = index + 1

        if (chunk.source === 'paper') {
          const paper   = chunk.paper_id ? paperMap.get(chunk.paper_id) : undefined
          const title   = paper?.title  ?? 'Documento sin título'
          const authors = paper?.authors?.slice(0, 3).join(', ') ?? 'Autores desconocidos'
          const year    = paper?.year   ?? 'N/A'

          // Only emit this chunk if the paper actually exists in the DB.
          // If paperMap doesn't have it, we still include the content but
          // mark the source as unknown so the LLM doesn't invent metadata.
          if (!paper) {
            return `[${n}] PAPER (metadatos no disponibles)\nContenido: ${chunk.content}\nSimilitud: ${(chunk.similarity * 100).toFixed(1)}%`
          }

          return (
            `[${n}] PAPER: "${title}" — ${authors} (${year})` +
            `\nContenido: ${chunk.content}` +
            `\nSimilitud: ${(chunk.similarity * 100).toFixed(1)}%`
          )
        }

        // entity chunk
        const label = ENTITY_TYPE_LABELS[chunk.entity_type ?? ''] ?? chunk.entity_type ?? 'Entidad'
        return (
          `[${n}] DATOS DE PLATAFORMA (${label}: ${chunk.entity_id ?? 'desconocido'})` +
          `\nContenido: ${chunk.content}` +
          `\nSimilitud: ${(chunk.similarity * 100).toFixed(1)}%`
        )
      })
      .join('\n\n---\n\n')
  }

  /**
   * Builds the citations array.
   * Each element maps to a [N] in the context.
   * Paper citations are only included if the paper exists in paperMap —
   * this is the hard guarantee against hallucinated citations.
   */
  private buildCitations(
    chunks: RAGChunk[],
    paperMap: Map<string, Paper>,
  ): Citation[] {
    const citations: Citation[] = []

    chunks.forEach((chunk, index) => {
      const number = index + 1

      if (chunk.source === 'paper') {
        if (!chunk.paper_id) return  // skip — no paper_id, can't cite

        const paper = paperMap.get(chunk.paper_id)
        if (!paper) return  // paper not found in DB — skip to prevent hallucination

        citations.push({
          source:    'paper',
          number,
          paperId:   paper.id,
          title:     paper.title,
          authors:   paper.authors,
          year:      paper.year,
          doi:       paper.doi ?? undefined,
          pageRange: undefined,  // chunks.repository could include page_start/end if needed
          similarity: chunk.similarity,
        })
      } else {
        // entity chunk — always real (came from entity_chunks table)
        const label = ENTITY_TYPE_LABELS[chunk.entity_type ?? ''] ?? chunk.entity_type ?? 'Entidad'
        citations.push({
          source:     'entity',
          number,
          entityType: chunk.entity_type ?? undefined,
          entityId:   chunk.entity_id   ?? undefined,
          title:      `${label}: ${chunk.entity_id ?? ''}`,
          similarity: chunk.similarity,
        })
      }
    })

    return citations
  }

  private avgSimilarity(chunks: RAGChunk[]): number {
    if (chunks.length === 0) return 0
    const sum = chunks.reduce((acc, c) => acc + c.similarity, 0)
    return Math.round((sum / chunks.length) * 100) / 100
  }
}

export const ragService = new RAGService()
