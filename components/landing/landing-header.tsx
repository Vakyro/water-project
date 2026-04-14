import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Droplets } from 'lucide-react'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Droplets className="h-6 w-6 text-chart-2" />
          <span className="hidden sm:inline">Water Quality Platform</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/methods" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Methods
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        <Button asChild size="sm">
          <Link href="/app">Open App</Link>
        </Button>
      </div>
    </header>
  )
}
