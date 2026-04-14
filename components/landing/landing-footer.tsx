import Link from 'next/link'
import { Droplets } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
              <Droplets className="h-6 w-6 text-chart-2" />
              <span>Water Quality Platform</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              A regional environmental intelligence platform for water infrastructure, 
              quality, and research in the Baja California and Southern California border region.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/app" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/app/map" className="hover:text-foreground transition-colors">
                  Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/app/biochem" className="hover:text-foreground transition-colors">
                  Biochemistry Lab
                </Link>
              </li>
              <li>
                <Link href="/app/verification" className="hover:text-foreground transition-colors">
                  Verification Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/methods" className="hover:text-foreground transition-colors">
                  Methods
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/app/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Water Quality Analysis Platform. For educational purposes only.
          </p>
          <p className="text-sm text-muted-foreground">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </footer>
  )
}
