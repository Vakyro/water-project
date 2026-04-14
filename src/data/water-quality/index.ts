import type { WaterQualityPoint, ContaminationMarker } from '@/src/core/types'

export const waterQualityPoints: WaterQualityPoint[] = [
  {
    id: 'wq-tj-1',
    name: 'Tijuana River Monitoring Station',
    coordinates: [-117.0934, 32.5456],
    cityId: 'tijuana',
    metrics: {
      ph: 7.2,
      salinity: 35.5,
      dissolvedOxygen: 6.8,
      turbidity: 12.5,
      temperature: 18.2,
      conductivity: 48500,
    },
    rating: 'fair',
    lastUpdated: '2024-03-15',
  },
  {
    id: 'wq-tj-2',
    name: 'Playas de Tijuana Beach',
    coordinates: [-117.1234, 32.5189],
    cityId: 'tijuana',
    metrics: {
      ph: 7.8,
      salinity: 34.8,
      dissolvedOxygen: 7.5,
      turbidity: 8.2,
      temperature: 17.5,
      conductivity: 47800,
    },
    rating: 'good',
    lastUpdated: '2024-03-14',
  },
  {
    id: 'wq-sd-1',
    name: 'San Diego Bay - Harbor Island',
    coordinates: [-117.1889, 32.7234],
    cityId: 'san-diego',
    metrics: {
      ph: 7.9,
      salinity: 34.2,
      dissolvedOxygen: 8.1,
      turbidity: 4.5,
      temperature: 16.8,
      conductivity: 47200,
    },
    rating: 'excellent',
    lastUpdated: '2024-03-15',
  },
  {
    id: 'wq-sd-2',
    name: 'Mission Beach',
    coordinates: [-117.2534, 32.7789],
    cityId: 'san-diego',
    metrics: {
      ph: 8.0,
      salinity: 34.5,
      dissolvedOxygen: 8.3,
      turbidity: 3.8,
      temperature: 17.2,
      conductivity: 47500,
    },
    rating: 'excellent',
    lastUpdated: '2024-03-14',
  },
  {
    id: 'wq-sd-3',
    name: 'Point Loma',
    coordinates: [-117.2456, 32.6678],
    cityId: 'san-diego',
    metrics: {
      ph: 7.8,
      salinity: 34.6,
      dissolvedOxygen: 7.8,
      turbidity: 5.2,
      temperature: 16.5,
      conductivity: 47600,
    },
    rating: 'good',
    lastUpdated: '2024-03-15',
  },
  {
    id: 'wq-ib-1',
    name: 'Imperial Beach Pier',
    coordinates: [-117.1334, 32.5789],
    cityId: 'imperial-beach',
    metrics: {
      ph: 7.3,
      salinity: 34.1,
      dissolvedOxygen: 5.9,
      turbidity: 18.5,
      temperature: 17.8,
      conductivity: 46800,
    },
    rating: 'poor',
    lastUpdated: '2024-03-15',
  },
  {
    id: 'wq-ib-2',
    name: 'Tijuana Slough',
    coordinates: [-117.1089, 32.5534],
    cityId: 'imperial-beach',
    metrics: {
      ph: 7.1,
      salinity: 28.5,
      dissolvedOxygen: 4.8,
      turbidity: 25.3,
      temperature: 19.2,
      conductivity: 39200,
    },
    rating: 'poor',
    lastUpdated: '2024-03-14',
  },
  {
    id: 'wq-en-1',
    name: 'Ensenada Harbor',
    coordinates: [-116.6189, 31.8567],
    cityId: 'ensenada',
    metrics: {
      ph: 7.7,
      salinity: 35.2,
      dissolvedOxygen: 7.2,
      turbidity: 7.8,
      temperature: 16.2,
      conductivity: 48200,
    },
    rating: 'good',
    lastUpdated: '2024-03-13',
  },
  {
    id: 'wq-en-2',
    name: 'Playa Hermosa',
    coordinates: [-116.6456, 31.8234],
    cityId: 'ensenada',
    metrics: {
      ph: 8.1,
      salinity: 35.0,
      dissolvedOxygen: 8.0,
      turbidity: 4.2,
      temperature: 15.8,
      conductivity: 48000,
    },
    rating: 'excellent',
    lastUpdated: '2024-03-14',
  },
  {
    id: 'wq-mx-1',
    name: 'Colorado River - Morelos Dam',
    coordinates: [-114.7234, 32.7189],
    cityId: 'mexicali',
    metrics: {
      ph: 7.4,
      salinity: 1.8,
      dissolvedOxygen: 6.5,
      turbidity: 15.2,
      temperature: 22.5,
      conductivity: 2450,
    },
    rating: 'fair',
    lastUpdated: '2024-03-12',
  },
  {
    id: 'wq-mx-2',
    name: 'New River Border Crossing',
    coordinates: [-115.5189, 32.6734],
    cityId: 'mexicali',
    metrics: {
      ph: 6.9,
      salinity: 2.5,
      dissolvedOxygen: 3.2,
      turbidity: 45.8,
      temperature: 24.5,
      conductivity: 3200,
    },
    rating: 'poor',
    lastUpdated: '2024-03-15',
  },
  {
    id: 'wq-cb-1',
    name: 'Carlsbad State Beach',
    coordinates: [-117.3389, 33.1456],
    cityId: 'carlsbad',
    metrics: {
      ph: 8.0,
      salinity: 34.8,
      dissolvedOxygen: 8.5,
      turbidity: 3.2,
      temperature: 16.5,
      conductivity: 47800,
    },
    rating: 'excellent',
    lastUpdated: '2024-03-14',
  },
  {
    id: 'wq-rs-1',
    name: 'Rosarito Beach Central',
    coordinates: [-117.0534, 32.3634],
    cityId: 'rosarito',
    metrics: {
      ph: 7.6,
      salinity: 35.1,
      dissolvedOxygen: 7.0,
      turbidity: 9.5,
      temperature: 17.0,
      conductivity: 48100,
    },
    rating: 'fair',
    lastUpdated: '2024-03-13',
  },
]

