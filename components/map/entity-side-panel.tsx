"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { X, ExternalLink, Flag, Building2, Droplets, AlertTriangle, CircleDot, MapPin } from 'lucide-react'
import { ReportIssueDialog } from '@/components/verification/report-issue-dialog'
import type { MapEntity, City, Facility, MicroplasticsEntry, ContaminationMarker, WaterQualityPoint } from '@/src/core/types'
import { cities } from '@/src/data/cities'
import { FACILITY_TYPES, SEVERITY_COLORS, WATER_QUALITY_COLORS } from '@/src/core/constants'
import { cn } from '@/lib/utils'

interface EntitySidePanelProps {
  entity: MapEntity | null
  onClose: () => void
}

export function EntitySidePanel({ entity, onClose }: EntitySidePanelProps) {
  const [reportOpen, setReportOpen] = useState(false)
  // displayEntity keeps content alive during slide-out
  const [displayEntity, setDisplayEntity] = useState<typeof entity>(null)
  // isOpen drives the CSS transition — set one frame after displayEntity so the
  // browser paints the panel off-screen first, then slides it in
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (entity) {
      setDisplayEntity(entity)
      // Wait one rAF so the panel renders at translate-x-full before transitioning
      const frame = requestAnimationFrame(() => setIsOpen(true))
      return () => cancelAnimationFrame(frame)
    } else {
      setIsOpen(false)
      const t = setTimeout(() => setDisplayEntity(null), 320)
      return () => clearTimeout(t)
    }
  }, [entity])

  if (!displayEntity && !isOpen) return null

  const getCityName = (cityId: string) =>
    cities.find(c => c.id === cityId)?.name || cityId

  const getDetailRoute = () => {
    if (!displayEntity) return '/app'
    switch (displayEntity.type) {
      case 'facility': return `/app/facility/${displayEntity.id}`
      case 'microplastics': return `/app/microplastics/${displayEntity.id}`
      case 'water-quality': return `/app/water-quality/${displayEntity.id}`
      case 'city': return `/app/contamination/${(displayEntity.data as City).slug}`
      case 'contamination': {
        const marker = displayEntity.data as ContaminationMarker
        const city = cities.find(c => c.id === marker.cityId)
        return city ? `/app/contamination/${city.slug}` : '/app/contamination'
      }
      default: return '/app'
    }
  }

  const renderContent = () => {
    if (!displayEntity) return null
    switch (displayEntity.type) {
      case 'city': {
        const city = displayEntity.data as City
        return (
          <>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{city.name}</h3>
                <p className="text-xs text-muted-foreground">{city.state}, {city.country === 'mexico' ? 'Mexico' : 'USA'}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{city.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Population</div>
                <div className="font-medium">{city.population.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Coordinates</div>
                <div className="font-mono text-xs">{city.coordinates[1].toFixed(4)}, {city.coordinates[0].toFixed(4)}</div>
              </div>
            </div>
          </>
        )
      }

      case 'facility': {
        const facility = displayEntity.data as Facility
        return (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-semibold">{facility.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">
                  {FACILITY_TYPES[facility.type] || facility.type}
                </p>
              </div>
            </div>
            <Badge variant={facility.status === 'operational' ? 'default' : 'secondary'} className="mb-4">
              {facility.status}
            </Badge>
            <p className="text-sm text-muted-foreground mb-4">{facility.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium">{getCityName(facility.cityId)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{facility.capacity}</span>
              </div>
              {facility.metrics.dailyFlow && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Flow</span>
                  <span className="font-medium">{facility.metrics.dailyFlow}</span>
                </div>
              )}
              {facility.metrics.treatmentLevel && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Treatment</span>
                  <span className="font-medium">{facility.metrics.treatmentLevel}</span>
                </div>
              )}
            </div>
          </>
        )
      }

      case 'microplastics': {
        const mp = displayEntity.data as MicroplasticsEntry
        return (
          <>
            <div className="flex items-center gap-2 mb-4">
              <CircleDot className="h-5 w-5 text-sky-500" />
              <div>
                <h3 className="font-semibold">{mp.affectedArea}</h3>
                <p className="text-xs text-muted-foreground">Microplastics Hotspot</p>
              </div>
            </div>
            <Badge className={cn("mb-4", SEVERITY_COLORS[mp.severity], "text-white")}>
              {mp.severity} severity
            </Badge>
            <p className="text-sm text-muted-foreground mb-4">{mp.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">{mp.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Concentration</span>
                <span className="font-medium">{mp.metrics.concentration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium">{getCityName(mp.cityId)}</span>
              </div>
            </div>
          </>
        )
      }

      case 'contamination': {
        const cm = displayEntity.data as ContaminationMarker
        return (
          <>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold">Contamination Site</h3>
                <p className="text-xs text-muted-foreground">{getCityName(cm.cityId)}</p>
              </div>
            </div>
            <Badge className={cn("mb-4", SEVERITY_COLORS[cm.severity], "text-white")}>
              {cm.severity} severity
            </Badge>
            <p className="text-sm text-muted-foreground mb-4">{cm.description}</p>
            <div className="space-y-2">
              <div className="text-sm font-medium">Pollutants</div>
              {cm.pollutants.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{p.name}</span>
                  <span className={cn("font-medium", p.exceedance && "text-blue-700")}>
                    {p.level}
                  </span>
                </div>
              ))}
            </div>
          </>
        )
      }

      case 'water-quality': {
        const wq = displayEntity.data as WaterQualityPoint
        return (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-5 w-5 text-emerald-500" />
              <div>
                <h3 className="font-semibold">{wq.name}</h3>
                <p className="text-xs text-muted-foreground">Water Quality Station</p>
              </div>
            </div>
            <Badge className={cn("mb-4", WATER_QUALITY_COLORS[wq.rating], "text-white")}>
              {wq.rating} quality
            </Badge>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">pH</span>
                <span className="font-medium">{wq.metrics.ph}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salinity</span>
                <span className="font-medium">{wq.metrics.salinity} ppt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dissolved O2</span>
                <span className="font-medium">{wq.metrics.dissolvedOxygen} mg/L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Turbidity</span>
                <span className="font-medium">{wq.metrics.turbidity} NTU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">{wq.lastUpdated}</span>
              </div>
            </div>
          </>
        )
      }

      default:
        return null
    }
  }

  return (
    <>
      <div className={`absolute top-0 right-0 bottom-0 w-80 bg-background/95 backdrop-blur border-l border-border z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-sm font-medium capitalize">{displayEntity?.type.replace('-', ' ')} Details</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100%-8rem)]">
          <div className="p-4">
            {renderContent()}
          </div>
        </ScrollArea>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background space-y-2">
          <Button asChild className="w-full" size="sm">
            <Link href={getDetailRoute()}>
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={() => setReportOpen(true)}
          >
            <Flag className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </div>
      </div>

      <ReportIssueDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        reportType="map"
        route="/app/map"
        entityId={displayEntity?.id ?? ''}
      />
    </>
  )
}
