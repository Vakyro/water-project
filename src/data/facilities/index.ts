import type { Facility } from '@/src/core/types'

export const facilities: Facility[] = [
  {
    id: 'tj-wwtp-1',
    name: 'PTAR San Antonio de los Buenos',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-117.1234, 32.4521],
    cityId: 'tijuana',
    capacity: '75 MGD',
    description: 'Major wastewater treatment plant serving southern Tijuana. Treats domestic and industrial wastewater before ocean discharge.',
    metrics: {
      dailyFlow: '65 MGD',
      treatmentLevel: 'Secondary',
      energyConsumption: '12,500 kWh/day',
      lastInspection: '2024-01-15',
    },
  },
  {
    id: 'tj-wwtp-2',
    name: 'PTAR La Morita',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-116.9456, 32.5234],
    cityId: 'tijuana',
    capacity: '25 MGD',
    description: 'Wastewater treatment facility serving eastern Tijuana neighborhoods.',
    metrics: {
      dailyFlow: '18 MGD',
      treatmentLevel: 'Secondary',
      energyConsumption: '4,200 kWh/day',
      lastInspection: '2024-02-20',
    },
  },
  {
    id: 'tj-ps-1',
    name: 'Estación de Bombeo Central',
    type: 'pumping-station',
    status: 'operational',
    coordinates: [-117.0234, 32.5012],
    cityId: 'tijuana',
    capacity: '50 MGD',
    description: 'Central pumping station for wastewater collection and transfer.',
    metrics: {
      dailyFlow: '42 MGD',
      energyConsumption: '8,500 kWh/day',
      lastInspection: '2024-03-01',
    },
  },
  {
    id: 'sd-wwtp-1',
    name: 'Point Loma Wastewater Treatment Plant',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-117.2534, 32.6878],
    cityId: 'san-diego',
    capacity: '240 MGD',
    description: 'The largest wastewater treatment facility in San Diego, serving over 2.2 million residents.',
    metrics: {
      dailyFlow: '175 MGD',
      treatmentLevel: 'Advanced Primary',
      energyConsumption: '45,000 kWh/day',
      lastInspection: '2024-01-30',
    },
  },
  {
    id: 'sd-wwtp-2',
    name: 'South Bay Water Reclamation Plant',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-117.0678, 32.5734],
    cityId: 'san-diego',
    capacity: '15 MGD',
    description: 'Water reclamation facility producing recycled water for irrigation and industrial use.',
    metrics: {
      dailyFlow: '12 MGD',
      treatmentLevel: 'Tertiary',
      energyConsumption: '6,800 kWh/day',
      lastInspection: '2024-02-15',
    },
  },
  {
    id: 'sd-wtp-1',
    name: 'Otay Water Treatment Plant',
    type: 'water-treatment',
    status: 'operational',
    coordinates: [-116.9345, 32.6123],
    cityId: 'san-diego',
    capacity: '40 MGD',
    description: 'Drinking water treatment plant serving southeastern San Diego County.',
    metrics: {
      dailyFlow: '32 MGD',
      treatmentLevel: 'Full Treatment',
      energyConsumption: '15,000 kWh/day',
      lastInspection: '2024-03-10',
    },
  },
  {
    id: 'cb-desal-1',
    name: 'Carlsbad Desalination Plant',
    type: 'desalination',
    status: 'operational',
    coordinates: [-117.3256, 33.1423],
    cityId: 'carlsbad',
    capacity: '50 MGD',
    description: 'The largest seawater desalination plant in the Western Hemisphere, providing drought-proof water supply.',
    metrics: {
      dailyFlow: '50 MGD',
      treatmentLevel: 'Reverse Osmosis',
      energyConsumption: '125,000 kWh/day',
      lastInspection: '2024-01-20',
    },
  },
  {
    id: 'cb-wwtp-1',
    name: 'Encina Water Pollution Control Facility',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-117.3123, 33.1567],
    cityId: 'carlsbad',
    capacity: '44 MGD',
    description: 'Regional wastewater treatment facility serving multiple North County cities.',
    metrics: {
      dailyFlow: '24 MGD',
      treatmentLevel: 'Secondary',
      energyConsumption: '9,500 kWh/day',
      lastInspection: '2024-02-28',
    },
  },
  {
    id: 'en-wwtp-1',
    name: 'PTAR El Naranjo',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-116.6123, 31.8456],
    cityId: 'ensenada',
    capacity: '35 MGD',
    description: 'Primary wastewater treatment plant for Ensenada metropolitan area.',
    metrics: {
      dailyFlow: '28 MGD',
      treatmentLevel: 'Secondary',
      energyConsumption: '7,200 kWh/day',
      lastInspection: '2024-02-10',
    },
  },
  {
    id: 'en-desal-1',
    name: 'Desaladora de Ensenada',
    type: 'desalination',
    status: 'operational',
    coordinates: [-116.5734, 31.8234],
    cityId: 'ensenada',
    capacity: '5 MGD',
    description: 'Seawater desalination facility supplementing the city water supply.',
    metrics: {
      dailyFlow: '4.5 MGD',
      treatmentLevel: 'Reverse Osmosis',
      energyConsumption: '11,000 kWh/day',
      lastInspection: '2024-03-05',
    },
  },
  {
    id: 'mx-wwtp-1',
    name: 'PTAR Zaragoza',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-115.4234, 32.6456],
    cityId: 'mexicali',
    capacity: '60 MGD',
    description: 'Major treatment facility for Mexicali, with water reuse for agricultural irrigation.',
    metrics: {
      dailyFlow: '52 MGD',
      treatmentLevel: 'Secondary',
      energyConsumption: '13,500 kWh/day',
      lastInspection: '2024-01-25',
    },
  },
  {
    id: 'mx-res-1',
    name: 'Presa Morelos',
    type: 'reservoir',
    status: 'operational',
    coordinates: [-115.1234, 32.7123],
    cityId: 'mexicali',
    capacity: '1,000 acre-feet',
    description: 'Diversion dam on the Colorado River for agricultural and municipal water supply.',
    metrics: {
      lastInspection: '2024-02-05',
    },
  },
  {
    id: 'ib-ps-1',
    name: 'IBWC Pump Station',
    type: 'pumping-station',
    status: 'operational',
    coordinates: [-117.1056, 32.5678],
    cityId: 'imperial-beach',
    capacity: '25 MGD',
    description: 'International Boundary and Water Commission facility managing cross-border wastewater flows.',
    metrics: {
      dailyFlow: '18 MGD',
      energyConsumption: '5,200 kWh/day',
      lastInspection: '2024-03-15',
    },
  },
  {
    id: 'rs-wwtp-1',
    name: 'PTAR Rosarito',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-117.0456, 32.3456],
    cityId: 'rosarito',
    capacity: '15 MGD',
    description: 'Wastewater treatment plant serving Rosarito and surrounding coastal communities.',
    metrics: {
      dailyFlow: '10 MGD',
      treatmentLevel: 'Secondary',
      energyConsumption: '3,500 kWh/day',
      lastInspection: '2024-02-25',
    },
  },
  {
    id: 'tc-wwtp-1',
    name: 'PTAR Tecate',
    type: 'wastewater-treatment',
    status: 'operational',
    coordinates: [-116.6056, 32.5534],
    cityId: 'tecate',
    capacity: '8 MGD',
    description: 'Municipal wastewater treatment facility for the city of Tecate.',
    metrics: {
      dailyFlow: '5 MGD',
      treatmentLevel: 'Secondary',
      energyConsumption: '1,800 kWh/day',
      lastInspection: '2024-03-01',
    },
  },
]

