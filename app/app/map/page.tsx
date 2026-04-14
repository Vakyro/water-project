"use client"

import { useState } from 'react'
import { MapCanvas } from '@/components/map/map-canvas'
import { EntitySidePanel } from '@/components/map/entity-side-panel'
import type { MapEntity, MapLayer } from '@/src/core/types'
import { MAP_LAYERS } from '@/src/core/constants'

export default function MapPage() {
  const [layers, setLayers] = useState<MapLayer[]>(
    MAP_LAYERS.map((l, i) => ({ ...l, visible: i === 0 }))
  )
  const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null)

  const selectLayer = (layerId: string) => {
    setLayers(prev => prev.map(l => ({ ...l, visible: l.id === layerId })))
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 relative rounded-lg border border-border overflow-hidden bg-card">
        <MapCanvas
          layers={layers}
          onSelectEntity={setSelectedEntity}
          selectedEntity={selectedEntity}
          onSelectLayer={selectLayer}
        />
        <EntitySidePanel
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      </div>
    </div>
  )
}
