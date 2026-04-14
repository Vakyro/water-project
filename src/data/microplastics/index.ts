import type { MicroplasticsEntry } from '@/src/core/types'

export const microplasticsEntries: MicroplasticsEntry[] = [
  {
    id: 'mp-tj-1',
    source: 'Urban stormwater runoff',
    affectedArea: 'Tijuana River Estuary',
    severity: 'high',
    coordinates: [-117.1234, 32.5567],
    cityId: 'tijuana',
    metrics: {
      concentration: '5.8 particles/L',
      particleTypes: ['Polyethylene', 'Polypropylene', 'Polystyrene'],
      sampleDepth: '0-2m',
      sampleCount: 24,
    },
    description: 'High concentration of microplastics detected in the Tijuana River Estuary, primarily from urban runoff and wastewater discharge.',
    detectedDate: '2024-01-15',
  },
  {
    id: 'mp-tj-2',
    source: 'Industrial discharge',
    affectedArea: 'Playas de Tijuana',
    severity: 'medium',
    coordinates: [-117.1567, 32.5234],
    cityId: 'tijuana',
    metrics: {
      concentration: '3.2 particles/L',
      particleTypes: ['Polyethylene', 'PET', 'Nylon'],
      sampleDepth: '0-1m',
      sampleCount: 18,
    },
    description: 'Moderate microplastic levels in beach sediments from industrial activities and ocean currents.',
    detectedDate: '2024-02-10',
  },
  {
    id: 'mp-tj-3',
    source: 'Wastewater outfall',
    affectedArea: 'San Antonio de los Buenos',
    severity: 'medium',
    coordinates: [-117.1089, 32.4678],
    cityId: 'tijuana',
    metrics: {
      concentration: '4.1 particles/L',
      particleTypes: ['Polyester fibers', 'Polyethylene', 'Acrylic'],
      sampleDepth: '0-3m',
      sampleCount: 15,
    },
    description: 'Microplastic contamination near the wastewater treatment plant outfall.',
    detectedDate: '2024-01-28',
  },
  {
    id: 'mp-sd-1',
    source: 'Cross-border flows',
    affectedArea: 'Imperial Beach coastline',
    severity: 'high',
    coordinates: [-117.1234, 32.5789],
    cityId: 'imperial-beach',
    metrics: {
      concentration: '5.5 particles/L',
      particleTypes: ['Polyethylene', 'Polypropylene', 'PVC'],
      sampleDepth: '0-2m',
      sampleCount: 30,
    },
    description: 'Elevated microplastic levels attributed to cross-border flows from the Tijuana River.',
    detectedDate: '2024-02-05',
  },
  {
    id: 'mp-sd-2',
    source: 'Urban runoff',
    affectedArea: 'San Diego Bay',
    severity: 'low',
    coordinates: [-117.1789, 32.6934],
    cityId: 'san-diego',
    metrics: {
      concentration: '2.1 particles/L',
      particleTypes: ['Polyethylene', 'Polystyrene'],
      sampleDepth: '0-1m',
      sampleCount: 22,
    },
    description: 'Lower microplastic levels in San Diego Bay due to improved stormwater management.',
    detectedDate: '2024-01-20',
  },
  {
    id: 'mp-sd-3',
    source: 'Marina activities',
    affectedArea: 'Mission Bay',
    severity: 'medium',
    coordinates: [-117.2345, 32.7678],
    cityId: 'san-diego',
    metrics: {
      concentration: '3.4 particles/L',
      particleTypes: ['Fiberglass', 'Polyethylene', 'Antifouling paint particles'],
      sampleDepth: '0-2m',
      sampleCount: 16,
    },
    description: 'Moderate microplastic presence associated with recreational boating activities.',
    detectedDate: '2024-02-18',
  },
  {
    id: 'mp-en-1',
    source: 'Fishing industry',
    affectedArea: 'Ensenada Harbor',
    severity: 'medium',
    coordinates: [-116.6234, 31.8567],
    cityId: 'ensenada',
    metrics: {
      concentration: '3.8 particles/L',
      particleTypes: ['Nylon', 'Polyethylene', 'Polypropylene'],
      sampleDepth: '0-2m',
      sampleCount: 20,
    },
    description: 'Fishing gear degradation contributes to microplastic presence in harbor waters.',
    detectedDate: '2024-01-25',
  },
  {
    id: 'mp-en-2',
    source: 'Port activities',
    affectedArea: 'Bahía de Todos Santos',
    severity: 'low',
    coordinates: [-116.5678, 31.8234],
    cityId: 'ensenada',
    metrics: {
      concentration: '2.5 particles/L',
      particleTypes: ['Polyethylene', 'PET'],
      sampleDepth: '0-3m',
      sampleCount: 14,
    },
    description: 'Commercial port activities contribute to background microplastic levels.',
    detectedDate: '2024-02-12',
  },
  {
    id: 'mp-mx-1',
    source: 'Agricultural plastic',
    affectedArea: 'Mexicali Valley irrigation',
    severity: 'high',
    coordinates: [-115.4567, 32.5934],
    cityId: 'mexicali',
    metrics: {
      concentration: '6.2 particles/L',
      particleTypes: ['LDPE mulch film', 'Drip irrigation tubing', 'Polyethylene'],
      sampleDepth: '0-1m',
      sampleCount: 25,
    },
    description: 'Agricultural plastic mulch degradation leads to high microplastic concentrations in irrigation canals.',
    detectedDate: '2024-01-18',
  },
  {
    id: 'mp-mx-2',
    source: 'Urban drainage',
    affectedArea: 'New River',
    severity: 'critical',
    coordinates: [-115.5234, 32.6456],
    cityId: 'mexicali',
    metrics: {
      concentration: '8.5 particles/L',
      particleTypes: ['Mixed municipal waste plastics', 'Polyethylene', 'PVC'],
      sampleDepth: '0-0.5m',
      sampleCount: 28,
    },
    description: 'Critical microplastic levels in the New River due to inadequate waste management.',
    detectedDate: '2024-02-22',
  },
  {
    id: 'mp-cb-1',
    source: 'Beach tourism',
    affectedArea: 'Carlsbad State Beach',
    severity: 'low',
    coordinates: [-117.3456, 33.1234],
    cityId: 'carlsbad',
    metrics: {
      concentration: '2.0 particles/L',
      particleTypes: ['Polystyrene', 'Polyethylene'],
      sampleDepth: '0-1m',
      sampleCount: 12,
    },
    description: 'Beach cleanup programs help maintain low microplastic levels.',
    detectedDate: '2024-01-30',
  },
  {
    id: 'mp-rs-1',
    source: 'Tourism activities',
    affectedArea: 'Rosarito Beach',
    severity: 'medium',
    coordinates: [-117.0456, 32.3567],
    cityId: 'rosarito',
    metrics: {
      concentration: '3.9 particles/L',
      particleTypes: ['Polystyrene', 'Polyethylene', 'PET'],
      sampleDepth: '0-1m',
      sampleCount: 16,
    },
    description: 'Seasonal tourism increases microplastic deposition on beaches.',
    detectedDate: '2024-02-08',
  },
  {
    id: 'mp-ib-1',
    source: 'Tijuana River outflow',
    affectedArea: 'Tijuana Slough NWR',
    severity: 'high',
    coordinates: [-117.1189, 32.5534],
    cityId: 'imperial-beach',
    metrics: {
      concentration: '6.1 particles/L',
      particleTypes: ['Mixed plastics', 'Polyethylene', 'Polypropylene'],
      sampleDepth: '0-2m',
      sampleCount: 32,
    },
    description: 'Wetland area receives high microplastic loads from Tijuana River.',
    detectedDate: '2024-01-22',
  },
]

