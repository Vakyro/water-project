"use client"

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Play, Pause, RotateCcw, Info, Bug } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface LivePoint { hour: string; bod: number; do: number; mlss: number }

export default function ActivatedSludgePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [liveBuffer, setLiveBuffer] = useState<LivePoint[]>([])
  const simTimeRef = useRef(0)
  const [params, setParams] = useState({
    srt: 10, // Solids Retention Time (days)
    hrt: 6, // Hydraulic Retention Time (hours)
    doLevel: 2.0, // Dissolved Oxygen (mg/L)
    influnetBOD: 250, // Influent BOD (mg/L)
    temperature: 20, // Temperature (°C)
    mlss: 3000, // Mixed Liquor Suspended Solids (mg/L)
  })
  
  // Calculate outputs based on parameters
  const outputs = useMemo(() => {
    const { srt, hrt, doLevel, influnetBOD, temperature, mlss } = params
    
    // Simplified Monod kinetics calculations
    const muMax = 0.5 * Math.pow(1.07, temperature - 20) // Temperature corrected growth rate
    const Ks = 60 // Half-saturation constant
    const Y = 0.6 // Yield coefficient
    const kd = 0.06 * Math.pow(1.04, temperature - 20) // Decay coefficient
    
    // DO limitation factor
    const doFactor = doLevel / (doLevel + 0.5)
    
    // Effective growth rate
    const mu = muMax * doFactor * (influnetBOD / (Ks + influnetBOD))
    
    // Effluent BOD calculation
    const effluentBOD = Math.max(5, influnetBOD * Math.exp(-mu * hrt * Y))
    
    // Removal efficiency
    const bodRemoval = ((influnetBOD - effluentBOD) / influnetBOD) * 100
    
    // Sludge production
    const sludgeProduction = Y * (influnetBOD - effluentBOD) * 1000 / 1000 // kg/m3
    
    // Food to Microorganism ratio
    const fmRatio = (influnetBOD * 24) / (mlss * hrt)
    
    // Oxygen requirement
    const oxygenRequired = 1.5 * (influnetBOD - effluentBOD) + 4.6 * 0.1 * mlss
    
    return {
      effluentBOD: Math.round(effluentBOD * 10) / 10,
      bodRemoval: Math.round(bodRemoval * 10) / 10,
      sludgeProduction: Math.round(sludgeProduction * 100) / 100,
      fmRatio: Math.round(fmRatio * 100) / 100,
      oxygenRequired: Math.round(oxygenRequired),
      svi: Math.round(100 + (fmRatio - 0.3) * 200), // Sludge Volume Index
    }
  }, [params])
  
  // Deterministic baseline chart (no random — stable across renders)
  const baselineData = useMemo<LivePoint[]>(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      bod: Math.round(outputs.effluentBOD * (1 + Math.sin(i * Math.PI / 12) * 0.08) * 10) / 10,
      do: Math.round(Math.max(0.1, params.doLevel * (1 + Math.cos(i * Math.PI / 8) * 0.1)) * 10) / 10,
      mlss: Math.round(params.mlss * (1 + Math.sin(i * 0.4) * 0.02)),
    }))
  }, [outputs.effluentBOD, params.doLevel, params.mlss])

  // Clear live buffer when params change (so baseline reflects latest params)
  useEffect(() => { setLiveBuffer([]) }, [params])

  // Simulation tick
  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      simTimeRef.current++
      const t = simTimeRef.current
      const rn = () => 1 + (Math.random() - 0.5) * 0.14
      setLiveBuffer(buf => [
        ...buf.slice(-23),
        {
          hour: `T+${t}h`,
          bod: Math.max(1, Math.round(outputs.effluentBOD * rn() * 10) / 10),
          do: Math.max(0.1, Math.round(params.doLevel * rn() * 10) / 10),
          mlss: Math.round(params.mlss * (1 + (Math.random() - 0.5) * 0.04)),
        },
      ])
    }, 900)
    return () => clearInterval(id)
  }, [isRunning, outputs.effluentBOD, params.doLevel, params.mlss])

  const chartData = liveBuffer.length > 0 ? liveBuffer : baselineData

  const handleReset = () => {
    setIsRunning(false)
    setLiveBuffer([])
    simTimeRef.current = 0
    setParams({
      srt: 10,
      hrt: 6,
      doLevel: 2.0,
      influnetBOD: 250,
      temperature: 20,
      mlss: 3000,
    })
  }

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
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500 text-white">
              <Bug className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Activated Sludge Simulator</h1>
              <p className="text-muted-foreground">Biological wastewater treatment modeling</p>
            </div>
            {isRunning && (
              <Badge className="bg-emerald-100 text-emerald-800 animate-pulse">● LIVE</Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isRunning ? 'Pause' : 'Run'}
            </Button>
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
            <CardTitle>Process Parameters</CardTitle>
            <CardDescription>Adjust to see real-time effects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">SRT (days)</label>
                <span className="text-sm text-muted-foreground">{params.srt}</span>
              </div>
              <Slider
                value={[params.srt]}
                onValueChange={([v]) => setParams(p => ({ ...p, srt: v }))}
                min={3}
                max={30}
                step={1}
              />
              <p className="text-xs text-muted-foreground">Solids Retention Time: 3-30 days typical</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">HRT (hours)</label>
                <span className="text-sm text-muted-foreground">{params.hrt}</span>
              </div>
              <Slider
                value={[params.hrt]}
                onValueChange={([v]) => setParams(p => ({ ...p, hrt: v }))}
                min={2}
                max={12}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground">Hydraulic Retention Time: 4-8 hours typical</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">DO Level (mg/L)</label>
                <span className="text-sm text-muted-foreground">{params.doLevel}</span>
              </div>
              <Slider
                value={[params.doLevel]}
                onValueChange={([v]) => setParams(p => ({ ...p, doLevel: v }))}
                min={0.5}
                max={4}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">Target: 1.5-2.5 mg/L for optimal treatment</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Influent BOD (mg/L)</label>
                <span className="text-sm text-muted-foreground">{params.influnetBOD}</span>
              </div>
              <Slider
                value={[params.influnetBOD]}
                onValueChange={([v]) => setParams(p => ({ ...p, influnetBOD: v }))}
                min={100}
                max={500}
                step={10}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Temperature (C)</label>
                <span className="text-sm text-muted-foreground">{params.temperature}</span>
              </div>
              <Slider
                value={[params.temperature]}
                onValueChange={([v]) => setParams(p => ({ ...p, temperature: v }))}
                min={10}
                max={30}
                step={1}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">MLSS (mg/L)</label>
                <span className="text-sm text-muted-foreground">{params.mlss}</span>
              </div>
              <Slider
                value={[params.mlss]}
                onValueChange={([v]) => setParams(p => ({ ...p, mlss: v }))}
                min={1500}
                max={5000}
                step={100}
              />
              <p className="text-xs text-muted-foreground">Mixed Liquor Suspended Solids</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Outputs */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Effluent BOD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${outputs.effluentBOD <= 10 ? 'text-teal-600' : outputs.effluentBOD <= 20 ? 'text-sky-600' : 'text-destructive'}`}>
                  {outputs.effluentBOD} mg/L
                </div>
                <p className="text-xs text-muted-foreground">Target: {'<'}10 mg/L</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">BOD Removal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${outputs.bodRemoval >= 90 ? 'text-teal-600' : outputs.bodRemoval >= 80 ? 'text-sky-600' : 'text-destructive'}`}>
                  {outputs.bodRemoval}%
                </div>
                <p className="text-xs text-muted-foreground">Target: {'>'}90%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">F/M Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${outputs.fmRatio >= 0.2 && outputs.fmRatio <= 0.4 ? 'text-teal-600' : 'text-sky-600'}`}>
                  {outputs.fmRatio}
                </div>
                <p className="text-xs text-muted-foreground">Optimal: 0.2-0.4</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="oxygen">Oxygen Profile</TabsTrigger>
              <TabsTrigger value="settling">Settling</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>24-Hour BOD Profile</CardTitle>
                  <CardDescription>Simulated effluent quality over a typical day</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="bod" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Effluent BOD (mg/L)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="oxygen">
              <Card>
                <CardHeader>
                  <CardTitle>Dissolved Oxygen Profile</CardTitle>
                  <CardDescription>DO levels throughout the aeration basin</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis domain={[0, 4]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="do" stroke="#10b981" strokeWidth={2} name="DO (mg/L)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settling">
              <Card>
                <CardHeader>
                  <CardTitle>Sludge Settling Characteristics</CardTitle>
                  <CardDescription>SVI indicates settling quality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Sludge Volume Index (SVI)</p>
                        <p className={`text-3xl font-bold ${outputs.svi < 150 ? 'text-teal-600' : outputs.svi < 200 ? 'text-sky-600' : 'text-destructive'}`}>
                          {outputs.svi} mL/g
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {outputs.svi < 100 ? 'Excellent settling' :
                           outputs.svi < 150 ? 'Good settling' :
                           outputs.svi < 200 ? 'Fair settling' : 'Poor settling - risk of bulking'}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Sludge Production</p>
                        <p className="text-3xl font-bold">{outputs.sludgeProduction} kg/m3</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Settling Guidelines
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>SVI {'<'} 100: Excellent, dense sludge</li>
                        <li>SVI 100-150: Good settling</li>
                        <li>SVI 150-200: Fair, monitor closely</li>
                        <li>SVI {'>'} 200: Poor, bulking likely</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