export function getFacilityById(id: string): Facility | undefined {
  return facilities.find(f => f.id === id)
}

export function getFacilitiesByCity(cityId: string): Facility[] {
  return facilities.filter(f => f.cityId === cityId)
}

export function getAllFacilities(): Facility[] {
  return facilities
}

// Extended facility type for detail page
export interface MockFacility extends Facility {
  city: string
  populationServed: number
  yearBuilt: number
  currentLoad: number
  efficiency: number
  alerts: number
}

const facilityDefaults: Record<string, { populationServed: number; yearBuilt: number; currentLoad: number; efficiency: number; alerts: number }> = {
  'tj-wwtp-1': { populationServed: 320000, yearBuilt: 1989, currentLoad: 87, efficiency: 94, alerts: 1 },
  'tj-wwtp-2': { populationServed: 120000, yearBuilt: 2002, currentLoad: 72, efficiency: 91, alerts: 0 },
  'sd-wwtp-1': { populationServed: 480000, yearBuilt: 1976, currentLoad: 65, efficiency: 97, alerts: 0 },
  'sd-desal-1': { populationServed: 200000, yearBuilt: 2015, currentLoad: 78, efficiency: 99, alerts: 0 },
  'ib-ps-1': { populationServed: 28000, yearBuilt: 1995, currentLoad: 60, efficiency: 88, alerts: 2 },
  'en-wwtp-1': { populationServed: 180000, yearBuilt: 1997, currentLoad: 70, efficiency: 92, alerts: 0 },
  'mx-wwtp-1': { populationServed: 650000, yearBuilt: 1985, currentLoad: 91, efficiency: 89, alerts: 3 },
  'cb-wtp-1': { populationServed: 115000, yearBuilt: 1988, currentLoad: 68, efficiency: 96, alerts: 0 },
  'rs-wwtp-1': { populationServed: 95000, yearBuilt: 2001, currentLoad: 74, efficiency: 90, alerts: 1 },
  'tc-wtp-1': { populationServed: 42000, yearBuilt: 1993, currentLoad: 62, efficiency: 93, alerts: 0 },
}

