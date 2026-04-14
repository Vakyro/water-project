'use client'

import { useState, useCallback } from 'react'
import type { ChatMessage, RAGResponse } from '@/src/core/types'
import { CHAT_MESSAGES } from '@/src/core/constants'

function makeId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function useChat() {
  const [messages, setMessages]   = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: ChatMessage = {
      id:        makeId(),
      role:      'user',
      content:   trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    const assistantId = makeId()

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: trimmed }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        setMessages(prev => [
          ...prev,
          {
            id:        makeId(),
            role:      'assistant',
            content:   errData.error ?? CHAT_MESSAGES.GENERATION_ERROR,
            timestamp: new Date(),
          },
        ])
        return
      }

      // Insert empty placeholder — content fills in as stream arrives
      setMessages(prev => [...prev, {
        id:        assistantId,
        role:      'assistant' as const,
        content:   '',
        timestamp: new Date(),
        isLoading: true,
      }])

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const chunk = JSON.parse(line) as { type: string; [key: string]: unknown }
            if (chunk.type === 'meta') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, citations: chunk.citations as ChatMessage['citations'], confidence: chunk.confidence as number }
                  : m
              ))
            } else if (chunk.type === 'delta') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId
                  ? { ...m, content: m.content + (chunk.content as string) }
                  : m
              ))
            } else if (chunk.type === 'done') {
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, isLoading: false } : m
              ))
            }
          } catch { /* skip malformed line */ }
        }
      }
    } catch {
      setMessages(prev => {
        // If placeholder was added, replace it with the error; otherwise append
        const hasPlaceholder = prev.some(m => m.id === assistantId)
        if (hasPlaceholder) {
          return prev.map(m =>
            m.id === assistantId
              ? { ...m, content: CHAT_MESSAGES.GENERATION_ERROR, isLoading: false }
              : m
          )
        }
        return [...prev, {
          id:        makeId(),
          role:      'assistant' as const,
          content:   CHAT_MESSAGES.GENERATION_ERROR,
          timestamp: new Date(),
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, isLoading, sendMessage, clearMessages }
}
