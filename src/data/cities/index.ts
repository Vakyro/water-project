import type { City, CityProfile } from '@/src/core/types'

export const cities: City[] = [
  {
    id: 'tijuana',
    name: 'Tijuana',
    slug: 'tijuana',
    country: 'mexico',
    state: 'Baja California',
    coordinates: [-117.0382, 32.5149],
    population: 1922523,
    description: 'Tijuana is the largest city in Baja California and a major industrial center on the US-Mexico border.',
  },
  {
    id: 'rosarito',
    name: 'Rosarito',
    slug: 'rosarito',
    country: 'mexico',
    state: 'Baja California',
    coordinates: [-117.0331, 32.3661],
    population: 120000,
    description: 'Playas de Rosarito is a coastal city known for tourism and growing industrial development.',
  },
  {
    id: 'ensenada',
    name: 'Ensenada',
    slug: 'ensenada',
    country: 'mexico',
    state: 'Baja California',
    coordinates: [-116.5963, 31.8667],
    population: 519813,
    description: 'Ensenada is a major port city and the third largest in Baja California.',
  },
  {
    id: 'mexicali',
    name: 'Mexicali',
    slug: 'mexicali',
    country: 'mexico',
    state: 'Baja California',
    coordinates: [-115.4683, 32.6245],
    population: 1049792,
    description: 'Mexicali is the capital of Baja California, located on the US-Mexico border.',
  },
  {
    id: 'tecate',
    name: 'Tecate',
    slug: 'tecate',
    country: 'mexico',
    state: 'Baja California',
    coordinates: [-116.6264, 32.5722],
    population: 114000,
    description: 'Tecate is a small border city known for its brewery and mild climate.',
  },
  {
    id: 'san-diego',
    name: 'San Diego',
    slug: 'san-diego',
    country: 'usa',
    state: 'California',
    coordinates: [-117.1611, 32.7157],
    population: 1386932,
    description: 'San Diego is the second largest city in California and a major naval and research hub.',
  },
  {
    id: 'carlsbad',
    name: 'Carlsbad',
    slug: 'carlsbad',
    country: 'usa',
    state: 'California',
    coordinates: [-117.3506, 33.1581],
    population: 114746,
    description: 'Carlsbad is a coastal city in San Diego County known for its beaches and the Carlsbad Desalination Plant.',
  },
  {
    id: 'imperial-beach',
    name: 'Imperial Beach',
    slug: 'imperial-beach',
    country: 'usa',
    state: 'California',
    coordinates: [-117.1131, 32.5839],
    population: 28317,
    description: 'Imperial Beach is the southernmost city on the California coast, directly north of the Tijuana River.',
  },
]

