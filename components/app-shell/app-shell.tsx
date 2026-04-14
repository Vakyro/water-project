"use client"

import { useState } from 'react'
import { SidebarNav } from './sidebar-nav'
import { TopBar } from './top-bar'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav 
        collapsed={sidebarCollapsed} 
        onCollapsedChange={setSidebarCollapsed} 
      />
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "md:pl-16" : "md:pl-64"
      )}>
        <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
