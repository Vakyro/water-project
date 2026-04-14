import { LandingHeader } from '@/components/landing/landing-header'
import { LandingFooter } from '@/components/landing/landing-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  FlaskConical,
  MapPin,
  MessageSquare,
  BookOpen,
  ShieldCheck,
  Microscope,
  Activity
} from 'lucide-react'

const dataSources = [
  {
    name: 'U.S. EPA Water Quality Portal',
    description: 'Federal water quality monitoring data for US sampling stations, including beach water quality, NPDES discharge monitoring, and ambient monitoring.',
    type: 'Government',
    coverage: 'USA (San Diego, Imperial Beach, Carlsbad)',
    url: 'https://waterqualitydata.us',
  },
  {
    name: 'CONAGUA — Comisión Nacional del Agua',
    description: 'Mexico\'s national water commission provides hydrological monitoring data, treatment plant capacity, and water quality assessments across Baja California.',
    type: 'Government',
    coverage: 'Mexico (Tijuana, Rosarito, Ensenada, Mexicali, Tecate)',
  },
  {
    name: 'IBWC / CILA — International Boundary and Water Commission',
    description: 'Binational agency managing shared water resources. Key source for cross-border flow measurements, international segment water quality, and treaty compliance data.',
    type: 'Binational',
    coverage: 'Tijuana River, Colorado River, border crossings',
  },
  {
    name: 'Peer-Reviewed Academic Literature',
    description: 'Scientific papers from journals including Environmental Science & Technology, Water Research, Marine Pollution Bulletin, and similar. Used for microplastics data and contamination assessments.',
    type: 'Academic',
    coverage: 'Regional',
  },
  {
    name: 'Municipal Utility Reports',
    description: 'Annual Consumer Confidence Reports (CCRs) and infrastructure reports from municipal water utilities. Provides treatment capacity, population served, and compliance data.',
    type: 'Municipal',
    coverage: 'All monitored cities',
  },
  {
    name: 'Remote Sensing & Satellite Imagery',
    description: 'Landsat and Sentinel-2 data used to assess coastal turbidity, algal bloom dynamics, and large-scale contamination event tracking.',
    type: 'Remote Sensing',
    coverage: 'Coastal zone, river corridors',
  },
]

const methodologies = [
  {
    icon: Activity,
    title: 'Water Quality Index (WQI)',
    description: 'A composite scoring system derived from multiple parameters including pH, dissolved oxygen, turbidity, conductivity, temperature, and biological oxygen demand. Stations are classified as Excellent, Good, Fair, or Poor based on weighted parameter scores using the NSF-WQI methodology.',
    parameters: ['pH (7.0–7.5 optimal)', 'Dissolved oxygen (>7 mg/L ideal)', 'Turbidity (<5 NTU coastal)', 'Conductivity', 'Temperature', 'BOD (<3 mg/L)'],
  },
  {
    icon: Microscope,
    title: 'Microplastics Assessment',
    description: 'Microplastic concentrations are reported in particles per liter (p/L) from surface water trawl sampling using standard manta nets (333μm mesh). Particle identification uses Fourier-transform infrared (FTIR) spectroscopy and Raman microscopy for polymer-type characterization.',
    parameters: ['Concentration (p/L)', 'Size distribution (μm)', 'Polymer type (FTIR/Raman)', 'Morphology classification', 'Sample depth (surface trawl)'],
  },
  {
    icon: ShieldCheck,
    title: 'QMRA — Quantitative Microbial Risk Assessment',
    description: 'The QMRA simulator uses validated dose-response models from the literature: exponential model for Cryptosporidium and Giardia, beta-Poisson model for Rotavirus and Campylobacter. Annual infection risk is calculated per 100,000 exposed individuals under specified scenarios.',
    parameters: ['Exponential model (Cryptosporidium, k=0.0573)', 'Beta-Poisson (Rotavirus, α=0.253, β=0.422)', 'WHO/EPA benchmark: 10⁻⁴ annual risk', 'DALY calculation (0.001 DALY/case)'],
  },
  {
    icon: FlaskConical,
    title: 'Activated Sludge Modeling',
    description: 'The biological treatment simulator uses simplified Monod-kinetics with temperature correction (Arrhenius θ-factor) and dissolved oxygen limitation (half-saturation Ks=60 mg/L). The model estimates effluent BOD, sludge production, F/M ratio, and oxygen requirement under user-defined operating conditions.',
    parameters: ['Monod kinetics (μmax, Ks)', 'Temperature coefficient θ=1.07', 'Yield Y=0.6, kd=0.06/day', 'DO limitation factor', 'SVI (Sludge Volume Index)'],
  },
]