export function getMicroplasticsById(id: string): MicroplasticsEntry | undefined {
  return microplasticsEntries.find(m => m.id === id)
}

export function getMicroplasticsByCity(cityId: string): MicroplasticsEntry[] {
  return microplasticsEntries.filter(m => m.cityId === cityId)
}

export function getAllMicroplastics(): MicroplasticsEntry[] {
  return microplasticsEntries
}

// Extended study data for detail pages
export interface MicroplasticStudy {
  id: string
  title: string
  location: string
  year: number
  authors: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  sampleType: string
  concentration: number
  polymerTypes: string[]
  sizeRange: { min: number; max: number }
  sampleSites: number
  abstract: string
  methodology: {
    collection: string
    analysis: string
    qc: string
  }
}

export const mockMicroplasticStudies: MicroplasticStudy[] = microplasticsEntries.map((entry, index) => ({
  id: entry.id,
  title: `Microplastic Assessment: ${entry.affectedArea}`,
  location: entry.affectedArea,
  year: 2024,
  authors: ['Garcia, M.', 'Thompson, R.', 'Chen, L.'][index % 3] ? [['Garcia, M.', 'Thompson, R.'][index % 2], 'Chen, L.'] : ['Garcia, M.'],
  severity: entry.severity,
  sampleType: index % 4 === 0 ? 'water' : index % 4 === 1 ? 'sediment' : index % 4 === 2 ? 'biota' : 'effluent',
  concentration: parseFloat(entry.metrics.concentration.split(' ')[0]) * 1000,
  polymerTypes: entry.metrics.particleTypes.map(t => 
    t.includes('Polyethylene') ? 'PE' : 
    t.includes('Polypropylene') ? 'PP' : 
    t.includes('Polystyrene') ? 'PS' : 
    t.includes('PET') ? 'PET' : 
    t.includes('PVC') ? 'PVC' : 
    t.includes('Nylon') ? 'PA' : 'Other'
  ),
  sizeRange: { min: 20, max: 5000 },
  sampleSites: entry.metrics.sampleCount,
  abstract: entry.description,
  methodology: {
    collection: 'Water samples collected using Manta net (333μm mesh) at multiple depths. Sediment cores extracted using Van Veen grab sampler.',
    analysis: 'Visual identification under stereomicroscope followed by μFTIR spectroscopy for polymer identification. Size measured using ImageJ software.',
    qc: 'Procedural blanks processed with each batch. Recovery rates determined using spiked samples. All samples processed in laminar flow hood.'
  }
}))

export const microplasticSizeDistribution = [
  { range: '<20μm', count: 450 },
  { range: '20-50μm', count: 820 },
  { range: '50-100μm', count: 1100 },
  { range: '100-200μm', count: 780 },
  { range: '200-500μm', count: 420 },
  { range: '500-1000μm', count: 180 },
  { range: '>1000μm', count: 90 },
]

export const microplasticPolymerData = [
  { name: 'PE', value: 35 },
  { name: 'PP', value: 25 },
  { name: 'PS', value: 18 },
  { name: 'PET', value: 12 },
  { name: 'PVC', value: 6 },
  { name: 'Other', value: 4 },
]
