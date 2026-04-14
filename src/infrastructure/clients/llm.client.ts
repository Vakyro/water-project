import { config } from '@/src/core/config'
import { API_ENDPOINTS } from '@/src/core/constants'
import { LLMServiceError } from '@/src/core/errors'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GroqResponse {
  choices: Array<{ message: { content: string } }>
}

class LLMClient {
  private readonly apiKey: string
  private readonly model: string
  private readonly temperature: number
  private readonly maxTokens: number

  constructor() {
    const cfg = config.get('groq')
    this.apiKey      = cfg.apiKey
    this.model       = cfg.model
    this.temperature = cfg.temperature
    this.maxTokens   = cfg.maxTokens
  }

  async complete(messages: ChatMessage[]): Promise<string> {
    let response: Response
    try {
      response = await fetch(API_ENDPOINTS.GROQ, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          messages,
          model:       this.model,
          temperature: this.temperature,
          max_tokens:  this.maxTokens,
        }),
      })
    } catch (err) {
      throw new LLMServiceError('Failed to reach Groq API', { err })
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new LLMServiceError(
        `Groq API returned ${response.status}`,
        { status: response.status, body },
      )
    }

    const data: GroqResponse = await response.json()
    const content = data.choices[0]?.message?.content
    if (!content) {
      throw new LLMServiceError('Groq API returned empty content')
    }
    return content
  }

  async completeStream(messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
    let response: Response
    try {
      response = await fetch(API_ENDPOINTS.GROQ, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          messages,
          model:       this.model,
          temperature: this.temperature,
          max_tokens:  this.maxTokens,
          stream:      true,
        }),
      })
    } catch (err) {
      throw new LLMServiceError('Failed to reach Groq API', { err })
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new LLMServiceError(
        `Groq API returned ${response.status}`,
        { status: response.status, body },
      )
    }

    const encoder = new TextEncoder()
    const responseBody = response.body!

    // Parse Groq's SSE stream and re-emit as newline-delimited JSON:
    // {"type":"delta","content":"..."}\n  or  {"type":"done"}\n
    return new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader  = responseBody.getReader()
        const decoder = new TextDecoder()
        let buffer    = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'))
                controller.close()
                return
              }
              try {
                const parsed  = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(JSON.stringify({ type: 'delta', content }) + '\n'))
                }
              } catch { /* skip malformed SSE lines */ }
            }
          }
        } catch (err) {
          controller.error(err)
        } finally {
          reader.releaseLock()
        }
      },
    })
  }
}

export const llmClient = new LLMClient()
