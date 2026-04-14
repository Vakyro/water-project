"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { microplasticsEntries, getAllMicroplastics } from '@/src/data/microplastics'
import { Search, Microscope, MapPin, ChevronRight, Droplets } from 'lucide-react'

const severityColors: Record<string, string> = {
  low: 'bg-teal-100 text-teal-800',
  medium: 'bg-sky-100 text-sky-800',
  high: 'bg-blue-100 text-blue-800',
  critical: 'bg-blue-200 text-blue-900',
}

export default function MicroplasticsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  
  const allEntries = getAllMicroplastics()
  
  // Group entries by severity for summary
  const bySeverity = allEntries.reduce((acc, entry) => {
    acc[entry.severity] = acc[entry.severity] || []
    acc[entry.severity].push(entry)
    return acc
  }, {} as Record<string, typeof allEntries>)
  
  const filteredEntries = allEntries.filter(entry => {
    const matchesSearch = 
      entry.affectedArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.metrics.particleTypes.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSeverity = selectedSeverity === 'all' || entry.severity === selectedSeverity
    return matchesSearch && matchesSeverity
  })

  // Calculate average concentration
  const avgConcentration = allEntries.reduce((sum, e) => {
    const val = parseFloat(e.metrics.concentration.split(' ')[0])
    return sum + val
  }, 0) / allEntries.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-balance">Microplastics Research Database</h1>
          <p className="text-muted-foreground">Comprehensive collection of microplastic contamination studies in the border region</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Microscope className="mr-1 h-3 w-3" />
          {allEntries.length} Studies
        </Badge>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allEntries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Concentration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgConcentration.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">particles/L</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {bySeverity.critical?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{bySeverity.high?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search locations, sources, polymers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredEntries.length} of {allEntries.length} studies
          </p>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="space-y-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <Link key={entry.id} href={`/app/microplastics/${entry.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <Badge className={severityColors[entry.severity]}>
                        {entry.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{entry.detectedDate}</span>
                    </div>
                    <CardTitle className="text-base line-clamp-2 mt-2">{entry.affectedArea}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {entry.source}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Concentration</span>
                        <span className="font-medium">{entry.metrics.concentration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entry.metrics.particleTypes.slice(0, 3).map((polymer) => (
                          <Badge key={polymer} variant="secondary" className="text-xs">
                            {polymer}
                          </Badge>
                        ))}
                        {entry.metrics.particleTypes.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{entry.metrics.particleTypes.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {entry.metrics.sampleCount} samples at {entry.metrics.sampleDepth}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-2">
          {filteredEntries.map((entry) => (
            <Link key={entry.id} href={`/app/microplastics/${entry.id}`}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={severityColors[entry.severity]}>{entry.severity}</Badge>
                    </div>
                    <h3 className="font-medium truncate">{entry.affectedArea}</h3>
                    <p className="text-sm text-muted-foreground">{entry.source}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.metrics.concentration}</p>
                    <p className="text-xs text-muted-foreground">{entry.detectedDate}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