export const mockFacilities: MockFacility[] = facilities.map(f => {
  const d = facilityDefaults[f.id] ?? { populationServed: 80000, yearBuilt: 1990, currentLoad: 70, efficiency: 90, alerts: 0 }
  return {
    ...f,
    city: f.cityId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    ...d,
  }
})

export const facilityPerformanceData = [
  { day: 'Mon', flow: 62, energy: 11200 },
  { day: 'Tue', flow: 65, energy: 11800 },
  { day: 'Wed', flow: 70, energy: 12400 },
  { day: 'Thu', flow: 68, energy: 12100 },
  { day: 'Fri', flow: 72, energy: 12800 },
  { day: 'Sat', flow: 58, energy: 10400 },
  { day: 'Sun', flow: 55, energy: 9900 },
]

export const treatmentStages = [
  { name: 'Screening & Grit Removal', description: 'Physical removal of large solids, grit, and debris from influent wastewater.', status: 'active', efficiency: 95, duration: 10 },
  { name: 'Primary Clarification', description: 'Gravity settling removes 50-70% of suspended solids and 25-40% of BOD.', status: 'active', efficiency: 65, duration: 90 },
  { name: 'Biological Treatment', description: 'Activated sludge process with aeration for biological oxidation of organics.', status: 'active', efficiency: 92, duration: 360 },
  { name: 'Secondary Clarification', description: 'Separation of biological sludge from treated effluent.', status: 'active', efficiency: 90, duration: 120 },
  { name: 'Disinfection', description: 'Chlorination or UV treatment to eliminate pathogens before discharge.', status: 'active', efficiency: 99, duration: 30 },
  { name: 'Sludge Handling', description: 'Thickening, digestion, and dewatering of biosolids for disposal or reuse.', status: 'active', efficiency: 85, duration: 1440 },
]
