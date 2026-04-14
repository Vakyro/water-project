'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, Flag, ExternalLink, BookOpen, Database } from 'lucide-react'
import { ReportIssueDialog } from '@/components/verification/report-issue-dialog'
import type { ChatMessage as ChatMessageType, Citation } from '@/src/core/types'

interface ChatMessageProps {
  message: ChatMessageType
}

// Renders text with **bold** and citation [N] markers highlighted
function MessageContent({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line) return <br key={i} />

        // Replace **text** with <strong> and [N] with highlighted spans
        const parts = line.split(/(\*\*[^*]+\*\*|\[\d+\])/g)
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (/^\*\*[^*]+\*\*$/.test(part)) {
                return <strong key={j}>{part.slice(2, -2)}</strong>
              }
              if (/^\[\d+\]$/.test(part)) {
                return (
                  <sup
                    key={j}
                    className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded bg-primary/10 text-primary text-[10px] font-bold ml-0.5 cursor-default"
                    title={`Fuente ${part}`}
                  >
                    {part.slice(1, -1)}
                  </sup>
                )
              }
              return <span key={j}>{part}</span>
            })}
          </p>
        )
      })}
    </div>
  )
}

function PaperCitation({ citation }: { citation: Citation }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-card text-sm space-y-1">
      <div className="flex items-start gap-2">
        <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded bg-primary/10 text-primary text-xs font-bold">
          {citation.number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium leading-snug">{citation.title ?? 'Sin título'}</p>
          {citation.authors && citation.authors.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {citation.authors.slice(0, 3).join(', ')}
              {citation.authors.length > 3 && ' et al.'}
              {citation.year ? ` (${citation.year})` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap pl-7">
        {citation.doi && (
          <a
            href={`https://doi.org/${citation.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            DOI <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <Badge variant="outline" className="text-xs">
          {Math.round(citation.similarity * 100)}% similitud
        </Badge>
      </div>
    </div>
  )
}

function EntityCitation({ citation }: { citation: Citation }) {
  const typeLabel: Record<string, string> = {
    city:            'Ciudad',
    facility:        'Instalación',
    microplastics:   'Microplásticos',
    contamination:   'Contaminación',
    'water-quality': 'Calidad del Agua',
  }
  const label = typeLabel[citation.entityType ?? ''] ?? citation.entityType ?? 'Entidad'

  return (
    <div className="p-3 rounded-lg border border-border bg-card text-sm space-y-1">
      <div className="flex items-start gap-2">
        <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded bg-chart-2/20 text-chart-2 text-xs font-bold">
          {citation.number}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="font-medium leading-snug">{citation.title}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Datos de la plataforma · {label}</p>
        </div>
      </div>

      <div className="pl-7">
        <Badge variant="outline" className="text-xs">
          {Math.round(citation.similarity * 100)}% similitud
        </Badge>
      </div>
    </div>
  )
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [citationsOpen, setCitationsOpen] = useState(false)
  const [reportOpen, setReportOpen]       = useState(false)
  const isUser = message.role === 'user'

  const paperCitations  = message.citations?.filter(c => c.source === 'paper')  ?? []
  const entityCitations = message.citations?.filter(c => c.source === 'entity') ?? []
  const totalCitations  = (message.citations ?? []).length

  const confidenceColor =
    !message.confidence            ? 'bg-muted-foreground'
    : message.confidence >= 0.75  ? 'bg-teal-500'
    : message.confidence >= 0.55  ? 'bg-sky-500'
    :                               'bg-blue-600'

  const confidenceLabel =
    !message.confidence            ? ''
    : message.confidence >= 0.75  ? 'Alta relevancia'
    : message.confidence >= 0.55  ? 'Relevancia media'
    :                               'Relevancia baja'

  return (
    <div className={cn('flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
      {/* Bubble */}
      <div
        className={cn(
          'max-w-[90%] rounded-lg p-3',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <MessageContent text={message.content} />
        )}
      </div>

      {/* Confidence badge */}
      {!isUser && message.confidence !== undefined && message.confidence > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={cn('w-2 h-2 rounded-full', confidenceColor)} />
          <span>{confidenceLabel} ({Math.round(message.confidence * 100)}%)</span>
        </div>
      )}

      {/* Citations collapsible */}
      {!isUser && totalCitations > 0 && (
        <Collapsible open={citationsOpen} onOpenChange={setCitationsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-xs h-7">
              <BookOpen className="h-3.5 w-3.5" />
              {totalCitations} fuente{totalCitations !== 1 ? 's' : ''} utilizadas
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform', citationsOpen && 'rotate-180')}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 space-y-2 max-w-[90%]">
            {paperCitations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Papers científicos
                </p>
                {paperCitations.map(c => (
                  <PaperCitation key={`${c.source}-${c.number}`} citation={c} />
                ))}
              </div>
            )}

            {entityCitations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Database className="h-3 w-3" /> Datos de la plataforma
                </p>
                {entityCitations.map(c => (
                  <EntityCitation key={`${c.source}-${c.number}`} citation={c} />
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Report button (only on assistant messages) */}
      {!isUser && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground h-7 text-xs"
          onClick={() => setReportOpen(true)}
        >
          <Flag className="h-3 w-3 mr-1" />
          Reportar respuesta
        </Button>
      )}

      <ReportIssueDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        reportType="chat"
        route="/app"
        chatMessageId={message.id}
      />
    </div>
  )
}
