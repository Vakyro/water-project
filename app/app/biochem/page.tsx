"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FlaskConical, Microscope, Activity, ShieldCheck, ChevronRight, Beaker, Bug, Zap } from 'lucide-react'

const labs = [
  {
    id: 'activated-sludge',
    title: 'Activated Sludge Simulator',
    description: 'Interactive biological wastewater treatment modeling with real-time parameter adjustments',
    icon: Bug,
    status: 'interactive',
    features: ['Biomass growth modeling', 'Oxygen transfer simulation', 'Settling characteristics', 'SRT/HRT optimization'],
    color: 'bg-emerald-500',
  },
  {
    id: 'disinfection',
    title: 'Disinfection Chemistry Lab',
    description: 'Explore chlorination kinetics, UV disinfection, and DBP formation',
    icon: Beaker,
    status: 'interactive',
    features: ['CT calculations', 'UV dose modeling', 'DBP precursor analysis', 'Pathogen inactivation'],
    color: 'bg-blue-500',
  },
  {
    id: 'qmra',
    title: 'QMRA Risk Explorer',
    description: 'Quantitative Microbial Risk Assessment for water reuse scenarios',
    icon: ShieldCheck,
    status: 'interactive',
    features: ['Dose-response models', 'Exposure scenarios', 'Risk characterization', 'Treatment barriers'],
    color: 'bg-blue-600',
  },
]

export default function BiochemLabPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-balance">Biochemistry Lab</h1>
          <p className="text-muted-foreground">Interactive simulations for water treatment processes and risk assessment</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <FlaskConical className="mr-1 h-3 w-3" />
          {labs.length} Simulators
        </Badge>
      </div>
      
      {/* Introduction Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10">
              <FlaskConical className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1">Research-Backed Interactive Learning</h2>
              <p className="text-muted-foreground">
                These simulators are based on established scientific models and EPA guidelines. 
                Adjust parameters in real-time to understand how water treatment processes work 
                and explore different scenarios for risk assessment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Lab Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {labs.map((lab) => (
          <Link key={lab.id} href={`/app/biochem/${lab.id}`}>
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-xl ${lab.color} text-white`}>
                    <lab.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{lab.status}</Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{lab.title}</CardTitle>
                <CardDescription>{lab.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Features</p>
                  <ul className="space-y-1">
                    {lab.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex items-center text-sm text-primary font-medium group-hover:underline">
                  Launch Simulator
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Educational Resources</CardTitle>
          <CardDescription>Learn more about the science behind these simulations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Activated Sludge Basics', type: 'Article' },
              { title: 'Disinfection Byproducts', type: 'Research Paper' },
              { title: 'QMRA Methodology', type: 'EPA Guide' },
              { title: 'Treatment Train Design', type: 'Interactive' },
            ].map((resource) => (
              <div key={resource.title} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <Badge variant="outline" className="mb-2">{resource.type}</Badge>
                <p className="font-medium">{resource.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
