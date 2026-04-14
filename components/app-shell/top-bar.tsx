"use client"

import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from './global-search'
import { Menu } from 'lucide-react'

const routeTitles: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/map': 'Interactive Map',
  '/app/water-analysis': 'Water Analysis',
  '/app/contamination': 'Contamination',
  '/app/microplastics': 'Microplastics',
  '/app/facilities': 'Facilities',
  '/app/biochem': 'Biochemistry Lab',
  '/app/biochem/activated-sludge': 'Activated Sludge Simulator',
  '/app/biochem/disinfection': 'Disinfection Chemistry Lab',
  '/app/biochem/qmra': 'QMRA Risk Explorer',
  '/app/verification': 'Verification Center',
  '/app/about': 'About / Methods',
}

interface TopBarProps {
  onToggleSidebar: () => void
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const pathname = usePathname()
  
  const getTitle = () => {
    if (routeTitles[pathname]) return routeTitles[pathname]
    
    // Handle dynamic routes
    if (pathname.startsWith('/app/contamination/')) return 'City Contamination'
    if (pathname.startsWith('/app/microplastics/')) return 'Microplastics Detail'
    if (pathname.startsWith('/app/facility/')) return 'Facility Detail'
    if (pathname.startsWith('/app/water-quality/')) return 'Water Quality Detail'
    
    return 'Water Quality Platform'
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <h1 className="text-lg font-semibold truncate">{getTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <GlobalSearch />
        </div>
      </div>
    </header>
  )
}
