"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockFacilities } from '@/src/data/facilities'
import { Search, Building2, Droplets, Users, AlertTriangle, ChevronRight, MapPin, Activity } from 'lucide-react'

const statusColors: Record<string, string> = {
  operational: 'bg-emerald-100 text-emerald-800',
  maintenance: 'bg-sky-100 text-sky-800',
  offline: 'bg-blue-100 text-blue-800',
  construction: 'bg-blue-100 text-blue-800',
}

const typeIcons: Record<string, React.ReactNode> = {
  treatment_plant: <Droplets className="h-5 w-5" />,
  pumping_station: <Activity className="h-5 w-5" />,
  reservoir: <Building2 className="h-5 w-5" />,
  desalination: <Droplets className="h-5 w-5" />,
}

export default function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  const filteredFacilities = mockFacilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.city.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || facility.type === selectedType
    const matchesStatus = selectedStatus === 'all' || facility.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalCapacity = mockFacilities.reduce((sum, f) => sum + f.capacity, 0)
  const operationalCount = mockFacilities.filter(f => f.status === 'operational').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-balance">Water Infrastructure Facilities</h1>
          <p className="text-muted-foreground">Treatment plants, pumping stations, and reservoirs in the border region</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Building2 className="mr-1 h-3 w-3" />
          {mockFacilities.length} Facilities
        </Badge>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFacilities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalCapacity / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">gallons/day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Operational</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{operationalCount}</div>
            <p className="text-xs text-muted-foreground">{Math.round(operationalCount / mockFacilities.length * 100)}% active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Population Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(mockFacilities.reduce((sum, f) => sum + f.populationServed, 0) / 1000000).toFixed(1)}M
            </div>
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
                placeholder="Search facilities or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Facility Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="treatment_plant">Treatment Plant</SelectItem>
                <SelectItem value="pumping_station">Pumping Station</SelectItem>
                <SelectItem value="reservoir">Reservoir</SelectItem>
                <SelectItem value="desalination">Desalination</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Showing {filteredFacilities.length} of {mockFacilities.length} facilities
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility) => (
            <Link key={facility.id} href={`/app/facility/${facility.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      {typeIcons[facility.type]}
                    </div>
                    <Badge className={statusColors[facility.status]}>
                      {facility.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{facility.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {facility.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{(facility.capacity / 1000000).toFixed(2)}M gpd</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Population Served</span>
                      <span className="font-medium">{facility.populationServed.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="font-medium">{facility.efficiency}%</span>
                    </div>
                    {facility.alerts > 0 && (
                      <div className="flex items-center gap-1 text-sky-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        {facility.alerts} active alert{facility.alerts > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
