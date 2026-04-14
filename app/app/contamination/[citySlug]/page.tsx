"use client"

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCityBySlug, getCityProfile } from '@/src/data/cities'
import { getContaminationByCity, getWaterQualityByCity } from '@/src/data/water-quality'
import { getFacilitiesByCity } from '@/src/data/facilities'
import { getMicroplasticsByCity } from '@/src/data/microplastics'
import { ReportIssueDialog } from '@/components/verification/report-issue-dialog'
import { SEVERITY_COLORS, WATER_QUALITY_COLORS, FACILITY_TYPES } from '@/src/core/constants'
import { cn } from '@/lib/utils'
import { 
  AlertTriangle, 
  Droplets, 
  Building2, 
  CircleDot, 
  Flag, 
  MapPin,
  ArrowRight,
  FlaskConical
} from 'lucide-react'

export default function ContaminationCityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = use(params)
  const [reportOpen, setReportOpen] = useState(false)
  
  const city = getCityBySlug(citySlug)
  const profile = getCityProfile(citySlug)
  
  if (!city || !profile) {
    notFound()
  }

  const contamination = getContaminationByCity(city.id)
  const waterQuality = getWaterQualityByCity(city.id)
  const facilities = getFacilitiesByCity(city.id)
  const microplastics = getMicroplasticsByCity(city.id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span>{city.state}, {city.country === 'mexico' ? 'Mexico' : 'USA'}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{city.name}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">{city.description}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/app/map">
              View on Map
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setReportOpen(true)}>
            <Flag className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={cn(
              SEVERITY_COLORS[profile.waterContamination.riskLevel],
              "text-white capitalize text-lg px-3 py-1"
            )}>
              {profile.waterContamination.riskLevel}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Water Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={cn(
              WATER_QUALITY_COLORS[profile.waterQuality.overallRating],
              "text-white capitalize text-lg px-3 py-1"
            )}>
              {profile.waterQuality.overallRating}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contamination Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contamination.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilities.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contamination" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contamination" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Contamination
          </TabsTrigger>
          <TabsTrigger value="water-quality" className="gap-2">
            <Droplets className="h-4 w-4" />
            Water Quality
          </TabsTrigger>
          <TabsTrigger value="facilities" className="gap-2">
            <Building2 className="h-4 w-4" />
            Facilities
          </TabsTrigger>
          <TabsTrigger value="microplastics" className="gap-2">
            <CircleDot className="h-4 w-4" />
            Microplastics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contamination" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contamination Overview</CardTitle>
              <CardDescription>{profile.waterContamination.overview}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Main Pollutants</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.waterContamination.mainPollutants.map((pollutant, i) => (
                    <Badge key={i} variant="outline">{pollutant}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {contamination.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {contamination.map(marker => (
                <Card key={marker.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Contamination Site</CardTitle>
                      <Badge className={cn(SEVERITY_COLORS[marker.severity], "text-white")}>
                        {marker.severity}
                      </Badge>
                    </div>
                    <CardDescription>Detected: {marker.detectedDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{marker.description}</p>
                    <div className="space-y-2">
                      {marker.pollutants.map((p, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{p.name}</span>
                          <span className={cn("font-mono", p.exceedance && "text-blue-700 font-medium")}>
                            {p.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No contamination sites recorded for this city.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="water-quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Summary</CardTitle>
              <CardDescription>{profile.waterQuality.overview}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{profile.waterQuality.avgPh}</div>
                  <div className="text-sm text-muted-foreground">Avg pH</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.waterQuality.avgSalinity}</div>
                  <div className="text-sm text-muted-foreground">Avg Salinity (ppt)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.waterQuality.monitoringStations}</div>
                  <div className="text-sm text-muted-foreground">Stations</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            {waterQuality.map(wq => (
              <Link key={wq.id} href={`/app/water-quality/${wq.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{wq.name}</CardTitle>
                      <Badge className={cn(WATER_QUALITY_COLORS[wq.rating], "text-white")}>
                        {wq.rating}
                      </Badge>
                    </div>
                    <CardDescription>Last updated: {wq.lastUpdated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">pH:</span> {wq.metrics.ph}</div>
                      <div><span className="text-muted-foreground">DO:</span> {wq.metrics.dissolvedOxygen} mg/L</div>
                      <div><span className="text-muted-foreground">Turbidity:</span> {wq.metrics.turbidity} NTU</div>
                      <div><span className="text-muted-foreground">Temp:</span> {wq.metrics.temperature}°C</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {facilities.map(facility => (
              <Link key={facility.id} href={`/app/facility/${facility.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{facility.name}</CardTitle>
                      <Badge variant={facility.status === 'operational' ? 'default' : 'secondary'}>
                        {facility.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {FACILITY_TYPES[facility.type] || facility.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{facility.description}</p>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Capacity:</span> {facility.capacity}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="microplastics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Microplastics Summary</CardTitle>
              <CardDescription>{profile.microplastics.overview}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{profile.microplastics.avgConcentration}</div>
                  <div className="text-sm text-muted-foreground">Avg Concentration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.microplastics.hotspots}</div>
                  <div className="text-sm text-muted-foreground">Hotspots</div>
                </div>
                <div>
                  <div className="text-2xl font-bold capitalize">{profile.microplastics.trend}</div>
                  <div className="text-sm text-muted-foreground">Trend</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            {microplastics.map(mp => (
              <Link key={mp.id} href={`/app/microplastics/${mp.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{mp.affectedArea}</CardTitle>
                      <Badge className={cn(SEVERITY_COLORS[mp.severity], "text-white")}>
                        {mp.severity}
                      </Badge>
                    </div>
                    <CardDescription>{mp.source}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{mp.description}</p>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Concentration:</span> {mp.metrics.concentration}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Related Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/app/biochem/activated-sludge">
                <FlaskConical className="h-4 w-4 mr-2" />
                Simulate Treatment
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/app/map">
                <MapPin className="h-4 w-4 mr-2" />
                View on Map
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReportIssueDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        reportType="city_page"
        route={`/app/contamination/${citySlug}`}
        citySlug={citySlug}
      />
    </div>
  )
}
