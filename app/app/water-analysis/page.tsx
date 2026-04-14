import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WaterQualityChart } from '@/components/charts/water-quality-chart'
import { cities, cityProfiles } from '@/src/data/cities'
import { waterQualityPoints } from '@/src/data/water-quality'
import { Droplets, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'

export default function WaterAnalysisPage() {
  const totalStations = waterQualityPoints.length
  const avgPh = waterQualityPoints.reduce((sum, wq) => sum + wq.metrics.ph, 0) / totalStations
  const avgSalinity = waterQualityPoints.reduce((sum, wq) => sum + wq.metrics.salinity, 0) / totalStations
  
  const qualityDistribution = {
    excellent: waterQualityPoints.filter(wq => wq.rating === 'excellent').length,
    good: waterQualityPoints.filter(wq => wq.rating === 'good').length,
    fair: waterQualityPoints.filter(wq => wq.rating === 'fair').length,
    poor: waterQualityPoints.filter(wq => wq.rating === 'poor').length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Water Analysis</h2>
        <p className="text-muted-foreground">
          Regional overview of water quality across the border region.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStations}</div>
            <p className="text-xs text-muted-foreground">Across 8 cities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average pH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPh.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Optimal: 6.5-8.5</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Salinity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSalinity.toFixed(1)} ppt</div>
            <p className="text-xs text-muted-foreground">Seawater average: 35 ppt</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quality Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1">
              <Badge className="bg-teal-600 text-white">{qualityDistribution.excellent}</Badge>
              <Badge className="bg-sky-500 text-white">{qualityDistribution.good}</Badge>
              <Badge className="bg-slate-500 text-white">{qualityDistribution.fair}</Badge>
              <Badge className="bg-rose-600 text-white">{qualityDistribution.poor}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Excellent / Good / Fair / Poor</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Water Quality by City</CardTitle>
            <CardDescription>Average pH and dissolved oxygen levels</CardDescription>
          </CardHeader>
          <CardContent>
            <WaterQualityChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Regional Trends</CardTitle>
            <CardDescription>Key water quality indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <div className="font-medium">Coastal Water Quality</div>
                <div className="text-sm text-muted-foreground">San Diego to Ensenada</div>
              </div>
              <div className="flex items-center gap-2 text-teal-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Improving</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <div className="font-medium">Cross-Border Flows</div>
                <div className="text-sm text-muted-foreground">Tijuana River watershed</div>
              </div>
              <div className="flex items-center gap-2 text-destructive">
                <TrendingDown className="h-4 w-4" />
                <span className="font-medium">Concerning</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div>
                <div className="font-medium">Agricultural Runoff</div>
                <div className="text-sm text-muted-foreground">Mexicali Valley</div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Minus className="h-4 w-4" />
                <span className="font-medium">Stable</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Summaries */}
      <Card>
        <CardHeader>
          <CardTitle>Water Quality by City</CardTitle>
          <CardDescription>Click to explore detailed city profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cities.map(city => {
              const profile = cityProfiles[city.slug]
              if (!profile) return null
              
              const ratingColors = {
                excellent: 'border-teal-400 bg-teal-50 dark:bg-teal-950/40',
                good: 'border-sky-400 bg-sky-50 dark:bg-sky-950/40',
                fair: 'border-slate-400 bg-slate-100 dark:bg-slate-800/40',
                poor: 'border-blue-500 bg-blue-50 dark:bg-blue-950/40',
              }
              
              return (
                <Link 
                  key={city.id} 
                  href={`/app/contamination/${city.slug}`}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${ratingColors[profile.waterQuality.overallRating]}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-4 w-4" />
                    <span className="font-medium">{city.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {profile.waterQuality.monitoringStations} stations
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {profile.waterQuality.overallRating}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
