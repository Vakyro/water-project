"use client"

import { use, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { mockFacilities, facilityPerformanceData, treatmentStages } from '@/src/data/facilities'
import type { MockFacility } from '@/src/data/facilities'
import { ArrowLeft, Download, MapPin, Activity, Droplets, Users, AlertTriangle, CheckCircle2, Settings, Clock } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useToast } from '@/components/ui/use-toast'

const statusColors: Record<string, string> = {
  operational: 'bg-teal-100 text-teal-800',
  maintenance: 'bg-sky-100 text-sky-800',
  'under-construction': 'bg-blue-100 text-blue-800',
  decommissioned: 'bg-slate-100 text-slate-600',
}

export default function FacilityDetailPage({ params }: { params: Promise<{ facilityId: string }> }) {
  const { facilityId } = use(params)
  const baseFacility = mockFacilities.find(f => f.id === facilityId)
  const [facility, setFacility] = useState<MockFacility | undefined>(baseFacility)
  const [configOpen, setConfigOpen] = useState(false)
  const [editFields, setEditFields] = useState<Partial<MockFacility>>({})
  const { toast } = useToast()

  const handleExport = () => {
    if (!facility) return
    const data = JSON.stringify(facility, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facility-${facility.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const openConfigure = () => {
    if (!facility) return
    setEditFields({
      name: facility.name,
      status: facility.status,
      capacity: facility.capacity,
      description: facility.description,
      currentLoad: facility.currentLoad,
      efficiency: facility.efficiency,
    })
    setConfigOpen(true)
  }

  const handleSave = () => {
    setFacility(prev => prev ? { ...prev, ...editFields } : prev)
    setConfigOpen(false)
    toast({ title: 'Changes saved', description: 'Facility data updated successfully.' })
  }

  if (!facility) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Facility Not Found</h2>
        <p className="text-muted-foreground">The facility you are looking for does not exist.</p>
        <Link href="/app/facilities">
          <Button>Back to Facilities</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/app/facilities" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Facilities
        </Link>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={statusColors[facility.status]}>{facility.status}</Badge>
              <Badge variant="outline">{facility.type.replace(/-/g, ' ')}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-balance">{facility.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {facility.city}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {facility.populationServed.toLocaleString()} served
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Built {facility.yearBuilt}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" onClick={openConfigure}>
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facility.capacity}</div>
            <p className="text-xs text-muted-foreground">design capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facility.currentLoad}%</div>
            <Progress value={facility.currentLoad} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{facility.efficiency}%</div>
            <p className="text-xs text-muted-foreground">treatment efficiency</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${facility.alerts > 0 ? 'text-sky-600' : 'text-teal-600'}`}>
              {facility.alerts}
            </div>
            {facility.alerts === 0 && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                All systems normal
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Process</TabsTrigger>
          <TabsTrigger value="quality">Water Quality</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Flow Rate</CardTitle>
                <CardDescription>Processed water volume over the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={facilityPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="flow" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption</CardTitle>
                <CardDescription>kWh usage per day</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={facilityPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="energy" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Operational Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Uptime (30 days)</p>
                  <p className="text-xl font-bold">99.7%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
                  <p className="text-xl font-bold">4.2 hrs</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Chemical Usage</p>
                  <p className="text-xl font-bold">2,450 kg/day</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Sludge Output</p>
                  <p className="text-xl font-bold">12.5 tons/day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Process Stages</CardTitle>
              <CardDescription>Current status of each treatment stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentStages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{stage.name}</h4>
                        <Badge variant={stage.status === 'active' ? 'default' : 'secondary'}>
                          {stage.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Efficiency: <strong>{stage.efficiency}%</strong></span>
                        <span>Duration: <strong>{stage.duration} min</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quality" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Influent vs Effluent Quality</CardTitle>
                <CardDescription>Key parameters before and after treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { param: 'BOD (mg/L)', influent: 250, effluent: 8, limit: 10 },
                    { param: 'TSS (mg/L)', influent: 200, effluent: 5, limit: 10 },
                    { param: 'Ammonia (mg/L)', influent: 35, effluent: 1.5, limit: 2 },
                    { param: 'Total Nitrogen (mg/L)', influent: 45, effluent: 8, limit: 10 },
                    { param: 'Phosphorus (mg/L)', influent: 8, effluent: 0.5, limit: 1 },
                  ].map((item) => (
                    <div key={item.param} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.param}</span>
                        <span className={item.effluent <= item.limit ? 'text-emerald-600' : 'text-red-600'}>
                          {item.effluent <= item.limit ? 'Within Limit' : 'Exceeds Limit'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-blue-400 rounded-full"
                            style={{ width: `${(item.effluent / item.influent) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-20 text-right">
                          {item.influent} → {item.effluent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>Regulatory compliance for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-teal-50 border border-teal-200">
                    <CheckCircle2 className="h-8 w-8 text-teal-600" />
                    <div>
                      <p className="font-medium text-teal-900">100% Compliance</p>
                      <p className="text-sm text-teal-700">All discharge limits met</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border">
                      <p className="text-2xl font-bold">30</p>
                      <p className="text-sm text-muted-foreground">Days compliant</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Violations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Upcoming and recent maintenance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { task: 'Primary clarifier inspection', date: '2026-03-20', status: 'scheduled', priority: 'medium' },
                  { task: 'Pump station overhaul', date: '2026-03-25', status: 'scheduled', priority: 'high' },
                  { task: 'Filter media replacement', date: '2026-04-01', status: 'planned', priority: 'medium' },
                  { task: 'UV disinfection calibration', date: '2026-03-15', status: 'completed', priority: 'low' },
                  { task: 'SCADA system update', date: '2026-03-10', status: 'completed', priority: 'medium' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className={`h-2 w-2 rounded-full ${
                      item.priority === 'high' ? 'bg-blue-600' :
                      item.priority === 'medium' ? 'bg-sky-400' : 'bg-teal-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{item.task}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'secondary' : 'outline'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configure Sheet */}
      <Sheet open={configOpen} onOpenChange={setConfigOpen}>
        <SheetContent className="w-[400px] sm:w-[480px]">
          <SheetHeader>
            <SheetTitle>Configure Facility</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={editFields.name ?? ''}
                onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={editFields.status ?? 'operational'}
                onValueChange={v => setEditFields(f => ({ ...f, status: v as MockFacility['status'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="under-construction">Under Construction</SelectItem>
                  <SelectItem value="decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Capacity</Label>
              <Input
                value={editFields.capacity ?? ''}
                onChange={e => setEditFields(f => ({ ...f, capacity: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Current Load (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={editFields.currentLoad ?? 0}
                onChange={e => setEditFields(f => ({ ...f, currentLoad: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Efficiency (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={editFields.efficiency ?? 0}
                onChange={e => setEditFields(f => ({ ...f, efficiency: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={editFields.description ?? ''}
                onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
