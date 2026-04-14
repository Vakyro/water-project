"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Beaker, Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const pathogens = [
  { id: 'ecoli', name: 'E. coli', ctRequired: 1.0, uvDose: 6 },
  { id: 'giardia', name: 'Giardia', ctRequired: 104, uvDose: 22 },
  { id: 'cryptosporidium', name: 'Cryptosporidium', ctRequired: 1006, uvDose: 12 },
  { id: 'virus', name: 'Enteric Viruses', ctRequired: 4, uvDose: 36 },
]

export default function DisinfectionLabPage() {
  const [disinfectionType, setDisinfectionType] = useState<'chlorine' | 'uv'>('chlorine')
  const [params, setParams] = useState({
    // Chlorine parameters
    chlorineDose: 2.0, // mg/L
    contactTime: 30, // minutes
    ph: 7.0,
    temperature: 20, // °C
    turbidity: 1, // NTU
    // UV parameters
    uvIntensity: 40, // mJ/cm²
    transmittance: 65, // % UVT
    flowRate: 100, // gallons per minute
  })
  
  // Calculate CT value and log reductions
  const chlorineResults = useMemo(() => {
    const { chlorineDose, contactTime, ph, temperature, turbidity } = params
    
    // Calculate free chlorine residual (simplified)
    const chlorineDemand = turbidity * 0.5
    const freeChlorine = Math.max(0.2, chlorineDose - chlorineDemand)
    
    // CT value calculation
    const ct = freeChlorine * contactTime
    
    // pH adjustment factor (HOCl is more effective at lower pH)
    const phFactor = Math.pow(10, (7 - ph) * 0.3)
    
    // Temperature adjustment
    const tempFactor = Math.pow(1.05, temperature - 20)
    
    // Effective CT
    const effectiveCT = ct * phFactor * tempFactor
    
    // Log reductions for each pathogen
    const logReductions = pathogens.map(p => ({
      pathogen: p.name,
      logReduction: Math.min(6, effectiveCT / p.ctRequired * 4),
      required: 4,
      achieved: effectiveCT >= p.ctRequired,
    }))
    
    // DBP formation estimates (simplified)
    const tthm = chlorineDose * 15 * (1 + (temperature - 20) * 0.05) * (1 + (ph - 7) * 0.1)
    const haa5 = chlorineDose * 10 * (1 + (temperature - 20) * 0.03)
    
    return {
      freeChlorine: Math.round(freeChlorine * 100) / 100,
      ct: Math.round(ct * 10) / 10,
      effectiveCT: Math.round(effectiveCT * 10) / 10,
      logReductions,
      tthm: Math.round(tthm),
      haa5: Math.round(haa5),
    }
  }, [params])
  
  // Calculate UV disinfection results
  const uvResults = useMemo(() => {
    const { uvIntensity, transmittance, flowRate } = params
    
    // Calculate actual UV dose delivered
    const transmittanceFactor = transmittance / 100
    const actualDose = uvIntensity * transmittanceFactor
    
    // Log reductions for each pathogen
    const logReductions = pathogens.map(p => ({
      pathogen: p.name,
      logReduction: Math.min(6, actualDose / p.uvDose * 4),
      required: 4,
      achieved: actualDose >= p.uvDose,
    }))
    
    return {
      actualDose: Math.round(actualDose * 10) / 10,
      logReductions,
      powerConsumption: Math.round(flowRate * 0.5 * (uvIntensity / 40)),
    }
  }, [params])

  const handleReset = () => {
    setParams({
      chlorineDose: 2.0,
      contactTime: 30,
      ph: 7.0,
      temperature: 20,
      turbidity: 1,
      uvIntensity: 40,
      transmittance: 65,
      flowRate: 100,
    })
  }

  const currentResults = disinfectionType === 'chlorine' ? chlorineResults : uvResults

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/app/biochem" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Biochemistry Lab
        </Link>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500 text-white">
              <Beaker className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Disinfection Chemistry Lab</h1>
              <p className="text-muted-foreground">Chlorination and UV disinfection modeling</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={disinfectionType} onValueChange={(v: 'chlorine' | 'uv') => setDisinfectionType(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Disinfection Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chlorine">Chlorination</SelectItem>
                <SelectItem value="uv">UV Disinfection</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Parameters Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{disinfectionType === 'chlorine' ? 'Chlorination' : 'UV'} Parameters</CardTitle>
            <CardDescription>Adjust process variables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {disinfectionType === 'chlorine' ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Chlorine Dose (mg/L)</label>
                    <span className="text-sm text-muted-foreground">{params.chlorineDose}</span>
                  </div>
                  <Slider
                    value={[params.chlorineDose]}
                    onValueChange={([v]) => setParams(p => ({ ...p, chlorineDose: v }))}
                    min={0.5}
                    max={5}
                    step={0.1}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Contact Time (min)</label>
                    <span className="text-sm text-muted-foreground">{params.contactTime}</span>
                  </div>
                  <Slider
                    value={[params.contactTime]}
                    onValueChange={([v]) => setParams(p => ({ ...p, contactTime: v }))}
                    min={10}
                    max={120}
                    step={5}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">pH</label>
                    <span className="text-sm text-muted-foreground">{params.ph}</span>
                  </div>
                  <Slider
                    value={[params.ph]}
                    onValueChange={([v]) => setParams(p => ({ ...p, ph: v }))}
                    min={6}
                    max={9}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">Lower pH = more effective HOCl</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Temperature (C)</label>
                    <span className="text-sm text-muted-foreground">{params.temperature}</span>
                  </div>
                  <Slider
                    value={[params.temperature]}
                    onValueChange={([v]) => setParams(p => ({ ...p, temperature: v }))}
                    min={5}
                    max={30}
                    step={1}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Turbidity (NTU)</label>
                    <span className="text-sm text-muted-foreground">{params.turbidity}</span>
                  </div>
                  <Slider
                    value={[params.turbidity]}
                    onValueChange={([v]) => setParams(p => ({ ...p, turbidity: v }))}
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">UV Intensity (mJ/cm2)</label>
                    <span className="text-sm text-muted-foreground">{params.uvIntensity}</span>
                  </div>
                  <Slider
                    value={[params.uvIntensity]}
                    onValueChange={([v]) => setParams(p => ({ ...p, uvIntensity: v }))}
                    min={10}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">UV Transmittance (%)</label>
                    <span className="text-sm text-muted-foreground">{params.transmittance}</span>
                  </div>
                  <Slider
                    value={[params.transmittance]}
                    onValueChange={([v]) => setParams(p => ({ ...p, transmittance: v }))}
                    min={30}
                    max={98}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">Higher UVT = cleaner water</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Flow Rate (GPM)</label>
                    <span className="text-sm text-muted-foreground">{params.flowRate}</span>
                  </div>
                  <Slider
                    value={[params.flowRate]}
                    onValueChange={([v]) => setParams(p => ({ ...p, flowRate: v }))}
                    min={10}
                    max={500}
                    step={10}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Outputs */}
          <div className={`grid gap-4 ${disinfectionType === 'chlorine' ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            {disinfectionType === 'chlorine' ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">CT Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{chlorineResults.ct}</div>
                    <p className="text-xs text-muted-foreground">mg-min/L</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Free Chlorine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${chlorineResults.freeChlorine >= 0.5 ? 'text-teal-600' : 'text-sky-600'}`}>
                      {chlorineResults.freeChlorine} mg/L
                    </div>
                    <p className="text-xs text-muted-foreground">Residual</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">TTHM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${chlorineResults.tthm <= 80 ? 'text-teal-600' : 'text-destructive'}`}>
                      {chlorineResults.tthm} µg/L
                    </div>
                    <p className="text-xs text-muted-foreground">MCL: 80 µg/L</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">HAA5</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${chlorineResults.haa5 <= 60 ? 'text-teal-600' : 'text-destructive'}`}>
                      {chlorineResults.haa5} µg/L
                    </div>
                    <p className="text-xs text-muted-foreground">MCL: 60 µg/L</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Delivered Dose</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{uvResults.actualDose}</div>
                    <p className="text-xs text-muted-foreground">mJ/cm2</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Power Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{uvResults.powerConsumption}</div>
                    <p className="text-xs text-muted-foreground">kWh/day</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">No DBPs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Clean Process</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          {/* Log Reduction Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Pathogen Log Reduction</CardTitle>
              <CardDescription>Achieved vs required inactivation (4-log target)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentResults.logReductions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 6]} />
                  <YAxis dataKey="pathogen" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="logReduction" fill="#3b82f6" name="Achieved" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="required" fill="#e5e7eb" name="Required" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {currentResults.logReductions.map((p) => (
                  <div key={p.pathogen} className={`p-4 rounded-lg border ${p.achieved ? 'border-teal-200 bg-teal-50 dark:bg-teal-950/30' : 'border-rose-200 bg-rose-50 dark:bg-rose-950/30'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.pathogen}</span>
                      {p.achieved ? (
                        <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">Compliant</Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">Non-Compliant</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round(p.logReduction * 10) / 10}-log achieved of {p.required}-log required
                    </p>
                  </div>
                ))}
              </div>
              {disinfectionType === 'chlorine' && (
                <>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Disinfection Byproducts</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className={`p-4 rounded-lg border ${chlorineResults.tthm <= 80 ? 'border-teal-200 bg-teal-50 dark:bg-teal-950/30' : 'border-rose-200 bg-rose-50 dark:bg-rose-950/30'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">TTHM</span>
                        <Badge className={chlorineResults.tthm <= 80 ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}>
                          {chlorineResults.tthm <= 80 ? 'Compliant' : 'Exceeds MCL'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{chlorineResults.tthm} µg/L · MCL 80 µg/L</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${chlorineResults.haa5 <= 60 ? 'border-teal-200 bg-teal-50 dark:bg-teal-950/30' : 'border-rose-200 bg-rose-50 dark:bg-rose-950/30'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">HAA5</span>
                        <Badge className={chlorineResults.haa5 <= 60 ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}>
                          {chlorineResults.haa5 <= 60 ? 'Compliant' : 'Exceeds MCL'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{chlorineResults.haa5} µg/L · MCL 60 µg/L</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
