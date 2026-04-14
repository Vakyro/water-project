import { supabaseClient } from '@/src/infrastructure/clients/supabase.client'
import { DatabaseError } from '@/src/core/errors'
import type { RAGChunk, Paper, SearchParams } from '@/src/core/types'

class ChunksRepository {
  /**
   * Searches both paper_chunks and entity_chunks using the unified
   * match_all_chunks RPC. Returns results sorted by similarity descending.
   */
  async searchAllChunks(params: SearchParams): Promise<RAGChunk[]> {
    const {
      queryEmbedding,
      matchThreshold = 0.5,
      matchCount     = 8,
    } = params

    const { data, error } = await supabaseClient.rpc('match_all_chunks', {
      query_embedding:  queryEmbedding,
      match_threshold:  matchThreshold,
      match_count:      matchCount,
    })

    if (error) {
      throw new DatabaseError('match_all_chunks RPC failed', { error })
    }

    return (data ?? []) as RAGChunk[]
  }

  /**
   * Fetches paper metadata for the given UUIDs.
   * Only returns papers that actually exist in the DB —
   * this is what prevents hallucinated citations.
   */
  async findPapersByIds(ids: string[]): Promise<Paper[]> {
    if (ids.length === 0) return []

    const { data, error } = await supabaseClient
      .from('papers')
      .select('id, title, authors, year, doi, url, sha256, created_at')
      .in('id', ids)

    if (error) {
      throw new DatabaseError('Failed to fetch papers by ids', { error })
    }

    return (data ?? []) as Paper[]
  }
}

export const chunksRepository = new ChunksRepository()
