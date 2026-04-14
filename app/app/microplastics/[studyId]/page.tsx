"use client"

import { use } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockMicroplasticStudies, microplasticSizeDistribution, microplasticPolymerData } from '@/src/data/microplastics'
import { ArrowLeft, Download, ExternalLink, Microscope, MapPin, Calendar, Users, AlertTriangle, Droplets, FileText } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const severityColors: Record<string, string> = {
  low: 'bg-teal-100 text-teal-800',
  medium: 'bg-sky-100 text-sky-800',
  high: 'bg-blue-100 text-blue-800',
  critical: 'bg-blue-200 text-blue-900',
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function MicroplasticDetailPage({ params }: { params: Promise<{ studyId: string }> }) {
  const { studyId } = use(params)
  const study = mockMicroplasticStudies.find(s => s.id === studyId)
  
  if (!study) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Study Not Found</h2>
        <p className="text-muted-foreground">The microplastic study you are looking for does not exist.</p>
        <Link href="/app/microplastics">
          <Button>Back to Studies</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/app/microplastics" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Studies
        </Link>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={severityColors[study.severity]}>{study.severity} severity</Badge>
              <Badge variant="outline">{study.sampleType}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-balance">{study.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {study.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {study.year}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {study.authors.join(', ')}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Full Paper
            </Button>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concentration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{study.concentration.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">particles per liter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Polymer Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{study.polymerTypes.length}</div>
            <p className="text-xs text-muted-foreground">identified types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Size Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{study.sizeRange.min}-{study.sizeRange.max}</div>
            <p className="text-xs text-muted-foreground">micrometers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sample Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{study.sampleSites}</div>
            <p className="text-xs text-muted-foreground">collection points</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="polymers">Polymer Analysis</TabsTrigger>
          <TabsTrigger value="size">Size Distribution</TabsTrigger>
          <TabsTrigger value="methods">Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Study Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{study.abstract}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Identified Polymers</h4>
                  <div className="flex flex-wrap gap-2">
                    {study.polymerTypes.map((polymer) => (
                      <Badge key={polymer} variant="secondary">{polymer}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Concentration by Source</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { source: 'Upstream', value: study.concentration * 0.6 },
                    { source: 'Midstream', value: study.concentration * 0.85 },
                    { source: 'Downstream', value: study.concentration },
                    { source: 'Effluent', value: study.concentration * 1.2 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Health Risk Assessment</CardTitle>
              <CardDescription>Potential health implications based on concentration levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${study.severity === 'critical' || study.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <h4 className="font-medium">Ingestion Risk</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {study.severity === 'critical' ? 'High concern for drinking water supplies' :
                     study.severity === 'high' ? 'Moderate concern, filtration recommended' :
                     'Low to moderate risk with standard treatment'}
                  </p>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${study.concentration > 2000 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <h4 className="font-medium">Ecosystem Impact</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {study.concentration > 2000 ? 'Significant impact on aquatic life documented' :
                     'Localized effects on filter-feeding organisms'}
                  </p>
                </div>
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <h4 className="font-medium">Treatment Efficacy</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Advanced filtration can remove 85-95% of detected microplastics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="polymers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Polymer Composition</CardTitle>
                <CardDescription>Distribution of identified polymer types</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={microplasticPolymerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {microplasticPolymerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Polymer Characteristics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {study.polymerTypes.map((polymer, index) => (
                    <div key={polymer} className="flex items-center gap-4">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{polymer}</p>
                        <p className="text-xs text-muted-foreground">
                          {polymer === 'PE' ? 'Polyethylene - Common in packaging' :
                           polymer === 'PP' ? 'Polypropylene - Food containers, textiles' :
                           polymer === 'PS' ? 'Polystyrene - Foam packaging' :
                           polymer === 'PET' ? 'Polyethylene Terephthalate - Bottles' :
                           polymer === 'PVC' ? 'Polyvinyl Chloride - Pipes, construction' :
                           'Various industrial applications'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {Math.round(100 / study.polymerTypes.length)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="size" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Size Distribution</CardTitle>
              <CardDescription>Particle count by size range (micrometers)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={microplasticSizeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Nanoplastics ({'<'}1μm)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">12%</div>
                <p className="text-xs text-muted-foreground">Highest bioaccumulation risk</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Small (1-100μm)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">58%</div>
                <p className="text-xs text-muted-foreground">Dominant size fraction</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Large ({'>'}100μm)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">30%</div>
                <p className="text-xs text-muted-foreground">Easier to filter</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Methodology</CardTitle>
              <CardDescription>Sample collection and analysis procedures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium">Sample Collection</h4>
                <p className="text-sm text-muted-foreground">{study.methodology.collection}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Analysis Techniques</h4>
                <p className="text-sm text-muted-foreground">{study.methodology.analysis}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Quality Control</h4>
                <p className="text-sm text-muted-foreground">{study.methodology.qc}</p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2">Key Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">FTIR Spectrometer</Badge>
                  <Badge variant="outline">Raman Microscope</Badge>
                  <Badge variant="outline">SEM Imaging</Badge>
                  <Badge variant="outline">Manta Net (333μm)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
