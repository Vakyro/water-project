import type { MapLayer } from '@/src/core/types'

interface MapLegendProps {
  layers: MapLayer[]
}

const MARKER_SHAPE: Record<string, React.ReactNode> = {
  facilities:      <rect x="1" y="1" width="10" height="10" rx="2" fill="#3b82f6" />,
  microplastics:   <circle cx="6" cy="6" r="5.5" fill="#f59e0b" fillOpacity="0.75" />,
  contamination:   <polygon points="6,1 11,11 1,11" fill="#ef4444" fillOpacity="0.85" />,
  'water-quality': <circle cx="6" cy="6" r="5" fill="#10b981" stroke="white" strokeWidth="1.5" />,
}

export function MapLegend({ layers }: MapLegendProps) {
  const activeLayer = layers.find(l => l.visible)
  if (!activeLayer) return null

  return (
    <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg px-3 py-2.5 space-y-2.5 min-w-[160px]">
      {/* Active layer marker */}
      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
          {MARKER_SHAPE[activeLayer.id]}
        </svg>
        <span className="text-xs font-medium">{activeLayer.name}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-border/60" />

      {/* Drillable cities */}
      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
          <circle cx="6" cy="6" r="3.5" fill="white" stroke="black" strokeWidth="1" />
          <circle cx="6" cy="6" r="5.5" fill="none" stroke="oklch(0.65 0.12 180)" strokeWidth="1" strokeDasharray="2.5,1.5" />
        </svg>
        <span className="text-[10px] text-muted-foreground">Ciudad explorable</span>
      </div>

      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
          <circle cx="6" cy="6" r="3.5" fill="white" stroke="black" strokeWidth="1" />
        </svg>
        <span className="text-[10px] text-muted-foreground">Ciudad (solo vista)</span>
      </div>

      {/* Hint */}
      <div className="border-t border-border/60 pt-1">
        <p className="text-[10px] text-muted-foreground leading-tight">
          Haz clic en una ciudad marcada para explorar en detalle
        </p>
      </div>
    </div>
  )
}
