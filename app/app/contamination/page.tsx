import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cities, cityProfiles } from '@/src/data/cities'
import { contaminationMarkers } from '@/src/data/water-quality'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SEVERITY_COLORS } from '@/src/core/constants'

export default function ContaminationListPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contamination Overview</h2>
        <p className="text-muted-foreground">
          Explore water contamination data across cities in the border region.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contaminationMarkers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {contaminationMarkers.filter(c => c.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {contaminationMarkers.filter(c => c.severity === 'high').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medium/Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-500">
              {contaminationMarkers.filter(c => c.severity === 'medium' || c.severity === 'low').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {cities.map(city => {
          const profile = cityProfiles[city.slug]
          const cityMarkers = contaminationMarkers.filter(c => c.cityId === city.id)
          
          if (!profile) return null
          
          return (
            <Link key={city.id} href={`/app/contamination/${city.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn(
                        "h-5 w-5",
                        profile.waterContamination.riskLevel === 'critical' && "text-blue-700",
                        profile.waterContamination.riskLevel === 'high' && "text-blue-500",
                        profile.waterContamination.riskLevel === 'medium' && "text-sky-500",
                        profile.waterContamination.riskLevel === 'low' && "text-green-500",
                      )} />
                      <CardTitle>{city.name}</CardTitle>
                    </div>
                    <Badge className={cn(
                      SEVERITY_COLORS[profile.waterContamination.riskLevel],
                      "text-white capitalize"
                    )}>
                      {profile.waterContamination.riskLevel} risk
                    </Badge>
                  </div>
                  <CardDescription>
                    {city.state}, {city.country === 'mexico' ? 'Mexico' : 'USA'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {profile.waterContamination.overview}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.waterContamination.mainPollutants.slice(0, 3).map((pollutant, i) => (
                      <Badge key={i} variant="outline">{pollutant}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {cityMarkers.length} contamination site{cityMarkers.length !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      View details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
