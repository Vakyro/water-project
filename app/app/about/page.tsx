"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Database, FlaskConical, Users, Mail, ExternalLink, Github, FileText, Shield, Globe } from 'lucide-react'

const dataSources = [
  { name: 'EPA Water Quality Portal', type: 'Government', url: '#', description: 'Official US EPA water quality monitoring data' },
  { name: 'CONAGUA', type: 'Government', url: '#', description: 'Mexican national water commission data' },
  { name: 'IBWC/CILA', type: 'Binational', url: '#', description: 'International Boundary and Water Commission' },
  { name: 'Academic Research', type: 'Research', url: '#', description: 'Peer-reviewed publications from regional universities' },
  { name: 'Municipal Reports', type: 'Local', url: '#', description: 'City and county water utility reports' },
  { name: 'Satellite Imagery', type: 'Remote Sensing', url: '#', description: 'Landsat and Sentinel-2 water body analysis' },
]

const methodologies = [
  {
    title: 'Water Quality Index Calculation',
    description: 'We use a modified NSF Water Quality Index incorporating pH, dissolved oxygen, BOD, temperature change, total phosphates, nitrates, turbidity, and fecal coliform.',
    citations: ['Brown et al., 1970', 'Cude, 2001'],
  },
  {
    title: 'Microplastic Quantification',
    description: 'Sample processing follows NOAA protocols with visual identification, FTIR spectroscopy, and Raman microscopy for polymer identification.',
    citations: ['Masura et al., 2015', 'Hidalgo-Ruz et al., 2012'],
  },
  {
    title: 'Risk Assessment (QMRA)',
    description: 'Quantitative Microbial Risk Assessment using WHO and EPA dose-response models for waterborne pathogens.',
    citations: ['Haas et al., 2014', 'WHO Guidelines, 2017'],
  },
  {
    title: 'Treatment Process Modeling',
    description: 'Activated sludge models based on IWA ASM1/ASM2d frameworks with site-specific calibration.',
    citations: ['Henze et al., 2000', 'Rieger et al., 2012'],
  },
]

const team = [
  { name: 'Dr. Maria Garcia', role: 'Lead Researcher', affiliation: 'UCSD Scripps' },
  { name: 'Dr. Carlos Mendez', role: 'Water Quality Expert', affiliation: 'UABC' },
  { name: 'Dr. Sarah Chen', role: 'Environmental Engineer', affiliation: 'SDSU' },
  { name: 'Dr. Roberto Silva', role: 'Public Health Advisor', affiliation: 'CICESE' },
]

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-balance">About / Methods</h1>
          <p className="text-muted-foreground">Data sources, methodologies, and research team information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Download Methods PDF
          </Button>
          <Button variant="outline" size="sm">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </div>
      </div>
      
      {/* Mission Statement */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10">
              <Globe className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p className="text-muted-foreground">
                The Water Quality Analysis Platform provides transparent, research-backed environmental intelligence 
                for the Baja California and Southern California border region. We aggregate data from multiple sources, 
                apply rigorous scientific methodologies, and present findings in accessible formats to support 
                informed decision-making by communities, researchers, and policymakers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs */}
      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="methods">Methodologies</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="transparency">Transparency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Sources
              </CardTitle>
              <CardDescription>
                We aggregate data from government agencies, research institutions, and validated community reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {dataSources.map((source) => (
                  <div key={source.name} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{source.name}</h4>
                      <Badge variant="outline">{source.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      View Source <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Update Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-3xl font-bold text-primary">Daily</p>
                  <p className="text-sm text-muted-foreground">Real-time monitoring stations</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-3xl font-bold text-primary">Weekly</p>
                  <p className="text-sm text-muted-foreground">Facility performance data</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-3xl font-bold text-primary">Monthly</p>
                  <p className="text-sm text-muted-foreground">Research publications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Scientific Methodologies
              </CardTitle>
              <CardDescription>
                All analyses follow peer-reviewed protocols and industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {methodologies.map((method) => (
                  <div key={method.title} className="pb-6 border-b last:border-0 last:pb-0">
                    <h4 className="font-medium mb-2">{method.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {method.citations.map((cite) => (
                        <Badge key={cite} variant="secondary" className="text-xs">
                          <BookOpen className="mr-1 h-3 w-3" />
                          {cite}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Data Validation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated outlier detection and manual expert review for all incoming data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Uncertainty Quantification</h4>
                    <p className="text-sm text-muted-foreground">
                      Confidence intervals and measurement uncertainty reported where available
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Peer Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Key findings reviewed by independent domain experts before publication
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Version Control</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete audit trail for all data changes and methodology updates
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Research Team
              </CardTitle>
              <CardDescription>
                A binational team of environmental scientists and engineers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {team.map((member) => (
                  <div key={member.name} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.affiliation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Partner Institutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {['UC San Diego', 'UABC', 'San Diego State University', 'CICESE', 'Scripps Institution of Oceanography', 'COLEF', 'Imperial Valley College'].map((inst) => (
                  <Badge key={inst} variant="secondary" className="py-2 px-4">
                    {inst}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">research@waterquality-platform.org</p>
                    <p className="text-sm text-muted-foreground">For research inquiries and collaboration</p>
                  </div>
                </div>
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transparency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transparency Commitment</CardTitle>
              <CardDescription>
                We believe in open science and transparent data practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <h4 className="font-medium text-emerald-900 mb-2">Open Data</h4>
                  <p className="text-sm text-emerald-700">
                    All aggregated datasets are available for download in standard formats (CSV, JSON, GeoJSON)
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Open Source</h4>
                  <p className="text-sm text-blue-700">
                    Platform code and analysis scripts are available on GitHub under MIT license
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-sky-50 border border-sky-200">
                  <h4 className="font-medium text-sky-900 mb-2">Community Verification</h4>
                  <p className="text-sm text-sky-700">
                    Anyone can report issues, suggest corrections, and participate in data verification
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                  <h4 className="font-medium text-teal-900 mb-2">Funding Disclosure</h4>
                  <p className="text-sm text-teal-700">
                    All funding sources and potential conflicts of interest are publicly disclosed
                  </p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Current Funders</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">NSF Grant #12345678</Badge>
                  <Badge variant="outline">EPA Region 9</Badge>
                  <Badge variant="outline">CONACYT</Badge>
                  <Badge variant="outline">CalEPA</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Limitations & Caveats</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">*</span>
                  Data may not reflect real-time conditions; monitoring frequency varies by location
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">*</span>
                  Model predictions are estimates and should not replace professional assessments
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">*</span>
                  Historical data may have different quality standards than current measurements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">*</span>
                  Cross-border data integration involves reconciling different measurement protocols
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">*</span>
                  Platform is for informational purposes only; consult local authorities for health advisories
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