export default function MethodsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-4 border-b border-border bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Methodology & Data</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              How This Platform Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Transparency in data sources, analytical methods, and the limitations of this educational platform.
              All data is provided for research and educational purposes only — not for regulatory or public health decisions.
            </p>
          </div>
        </section>

        {/* Data Sources */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Data Sources</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Water quality and infrastructure data is aggregated from the following authoritative sources.
              All data is subject to the limitations and update frequencies of each source.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {dataSources.map((source) => (
                <Card key={source.name} className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{source.name}</CardTitle>
                      <Badge variant="outline" className="text-xs shrink-0">{source.type}</Badge>
                    </div>
                    <CardDescription className="text-xs">{source.coverage}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Analytical Methods */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <FlaskConical className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Analytical Methods</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Each module in the platform uses established scientific methods.
              Simulation results are illustrative and educational — they simplify real-world complexity.
            </p>
            <div className="space-y-6">
              {methodologies.map((method) => (
                <Card key={method.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                        <method.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {method.parameters.map((param) => (
                        <Badge key={param} variant="secondary" className="text-xs font-normal">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* RAG Chatbot */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Research Chatbot (RAG)</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The research assistant uses a Retrieval-Augmented Generation (RAG) pipeline.
                  User questions are first converted to vector embeddings, then matched against
                  a database of indexed scientific paper chunks stored in Supabase with pgvector.
                </p>
                <p className="text-muted-foreground">
                  Only the top-matched research chunks are passed to the language model as context.
                  The model is instructed to answer only from retrieved evidence and
                  explicitly indicate when information is insufficient.
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pipeline Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2"><span className="font-mono text-primary">1.</span> User question → embedding (384-dim)</li>
                    <li className="flex gap-2"><span className="font-mono text-primary">2.</span> Cosine similarity search (pgvector HNSW)</li>
                    <li className="flex gap-2"><span className="font-mono text-primary">3.</span> Top-k paper chunks retrieved</li>
                    <li className="flex gap-2"><span className="font-mono text-primary">4.</span> Chunks + metadata → LLM context</li>
                    <li className="flex gap-2"><span className="font-mono text-primary">5.</span> Answer with citations + confidence score</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Limitations & Caveats</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: 'Not Real-Time', body: 'Most data is not updated in real time. Water quality measurements reflect the most recent available data from each source, which may lag by days to months.' },
                { title: 'Educational Only', body: 'This platform is designed for education and research exploration. Do not use it for regulatory compliance, public health advisories, or water safety decisions.' },
                { title: 'Simplified Models', body: 'Biochemistry simulators use simplified kinetic models. Real treatment systems are far more complex. Results are illustrative, not engineering calculations.' },
                { title: 'Geographic Accuracy', body: 'Map data uses real geographic coordinates where available. Some facility positions are approximate. City polygons are simplified representations.' },
                { title: 'Incomplete Coverage', body: 'Not all facilities, water quality stations, or contamination sites in the region are represented. Data gaps exist, especially for smaller municipalities.' },
                { title: 'No Official Affiliation', body: 'This platform is not affiliated with EPA, CONAGUA, IBWC, or any government agency. It is an independent educational resource.' },
              ].map((item) => (
                <Card key={item.title} className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
