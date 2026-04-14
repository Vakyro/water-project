"use client"

import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Building2, CircleDot, AlertTriangle, Droplets } from 'lucide-react'
import type { MapLayer } from '@/src/core/types'

interface LayerTogglePanelProps {
  layers: MapLayer[]
  onSelect: (layerId: string) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  counts?: Record<string, number>
}

const LAYER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'facilities':    Building2,
  'microplastics': CircleDot,
  'contamination': AlertTriangle,
  'water-quality': Droplets,
}

export function LayerTogglePanel({ layers, onSelect, onZoomIn, onZoomOut, onResetView, counts }: LayerTogglePanelProps) {
  const activeLayer = layers.find(l => l.visible)

  return (
    <div className="flex flex-col bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden w-[190px]">
      {/* Zoom row */}
      <div className="flex items-center gap-0.5 p-1.5 border-b border-border/60">
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={onZoomIn} title="Zoom in">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={onZoomOut} title="Zoom out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={onResetView} title="Reset view">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <span className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-right pr-1">
          Capas
        </span>
      </div>

      {/* Layer list */}
      <div className="py-1">
        {layers.map(layer => {
          const Icon = LAYER_ICONS[layer.id]
          const isActive = layer.visible
          return (
            <button
              key={layer.id}
              onClick={() => onSelect(layer.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-all duration-150 text-left group ${
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
              style={isActive ? { backgroundColor: `${layer.color}14` } : undefined}
            >
              {/* Color + icon */}
              <span
                className="flex items-center justify-center h-6 w-6 rounded-md flex-shrink-0 transition-transform duration-150"
                style={{ backgroundColor: isActive ? `${layer.color}22` : 'transparent' }}
              >
                {Icon && (
                  <Icon
                    className="h-3.5 w-3.5 transition-colors duration-150"
                    style={{ color: isActive ? layer.color : undefined }}
                  />
                )}
              </span>

              <span className="flex-1 text-xs">{layer.name}</span>

              {/* Entity count badge */}
              {counts && counts[layer.id] !== undefined && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  isActive ? 'bg-white/70 text-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {counts[layer.id]}
                </span>
              )}

              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Active layer footer pill */}
      {activeLayer && (
        <div className="px-3 py-2 border-t border-border/60">
          <div
            className="flex items-center gap-1.5 text-[10px] font-medium rounded-md px-2 py-1"
            style={{ backgroundColor: `${activeLayer.color}18`, color: activeLayer.color }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: activeLayer.color }}
            />
            {activeLayer.name} activo
          </div>
        </div>
      )}
    </div>
  )
}
