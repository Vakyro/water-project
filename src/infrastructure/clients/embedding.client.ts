import { config } from '@/src/core/config'
import { EmbeddingServiceError } from '@/src/core/errors'
import type { EmbeddingVector } from '@/src/core/types'

interface HFEmbeddingResponse {
  embedding: EmbeddingVector
  dimensions: number
}

class EmbeddingClient {
  private readonly serviceUrl: string
  private readonly expectedDimensions: number

  constructor() {
    const cfg = config.get('embedding')
    this.serviceUrl = cfg.serviceUrl
    this.expectedDimensions = cfg.dimensions
  }

  async generateEmbedding(text: string): Promise<EmbeddingVector> {
    let response: Response
    try {
      response = await fetch(`${this.serviceUrl}/embed`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text }),
      })
    } catch (err) {
      throw new EmbeddingServiceError('Failed to reach embedding service', { err })
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new EmbeddingServiceError(
        `Embedding service returned ${response.status}`,
        { status: response.status, body },
      )
    }

    const data: HFEmbeddingResponse = await response.json()
    this.validate(data)
    return data.embedding
  }

  private validate(data: HFEmbeddingResponse): void {
    if (!Array.isArray(data.embedding)) {
      throw new EmbeddingServiceError('Invalid embedding response: embedding is not an array')
    }
    if (data.embedding.length !== this.expectedDimensions) {
      throw new EmbeddingServiceError(
        `Embedding dimension mismatch: expected ${this.expectedDimensions}, got ${data.embedding.length}`,
      )
    }
  }
}

export const embeddingClient = new EmbeddingClient()
