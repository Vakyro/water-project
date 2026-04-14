"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  Map,
  Droplets,
  AlertTriangle,
  CircleDot,
  Building2,
  FlaskConical,
  ShieldCheck,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/app/map', icon: Map, label: 'Map' },
  { href: '/app/water-analysis', icon: Droplets, label: 'Water Analysis' },
  { href: '/app/contamination', icon: AlertTriangle, label: 'Contamination' },
  { href: '/app/microplastics', icon: CircleDot, label: 'Microplastics' },
  { href: '/app/facilities', icon: Building2, label: 'Facilities' },
  { href: '/app/biochem', icon: FlaskConical, label: 'Biochemistry Lab' },
  { href: '/app/verification', icon: ShieldCheck, label: 'Verification Center' },
  { href: '/app/about', icon: Info, label: 'About / Methods' },
]

interface SidebarNavProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function SidebarNav({ collapsed, onCollapsedChange }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
        "hidden md:block",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <Link href="/app" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
              <Droplets className="h-6 w-6 text-chart-2" />
              <span className="truncate">WQAP</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/app" className="mx-auto">
              <Droplets className="h-6 w-6 text-chart-2" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 text-sidebar-foreground", collapsed && "mx-auto")}
            onClick={() => onCollapsedChange(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="p-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/app' && pathname.startsWith(item.href))
                
                const linkContent = (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                        : "text-sidebar-foreground",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )

                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      linkContent
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  )
}
