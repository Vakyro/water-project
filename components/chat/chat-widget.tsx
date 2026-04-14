'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MessageSquare, Send, Loader2 } from 'lucide-react'
import { ChatMessage } from './chat-message'
import { useChat } from '@/hooks/use-chat'
import { CHAT_MESSAGES } from '@/src/core/constants'

const SUGGESTED_QUESTIONS = [
  '¿Cuáles son los principales problemas de calidad del agua en Tijuana?',
  '¿Cómo afectan los microplásticos a los ecosistemas marinos?',
  '¿Qué métodos de tratamiento eliminan productos farmacéuticos del agua residual?',
  '¿Qué causa la contaminación transfronteriza en Imperial Beach?',
]

export function ChatWidget() {
  const [open, setOpen]   = useState(false)
  const [input, setInput] = useState('')
  const scrollRef         = useRef<HTMLDivElement>(null)

  const { messages, isLoading, sendMessage } = useChat()

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleSuggestion = (q: string) => {
    setInput(q)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Floating trigger button */}
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          aria-label="Abrir asistente de investigación"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Asistente de Investigación
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            Respuestas basadas en papers científicos y datos de la plataforma
          </p>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p className="font-medium text-sm">{CHAT_MESSAGES.WELCOME}</p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Preguntas sugeridas
                </p>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestion(q)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando en la base de datos de investigación…
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t shrink-0">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend() }}
            className="flex gap-2"
          >
            <Input
              placeholder="Haz una pregunta de investigación…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
