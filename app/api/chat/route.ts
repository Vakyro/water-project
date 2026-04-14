import { NextRequest, NextResponse } from 'next/server'
import { ragService } from '@/src/infrastructure/services/rag.service'
import { ErrorHandler, ValidationError } from '@/src/core/errors'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { message } = body as { message?: string }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'El campo "message" es requerido y no puede estar vacío.', code: 'INVALID_INPUT' },
        { status: 400 },
      )
    }

    // Run embedding + DB search first (sequential, fast), then stream the LLM response
    const { meta, llmStream } = await ragService.generateResponseStream(message)

    const encoder = new TextEncoder()
    const stream  = new ReadableStream<Uint8Array>({
      async start(controller) {
        // First line: metadata (citations, confidence) as JSON
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'meta', ...meta }) + '\n'))
        // Remaining lines: delta / done chunks from the LLM
        const reader = llmStream.getReader()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    const appError = ErrorHandler.handle(error)
    ErrorHandler.log(appError)
    const status = error instanceof ValidationError ? 400 : 500
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status },
    )
  }
}