export const contaminationMarkers: ContaminationMarker[] = [
  {
    id: 'cm-tj-1',
    cityId: 'tijuana',
    coordinates: [-117.0834, 32.5356],
    pollutants: [
      { name: 'Fecal Coliform', level: '2400 MPN/100mL', maxAllowed: '200 MPN/100mL', exceedance: true },
      { name: 'Total Suspended Solids', level: '85 mg/L', maxAllowed: '30 mg/L', exceedance: true },
      { name: 'Ammonia', level: '12 mg/L', maxAllowed: '5 mg/L', exceedance: true },
    ],
    severity: 'high',
    description: 'Significant contamination from untreated sewage overflow during rain events.',
    detectedDate: '2024-02-28',
  },
  {
    id: 'cm-tj-2',
    cityId: 'tijuana',
    coordinates: [-117.0234, 32.5089],
    pollutants: [
      { name: 'Heavy Metals (Lead)', level: '0.08 mg/L', maxAllowed: '0.015 mg/L', exceedance: true },
      { name: 'Zinc', level: '2.5 mg/L', maxAllowed: '5 mg/L', exceedance: false },
    ],
    severity: 'medium',
    description: 'Industrial discharge contributing to heavy metal contamination.',
    detectedDate: '2024-01-15',
  },
  {
    id: 'cm-ib-1',
    cityId: 'imperial-beach',
    coordinates: [-117.1134, 32.5689],
    pollutants: [
      { name: 'Fecal Coliform', level: '5600 MPN/100mL', maxAllowed: '200 MPN/100mL', exceedance: true },
      { name: 'Enterococcus', level: '1200 MPN/100mL', maxAllowed: '104 MPN/100mL', exceedance: true },
      { name: 'Trash/Debris', level: 'High', maxAllowed: 'Low', exceedance: true },
    ],
    severity: 'critical',
    description: 'Cross-border sewage flows causing beach closures and health advisories.',
    detectedDate: '2024-03-10',
  },
  {
    id: 'cm-mx-1',
    cityId: 'mexicali',
    coordinates: [-115.4834, 32.6234],
    pollutants: [
      { name: 'Pesticides (Chlorpyrifos)', level: '0.5 μg/L', maxAllowed: '0.1 μg/L', exceedance: true },
      { name: 'Nitrates', level: '45 mg/L', maxAllowed: '10 mg/L', exceedance: true },
    ],
    severity: 'high',
    description: 'Agricultural runoff carrying pesticides and fertilizers into water bodies.',
    detectedDate: '2024-02-20',
  },
  {
    id: 'cm-mx-2',
    cityId: 'mexicali',
    coordinates: [-115.5389, 32.6589],
    pollutants: [
      { name: 'Selenium', level: '0.15 mg/L', maxAllowed: '0.05 mg/L', exceedance: true },
      { name: 'Total Dissolved Solids', level: '3500 mg/L', maxAllowed: '500 mg/L', exceedance: true },
    ],
    severity: 'medium',
    description: 'Naturally occurring selenium elevated by agricultural drainage.',
    detectedDate: '2024-01-25',
  },
  {
    id: 'cm-en-1',
    cityId: 'ensenada',
    coordinates: [-116.6034, 31.8489],
    pollutants: [
      { name: 'Oil & Grease', level: '25 mg/L', maxAllowed: '10 mg/L', exceedance: true },
      { name: 'BOD', level: '35 mg/L', maxAllowed: '20 mg/L', exceedance: true },
    ],
    severity: 'medium',
    description: 'Port and fishing activities contributing to localized contamination.',
    detectedDate: '2024-02-05',
  },
  {
    id: 'cm-rs-1',
    cityId: 'rosarito',
    coordinates: [-117.0389, 32.3489],
    pollutants: [
      { name: 'Fecal Coliform', level: '800 MPN/100mL', maxAllowed: '200 MPN/100mL', exceedance: true },
    ],
    severity: 'medium',
    description: 'Seasonal sewage overflow during peak tourism periods.',
    detectedDate: '2024-03-01',
  },
]

export function getWaterQualityById(id: string): WaterQualityPoint | undefined {
  return waterQualityPoints.find(wq => wq.id === id)
}

export function getWaterQualityByCity(cityId: string): WaterQualityPoint[] {
  return waterQualityPoints.filter(wq => wq.cityId === cityId)
}

export function getAllWaterQuality(): WaterQualityPoint[] {
  return waterQualityPoints
}

export function getContaminationByCity(cityId: string): ContaminationMarker[] {
  return contaminationMarkers.filter(cm => cm.cityId === cityId)
}

export function getAllContamination(): ContaminationMarker[] {
  return contaminationMarkers
}