export const cityProfiles: Record<string, CityProfile> = {
  tijuana: {
    city: cities.find(c => c.id === 'tijuana')!,
    waterFacilities: [
      { id: 'tj-wwtp-1', name: 'PTAR San Antonio de los Buenos', type: 'wastewater-treatment', status: 'Operational' },
      { id: 'tj-wwtp-2', name: 'PTAR La Morita', type: 'wastewater-treatment', status: 'Operational' },
      { id: 'tj-ps-1', name: 'Estación de Bombeo Central', type: 'pumping-station', status: 'Operational' },
    ],
    microplastics: {
      overview: 'Tijuana coastal waters show moderate microplastic contamination, primarily from urban runoff and industrial discharge.',
      avgConcentration: '4.2 particles/L',
      hotspots: 3,
      trend: 'stable',
    },
    waterContamination: {
      overview: 'Cross-border contamination from the Tijuana River affects water quality in both Mexico and the US.',
      mainPollutants: ['Sewage', 'Heavy metals', 'Pesticides', 'Industrial chemicals'],
      riskLevel: 'high',
      affectedAreas: 5,
    },
    waterQuality: {
      overview: 'Water quality varies significantly across the city, with coastal areas showing higher contamination levels.',
      avgPh: 7.4,
      avgSalinity: 35.2,
      overallRating: 'fair',
      monitoringStations: 8,
    },
  },
  'san-diego': {
    city: cities.find(c => c.id === 'san-diego')!,
    waterFacilities: [
      { id: 'sd-wwtp-1', name: 'Point Loma Wastewater Treatment Plant', type: 'wastewater-treatment', status: 'Operational' },
      { id: 'sd-wwtp-2', name: 'South Bay Water Reclamation Plant', type: 'wastewater-treatment', status: 'Operational' },
      { id: 'sd-wtp-1', name: 'Otay Water Treatment Plant', type: 'water-treatment', status: 'Operational' },
    ],
    microplastics: {
      overview: 'San Diego Bay and coastal waters show lower microplastic levels compared to regional averages.',
      avgConcentration: '2.8 particles/L',
      hotspots: 2,
      trend: 'decreasing',
    },
    waterContamination: {
      overview: 'Primary contamination concerns relate to cross-border flows from the Tijuana River.',
      mainPollutants: ['Sewage overflow', 'Bacteria', 'Sediment'],
      riskLevel: 'medium',
      affectedAreas: 3,
    },
    waterQuality: {
      overview: 'Generally good water quality with regular monitoring and treatment infrastructure.',
      avgPh: 7.6,
      avgSalinity: 34.8,
      overallRating: 'good',
      monitoringStations: 12,
    },
  },
  ensenada: {
    city: cities.find(c => c.id === 'ensenada')!,
    waterFacilities: [
      { id: 'en-wwtp-1', name: 'PTAR El Naranjo', type: 'wastewater-treatment', status: 'Operational' },
      { id: 'en-desal-1', name: 'Desaladora de Ensenada', type: 'desalination', status: 'Operational' },
    ],
    microplastics: {
      overview: 'Port activities contribute to microplastic presence in harbor waters.',
      avgConcentration: '3.5 particles/L',
      hotspots: 2,
      trend: 'stable',
    },
    waterContamination: {
      overview: 'Port and fishing activities are the main sources of water contamination.',
      mainPollutants: ['Oil', 'Heavy metals', 'Organic waste'],
      riskLevel: 'medium',
      affectedAreas: 2,
    },
    waterQuality: {
      overview: 'Water quality is generally acceptable with some concerns in the port area.',
      avgPh: 7.8,
      avgSalinity: 35.5,
      overallRating: 'good',
      monitoringStations: 6,
    },
  },
  mexicali: {
    city: cities.find(c => c.id === 'mexicali')!,
    waterFacilities: [
      { id: 'mx-wwtp-1', name: 'PTAR Zaragoza', type: 'wastewater-treatment', status: 'Operational' },
      { id: 'mx-res-1', name: 'Presa Morelos', type: 'reservoir', status: 'Operational' },
    ],
    microplastics: {
      overview: 'Agricultural irrigation channels show elevated microplastic levels from plastic mulch degradation.',
      avgConcentration: '5.1 particles/L',
      hotspots: 4,
      trend: 'increasing',
    },
    waterContamination: {
      overview: 'Agricultural runoff and industrial activities contribute to water contamination.',
      mainPollutants: ['Pesticides', 'Fertilizers', 'Industrial waste'],
      riskLevel: 'high',
      affectedAreas: 4,
    },
    waterQuality: {
      overview: 'Water quality challenges due to agricultural activities and extreme climate.',
      avgPh: 7.2,
      avgSalinity: 1.2,
      overallRating: 'fair',
      monitoringStations: 5,
    },
  },
  carlsbad: {
    city: cities.find(c => c.id === 'carlsbad')!,
    waterFacilities: [
      { id: 'cb-desal-1', name: 'Carlsbad Desalination Plant', type: 'desalination', status: 'Operational' },
      { id: 'cb-wwtp-1', name: 'Encina Water Pollution Control Facility', type: 'wastewater-treatment', status: 'Operational' },
    ],
    microplastics: {
      overview: 'Coastal waters show typical microplastic levels for Southern California.',
      avgConcentration: '2.5 particles/L',
      hotspots: 1,
      trend: 'stable',
    },
    waterContamination: {
      overview: 'Minimal contamination concerns with modern treatment infrastructure.',
      mainPollutants: ['Urban runoff', 'Sediment'],
      riskLevel: 'low',
      affectedAreas: 1,
    },
    waterQuality: {
      overview: 'Excellent water quality maintained through advanced treatment systems.',
      avgPh: 7.5,
      avgSalinity: 35.0,
      overallRating: 'excellent',
      monitoringStations: 4,
    },
  },
  rosarito: {
    city: cities.find(c => c.id === 'rosarito')!,
    waterFacilities: [
      { id: 'rs-wwtp-1', name: 'PTAR Rosarito', type: 'wastewater-treatment', status: 'Operational' },
    ],
    microplastics: {
      overview: 'Tourism activities contribute to beach microplastic accumulation.',
      avgConcentration: '3.8 particles/L',
      hotspots: 2,
      trend: 'increasing',
    },
    waterContamination: {
      overview: 'Seasonal tourism and rapid development strain water infrastructure.',
      mainPollutants: ['Sewage', 'Beach waste', 'Urban runoff'],
      riskLevel: 'medium',
      affectedAreas: 2,
    },
    waterQuality: {
      overview: 'Variable water quality depending on season and tourist activity.',
      avgPh: 7.5,
      avgSalinity: 35.1,
      overallRating: 'fair',
      monitoringStations: 3,
    },
  },
  tecate: {
    city: cities.find(c => c.id === 'tecate')!,
    waterFacilities: [
      { id: 'tc-wwtp-1', name: 'PTAR Tecate', type: 'wastewater-treatment', status: 'Operational' },
    ],
    microplastics: {
      overview: 'Lower microplastic levels due to limited industrial activity.',
      avgConcentration: '1.8 particles/L',
      hotspots: 1,
      trend: 'stable',
    },
    waterContamination: {
      overview: 'Moderate contamination from brewery and manufacturing activities.',
      mainPollutants: ['Organic waste', 'Industrial discharge'],
      riskLevel: 'low',
      affectedAreas: 1,
    },
    waterQuality: {
      overview: 'Generally good water quality with limited monitoring infrastructure.',
      avgPh: 7.3,
      avgSalinity: 0.8,
      overallRating: 'good',
      monitoringStations: 2,
    },
  },
  'imperial-beach': {
    city: cities.find(c => c.id === 'imperial-beach')!,
    waterFacilities: [
      { id: 'ib-ps-1', name: 'International Boundary Water Commission Pump Station', type: 'pumping-station', status: 'Operational' },
    ],
    microplastics: {
      overview: 'Elevated microplastic levels due to proximity to Tijuana River outflow.',
      avgConcentration: '5.5 particles/L',
      hotspots: 3,
      trend: 'stable',
    },
    waterContamination: {
      overview: 'Significant cross-border contamination from Tijuana River flows.',
      mainPollutants: ['Sewage', 'Bacteria', 'Trash', 'Chemical pollutants'],
      riskLevel: 'critical',
      affectedAreas: 4,
    },
    waterQuality: {
      overview: 'Highly variable water quality, often requiring beach closures.',
      avgPh: 7.4,
      avgSalinity: 34.5,
      overallRating: 'poor',
      monitoringStations: 6,
    },
  },
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug)
}

export function getCityProfile(slug: string): CityProfile | undefined {
  return cityProfiles[slug]
}

export function getAllCities(): City[] {
  return cities
}

export function getCityById(id: string): City | undefined {
  return cities.find(c => c.id === id)
}
