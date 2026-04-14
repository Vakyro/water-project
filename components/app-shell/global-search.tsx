"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Search, MapPin, Building2, Droplets, CircleDot, FlaskConical } from 'lucide-react'
import { cities } from '@/src/data/cities'
import { facilities } from '@/src/data/facilities'
import { microplasticsEntries } from '@/src/data/microplastics'
import { waterQualityPoints } from '@/src/data/water-quality'
import { BIOCHEM_MODULES } from '@/src/core/constants'

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const searchResults = useMemo(() => ({
    cities: cities.map(c => ({
      id: c.id,
      title: c.name,
      description: `${c.state}, ${c.country === 'mexico' ? 'Mexico' : 'USA'}`,
      route: `/app/contamination/${c.slug}`,
      icon: MapPin,
    })),
    facilities: facilities.map(f => ({
      id: f.id,
      title: f.name,
      description: f.type.replace(/-/g, ' '),
      route: `/app/facility/${f.id}`,
      icon: Building2,
    })),
    waterQuality: waterQualityPoints.map(wq => ({
      id: wq.id,
      title: wq.name,
      description: `Rating: ${wq.rating}`,
      route: `/app/water-quality/${wq.id}`,
      icon: Droplets,
    })),
    microplastics: microplasticsEntries.map(mp => ({
      id: mp.id,
      title: mp.affectedArea,
      description: mp.source,
      route: `/app/microplastics/${mp.id}`,
      icon: CircleDot,
    })),
    biochem: BIOCHEM_MODULES.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      route: m.route,
      icon: FlaskConical,
    })),
  }), [])

  const handleSelect = (route: string) => {
    setOpen(false)
    router.push(route)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search cities, facilities, water quality..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Cities">
            {searchResults.cities.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Facilities">
            {searchResults.facilities.slice(0, 5).map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground capitalize">{item.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Water Quality">
            {searchResults.waterQuality.slice(0, 5).map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground capitalize">{item.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Biochemistry Lab">
            {searchResults.biochem.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
