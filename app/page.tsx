import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Map, 
  MessageSquare, 
  Building2, 
  FlaskConical, 
  ShieldCheck, 
  Waves,
  ArrowRight,
  Database,
  BookOpen,
  AlertTriangle
} from 'lucide-react'
import { LandingHeader } from '@/components/landing/landing-header'
import { LandingFooter } from '@/components/landing/landing-footer'

const features = [
  {
    icon: Map,
    title: 'Interactive Map',
    description: 'Explore water infrastructure, contamination sites, and quality monitoring stations across the border region.',
  },
  {
    icon: MessageSquare,
    title: 'Research Chatbot',
    description: 'Ask questions and receive research-backed answers with citations from scientific papers.',
  },
  {
    icon: Building2,
    title: 'City Dashboards',
    description: 'Detailed water quality profiles for cities in Baja California and Southern California.',
  },
  {
    icon: FlaskConical,
    title: 'Biochemistry Lab',
    description: 'Interactive simulations for activated sludge, disinfection chemistry, and microbial risk.',
  },
  {
    icon: ShieldCheck,
    title: 'Verification Center',
    description: 'Report incorrect information and help improve data accuracy across the platform.',
  },
  {
    icon: Waves,
    title: 'Microplastics Tracking',
    description: 'Monitor microplastic contamination sources and affected areas throughout the region.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Explore the Map',
    description: 'Start by exploring the interactive map to understand water infrastructure and quality across the region.',
  },
  {
    step: '02',
    title: 'Dive into Data',
    description: 'Click on cities, facilities, or monitoring points to access detailed information and metrics.',
  },
  {
    step: '03',
    title: 'Ask Questions',
    description: 'Use the research chatbot to get answers backed by scientific literature and citations.',
  },
  {
    step: '04',
    title: 'Run Simulations',
    description: 'Explore the Biochemistry Lab to understand water treatment processes through interactive models.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
              Water Quality Analysis Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              A regional environmental intelligence platform for water infrastructure, quality, 
              contamination, and research-backed exploration in the Baja California and 
              Southern California border region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/app">
                  Open App
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/methods">
                  Explore Methods
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-chart-2/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for exploring water quality data, research, and environmental analysis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why This Matters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-1/20 flex items-center justify-center mx-auto mb-4">
                  <Waves className="h-8 w-8 text-chart-1" />
                </div>
                <h3 className="font-semibold mb-2">Cross-Border Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Water quality issues in the border region affect millions of residents in both countries.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-chart-2" />
                </div>
                <h3 className="font-semibold mb-2">Data Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Centralized access to water quality data promotes accountability and informed decision-making.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-chart-3" />
                </div>
                <h3 className="font-semibold mb-2">Research-Based</h3>
                <p className="text-sm text-muted-foreground">
                  All information is grounded in scientific research with transparent citations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Get started exploring water quality data in four simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Transparency */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Data Transparency</h2>
            <p className="text-muted-foreground mb-8">
              We believe in open access to environmental data. All information on this platform 
              comes from publicly available sources, scientific research, and government reports. 
              Our chatbot provides citations for all research-based answers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-primary">8+</div>
                <div className="text-sm text-muted-foreground">Cities Monitored</div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Water Facilities</div>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Research Papers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-base">Important Disclaimer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This platform is designed for <strong>educational and research purposes only</strong>. 
                  It is not an official government source and should not be used for regulatory compliance 
                  or official decision-making. Data presented here may not reflect real-time conditions. 
                  For official water quality information, please consult local government agencies such as 
                  CONAGUA (Mexico) or the EPA and California Water Boards (USA).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Start exploring water quality data, run simulations, and learn about environmental 
            challenges in the border region.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/app">
              Launch Platform
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
