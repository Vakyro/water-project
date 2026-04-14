import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Map, 
  Building2, 
  Droplets, 
  AlertTriangle, 
  CircleDot, 
  FlaskConical,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { cities } from '@/src/data/cities'
import { facilities } from '@/src/data/facilities'
import { microplasticsEntries } from '@/src/data/microplastics'
import { waterQualityPoints, contaminationMarkers } from '@/src/data/water-quality'

const quickActions = [
  { href: '/app/map', icon: Map, label: 'Explore Map', description: 'View regional water infrastructure' },
  { href: '/app/biochem', icon: FlaskConical, label: 'Biochemistry Lab', description: 'Run simulations' },
  { href: '/app/water-analysis', icon: Droplets, label: 'Water Analysis', description: 'Regional overview' },
]

const recentUpdates = [
  { 
    title: 'New water quality data for Imperial Beach',
    date: '2024-03-15',
    type: 'data',
  },
  { 
    title: 'Updated facility status for PTAR San Antonio',
    date: '2024-03-14',
    type: 'facility',
  },
  { 
    title: 'Added microplastics monitoring for New River',
    date: '2024-03-12',
    type: 'microplastics',
  },
]

export default function DashboardPage() {
  const totalCities = cities.length
  const totalFacilities = facilities.length
  const totalMicroplastics = microplasticsEntries.length
  const totalWaterQuality = waterQualityPoints.length
  const criticalContamination = contaminationMarkers.filter(c => c.severity === 'critical').length
  
  const poorWaterQuality = waterQualityPoints.filter(wq => wq.rating === 'poor').length
  const goodWaterQuality = waterQualityPoints.filter(wq => wq.rating === 'good' || wq.rating === 'excellent').length

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Regional Overview</h2>
        <p className="text-muted-foreground">
          Water quality intelligence for the Baja California - Southern California border region.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitored Cities</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCities}</div>
            <p className="text-xs text-muted-foreground">
              Across Mexico and USA
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacilities}</div>
            <p className="text-xs text-muted-foreground">
              Treatment plants and stations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Stations</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWaterQuality}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-teal-600">{goodWaterQuality} good</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-destructive">{poorWaterQuality} poor</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalContamination}</div>
            <p className="text-xs text-muted-foreground">
              Contamination areas requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Updates */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to key features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link 
                key={action.href} 
                href={action.href}
                className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest data changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-chart-2 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{update.title}</div>
                  <div className="text-xs text-muted-foreground">{update.date}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Regional Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Microplastics Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDot className="h-5 w-5" />
              Microplastics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{totalMicroplastics}</div>
            <p className="text-sm text-muted-foreground mb-4">Monitored hotspots</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Critical severity</span>
                <Badge variant="destructive">
                  {microplasticsEntries.filter(m => m.severity === 'critical').length}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>High severity</span>
                <Badge variant="outline" className="border-amber-600 text-amber-600">
                  {microplasticsEntries.filter(m => m.severity === 'high').length}
                </Badge>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/app/microplastics">View All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Contamination Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Contamination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{contaminationMarkers.length}</div>
            <p className="text-sm text-muted-foreground mb-4">Active contamination sites</p>
            <div className="space-y-2">
              {['Tijuana', 'Imperial Beach', 'Mexicali'].map(city => {
                const count = contaminationMarkers.filter(c => 
                  cities.find(ct => ct.name === city)?.id === c.cityId
                ).length
                return (
                  <div key={city} className="flex justify-between text-sm">
                    <span>{city}</span>
                    <span className="font-medium">{count} sites</span>
                  </div>
                )
              })}
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/app/contamination">View All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Trends Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Cross-border flows</span>
              <div className="flex items-center gap-1 text-destructive">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Elevated</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Microplastic levels</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Minus className="h-4 w-4" />
                <span className="text-sm font-medium">Stable</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Treatment capacity</span>
              <div className="flex items-center gap-1 text-teal-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Improving</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Beach water quality</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Variable</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
