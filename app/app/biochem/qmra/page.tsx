"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ShieldCheck, RotateCcw, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ReferenceLine } from 'recharts'

const exposureScenarios = [
  { id: 'drinking', name: 'Drinking Water', volume: 2.0, frequency: 365 },
  { id: 'recreation', name: 'Recreational Swimming', volume: 0.1, frequency: 12 },
  { id: 'irrigation', name: 'Irrigation (lettuce)', volume: 0.01, frequency: 100 },
  { id: 'reuse', name: 'Non-potable Reuse', volume: 0.05, frequency: 100 },
]

const pathogens = [
  { id: 'cryptosporidium', name: 'Cryptosporidium', k: 0.0573, concentration: 10 },
  { id: 'giardia', name: 'Giardia', k: 0.0199, concentration: 100 },
  { id: 'rotavirus', name: 'Rotavirus', alpha: 0.253, beta: 0.422, concentration: 1000 },
  { id: 'campylobacter', name: 'Campylobacter', alpha: 0.145, beta: 7.589, concentration: 100 },
]

export default function QMRAPage() {
  const [scenario, setScenario] = useState('drinking')
  const [selectedPathogen, setSelectedPathogen] = useState('cryptosporidium')
  const [params, setParams] = useState({
    sourceConcentration: 100, // organisms/L
    treatmentLogRemoval: 4, // log reduction
    exposureVolume: 2.0, // L/event
    exposureFrequency: 365, // events/year
    acceptableRisk: -4, // 10^-4 annual risk
  })
  
  // Calculate QMRA results
  const results = useMemo(() => {
    const { sourceConcentration, treatmentLogRemoval, exposureVolume, exposureFrequency, acceptableRisk } = params
    const pathogen = pathogens.find(p => p.id === selectedPathogen)!
    
    // Calculate dose
    const treatedConcentration = sourceConcentration / Math.pow(10, treatmentLogRemoval)
    const dosePerEvent = treatedConcentration * exposureVolume
    
    // Calculate probability of infection using exponential or beta-Poisson model
    let pInfection: number
    if ('k' in pathogen) {
      // Exponential model
      pInfection = 1 - Math.exp(-pathogen.k * dosePerEvent)
    } else {
      // Beta-Poisson model
      const { alpha, beta } = pathogen as { alpha: number; beta: number; name: string; id: string; concentration: number }
      pInfection = 1 - Math.pow(1 + dosePerEvent / beta, -alpha)
    }
    
    // Annual risk
    const annualRisk = 1 - Math.pow(1 - pInfection, exposureFrequency)
    
    // DALY calculation (simplified)
    const diseaseBurden = 0.001 // DALYs per case (simplified)
    const illnessRate = 0.5 // probability of illness given infection
    const dalysPerYear = annualRisk * illnessRate * diseaseBurden * 100000 // per 100,000 people
    
    // Required log removal to meet target
    const targetAnnualRisk = Math.pow(10, acceptableRisk)
    const requiredPinfection = 1 - Math.pow(1 - targetAnnualRisk, 1 / exposureFrequency)
    let requiredDose: number
    if ('k' in pathogen) {
      requiredDose = -Math.log(1 - requiredPinfection) / pathogen.k
    } else {
      const { alpha, beta } = pathogen as { alpha: number; beta: number; name: string; id: string; concentration: number }
      requiredDose = beta * (Math.pow(1 - requiredPinfection, -1/alpha) - 1)
    }
    const requiredLogRemoval = Math.max(0, Math.log10((sourceConcentration * exposureVolume) / requiredDose))
    
    // Sensitivity data
    const sensitivityData = Array.from({ length: 7 }, (_, i) => {
      const logRemoval = i + 1
      const treated = sourceConcentration / Math.pow(10, logRemoval)
      const dose = treated * exposureVolume
      let pInf: number
      if ('k' in pathogen) {
        pInf = 1 - Math.exp(-pathogen.k * dose)
      } else {
        const { alpha, beta } = pathogen as { alpha: number; beta: number; name: string; id: string; concentration: number }
        pInf = 1 - Math.pow(1 + dose / beta, -alpha)
      }
      const annRisk = 1 - Math.pow(1 - pInf, exposureFrequency)
      return {
        logRemoval: `${logRemoval}-log`,
        risk: annRisk,
        riskLog: Math.log10(Math.max(annRisk, 1e-12)),
      }
    })
    
    return {
      treatedConcentration: treatedConcentration.toExponential(2),
      dosePerEvent: dosePerEvent.toExponential(2),
      pInfection: pInfection.toExponential(2),
      annualRisk: annualRisk.toExponential(2),
      annualRiskLog: Math.log10(Math.max(annualRisk, 1e-12)).toFixed(1),
      dalysPerYear: dalysPerYear.toFixed(2),
      requiredLogRemoval: Math.ceil(requiredLogRemoval * 10) / 10,
      meetsTarget: annualRisk <= targetAnnualRisk,
      sensitivityData,
      targetRiskLine: acceptableRisk,
    }
  }, [params, selectedPathogen])

  const handleReset = () => {
    setParams({
      sourceConcentration: 100,
      treatmentLogRemoval: 4,
      exposureVolume: 2.0,
      exposureFrequency: 365,
      acceptableRisk: -4,
    })
  }

  const handleScenarioChange = (scenarioId: string) => {
    setScenario(scenarioId)
    const s = exposureScenarios.find(e => e.id === scenarioId)!
    setParams(p => ({
      ...p,
      exposureVolume: s.volume,
      exposureFrequency: s.frequency,
    }))
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
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">QMRA Risk Explorer</h1>
              <p className="text-muted-foreground">Quantitative Microbial Risk Assessment</p>
            </div>
          </div>
          
          <div className="flex gap-2">
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
            <CardTitle>Assessment Parameters</CardTitle>
            <CardDescription>Define exposure scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exposure Scenario</label>
              <Select value={scenario} onValueChange={handleScenarioChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {exposureScenarios.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Pathogen</label>
              <Select value={selectedPathogen} onValueChange={setSelectedPathogen}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pathogen" />
                </SelectTrigger>
                <SelectContent>
                  {pathogens.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Source Concentration</label>
                <span className="text-sm text-muted-foreground">{params.sourceConcentration} org/L</span>
              </div>
              <Slider
                value={[Math.log10(params.sourceConcentration)]}
                onValueChange={([v]) => setParams(p => ({ ...p, sourceConcentration: Math.pow(10, v) }))}
                min={0}
                max={6}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">10^0 to 10^6 organisms/L</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Treatment Log Removal</label>
                <span className="text-sm text-muted-foreground">{params.treatmentLogRemoval}-log</span>
              </div>
              <Slider
                value={[params.treatmentLogRemoval]}
                onValueChange={([v]) => setParams(p => ({ ...p, treatmentLogRemoval: v }))}
                min={0}
                max={8}
                step={0.5}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Exposure Volume (L)</label>
                <span className="text-sm text-muted-foreground">{params.exposureVolume}</span>
              </div>
              <Slider
                value={[params.exposureVolume * 100]}
                onValueChange={([v]) => setParams(p => ({ ...p, exposureVolume: v / 100 }))}
                min={1}
                max={500}
                step={1}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Exposures per Year</label>
                <span className="text-sm text-muted-foreground">{params.exposureFrequency}</span>
              </div>
              <Slider
                value={[params.exposureFrequency]}
                onValueChange={([v]) => setParams(p => ({ ...p, exposureFrequency: v }))}
                min={1}
                max={365}
                step={1}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Acceptable Risk Target</label>
                <span className="text-sm text-muted-foreground">10^{params.acceptableRisk}</span>
              </div>
              <Slider
                value={[params.acceptableRisk]}
                onValueChange={([v]) => setParams(p => ({ ...p, acceptableRisk: v }))}
                min={-6}
                max={-2}
                step={1}
              />
              <p className="text-xs text-muted-foreground">EPA benchmark: 10^-4 annual risk</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Assessment Summary */}
          <Card className={results.meetsTarget ? 'border-teal-300' : 'border-rose-300'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                {results.meetsTarget ? (
                  <CheckCircle2 className="h-10 w-10 text-teal-600" />
                ) : (
                  <AlertTriangle className="h-10 w-10 text-destructive" />
                )}
                <div>
                  <h3 className={`text-lg font-semibold ${results.meetsTarget ? 'text-teal-900 dark:text-teal-300' : 'text-rose-900 dark:text-rose-300'}`}>
                    {results.meetsTarget ? 'Risk Target Met' : 'Risk Target Exceeded'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Annual infection risk: {results.annualRisk} (10^{results.annualRiskLog})
                    {!results.meetsTarget && ` — Need ${results.requiredLogRemoval}-log treatment`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Treated Conc.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{results.treatedConcentration}</div>
                <p className="text-xs text-muted-foreground">org/L</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Dose/Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{results.dosePerEvent}</div>
                <p className="text-xs text-muted-foreground">organisms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">P(infection)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{results.pInfection}</div>
                <p className="text-xs text-muted-foreground">per event</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">DALYs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{results.dalysPerYear}</div>
                <p className="text-xs text-muted-foreground">per 100k/year</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Sensitivity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Sensitivity Analysis</CardTitle>
              <CardDescription>Annual risk vs log removal — dashed line marks your acceptable risk target</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.sensitivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="logRemoval" />
                  <YAxis
                    dataKey="riskLog"
                    domain={[-12, 0]}
                    tickFormatter={(v) => `10^${v}`}
                    label={{ value: 'log₁₀(Risk)', angle: -90, position: 'insideLeft', offset: 10 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === 'riskLog' ? [`10^${value.toFixed(1)}`, 'Annual Risk'] : [value, name]
                    }
                    labelFormatter={(label) => `Treatment: ${label}`}
                  />
                  <ReferenceLine
                    y={params.acceptableRisk}
                    stroke="#f59e0b"
                    strokeDasharray="6 3"
                    label={{ value: 'Target', position: 'insideTopRight', fill: '#f59e0b', fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="riskLog"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    name="Annual Risk"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Methodology Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                QMRA Methodology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Dose-Response Models</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Cryptosporidium: Exponential (k=0.0573)</li>
                    <li>Giardia: Exponential (k=0.0199)</li>
                    <li>Rotavirus: Beta-Poisson (a=0.253, b=0.422)</li>
                    <li>Campylobacter: Beta-Poisson (a=0.145, b=7.589)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Key Assumptions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Point estimate approach (no Monte Carlo)</li>
                    <li>Independent exposure events</li>
                    <li>No immunity development</li>
                    <li>Simplified DALY calculations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
