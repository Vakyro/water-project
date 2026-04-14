// City types
export interface City {
  id: string
  name: string
  slug: string
  country: 'mexico' | 'usa'
  state: string
  coordinates: [number, number] // [lng, lat]
  population: number
  description: string
}

export interface CityProfile {
  city: City
  waterFacilities: FacilitySummary[]
  microplastics: MicroplasticsSummary
  waterContamination: ContaminationSummary
  waterQuality: WaterQualitySummary
}

// Facility types
export interface Facility {
  id: string
  name: string
  type: FacilityType
  status: 'operational' | 'under-construction' | 'decommissioned' | 'maintenance'
  coordinates: [number, number]
  cityId: string
  capacity: string
  description: string
  metrics: FacilityMetrics
}

export type FacilityType = 
  | 'wastewater-treatment'
  | 'water-treatment'
  | 'desalination'
  | 'pumping-station'
  | 'reservoir'

export interface FacilityMetrics {
  dailyFlow?: string
  treatmentLevel?: string
  energyConsumption?: string
  lastInspection?: string
}

export interface FacilitySummary {
  id: string
  name: string
  type: FacilityType
  status: string
}

// Microplastics types
export interface MicroplasticsEntry {
  id: string
  source: string
  affectedArea: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  coordinates: [number, number]
  cityId: string
  metrics: MicroplasticsMetrics
  description: string
  detectedDate: string
}

export interface MicroplasticsMetrics {
  concentration: string
  particleTypes: string[]
  sampleDepth: string
  sampleCount: number
}

export interface MicroplasticsSummary {
  overview: string
  avgConcentration: string
  hotspots: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

// Water contamination types
export interface ContaminationMarker {
  id: string
  cityId: string
  coordinates: [number, number]
  pollutants: Pollutant[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  detectedDate: string
}

export interface Pollutant {
  name: string
  level: string
  maxAllowed: string
  exceedance: boolean
}

export interface ContaminationSummary {
  overview: string
  mainPollutants: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  affectedAreas: number
}

// Water quality types
export interface WaterQualityPoint {
  id: string
  name: string
  coordinates: [number, number]
  cityId: string
  metrics: WaterQualityMetrics
  rating: 'excellent' | 'good' | 'fair' | 'poor'
  lastUpdated: string
}

export interface WaterQualityMetrics {
  ph: number
  salinity: number
  dissolvedOxygen: number
  turbidity: number
  temperature: number
  conductivity: number
}

export interface WaterQualitySummary {
  overview: string
  avgPh: number
  avgSalinity: number
  overallRating: 'excellent' | 'good' | 'fair' | 'poor'
  monitoringStations: number
}

// Chat types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: Citation[]
  /** Average similarity score (0–1) of the retrieved chunks. Only present on assistant messages. */
  confidence?: number
  /** True while the API is still returning the response */
  isLoading?: boolean
}

/**
 * A citation returned by the RAG pipeline.
 * Can refer to a scientific paper or to a platform data entity (city, facility, etc.).
 */
export interface Citation {
  /** Where this citation comes from */
  source: 'paper' | 'entity'
  /** Citation number shown to the user — matches [N] in the response text */
  number: number

  // ── Paper fields (source === 'paper') ──────────────────────────────────────
  paperId?: string
  title?: string
  authors?: string[]
  year?: number
  doi?: string
  pageRange?: string

  // ── Entity fields (source === 'entity') ────────────────────────────────────
  entityType?: string   // 'city' | 'facility' | 'microplastics' | 'contamination' | 'water-quality'
  entityId?: string

  /** Cosine similarity score (0–1) */
  similarity: number
}

// Verification types
export interface Report {
  id: string
  createdAt: Date
  reportType: 'chat' | 'map' | 'city_page' | 'other'
  route: string
  citySlug?: string
  entityId?: string
  chatMessageId?: string
  reasonCategory: string
  description: string
  suggestedFix?: string
  severity: 'low' | 'medium' | 'high'
  status: 'new' | 'triaged' | 'fixed' | 'wont_fix'
}

// Map types
export interface MapLayer {
  id: string
  name: string
  visible: boolean
  color: string
}

export interface MapEntity {
  id: string
  type: 'city' | 'facility' | 'microplastics' | 'contamination' | 'water-quality'
  name: string
  coordinates: [number, number]
  data: City | Facility | MicroplasticsEntry | ContaminationMarker | WaterQualityPoint
}

// Biochem simulation types
export interface ActivatedSludgeParams {
  influentCOD: number
  influentNH3: number
  dissolvedOxygen: number
  temperature: number
  hrt: number
  srt: number
}

export interface ActivatedSludgeResult {
  time: number[]
  nh3: number[]
  no2: number[]
  no3: number[]
  dissolvedOxygen: number[]
  oxygenDemand: number[]
}

export interface DisinfectionParams {
  toc: number
  bromide: number
  chlorineDose: number
  contactTime: number
  temperature: number
}

export interface DisinfectionResult {
  thmRisk: 'low' | 'medium' | 'high' | 'very-high'
  haaRisk: 'low' | 'medium' | 'high' | 'very-high'
  pathogenReduction: number
  dbpFormation: number
}

export interface QMRAParams {
  organismConcentration: number
  exposureVolume: number
  logReduction: number
}

export interface QMRAResult {
  infectionRisk: number
  dailyRisk: number
  annualRisk: number
  acceptableRisk: boolean
}

// Search types
export interface SearchResult {
  type: 'city' | 'facility' | 'microplastics' | 'water-quality' | 'biochem'
  id: string
  title: string
  description: string
  route: string
}

// ─── RAG / Chat types ────────────────────────────────────────────────────────

export type EmbeddingVector = number[]

/** Raw row returned by the match_all_chunks Supabase RPC */
export interface RAGChunk {
  source: 'paper' | 'entity'
  chunk_id: number
  content: string
  similarity: number
  // Populated when source === 'entity'
  entity_type: string | null
  entity_id: string | null
  // Populated when source === 'paper'
  paper_id: string | null
}

/** A paper record from the papers table */
export interface Paper {
  id: string
  title: string
  authors: string[]
  year: number
  doi: string | null
  url: string | null
  sha256: string
  created_at: string
}

/** Full API response from POST /api/chat */
export interface RAGResponse {
  response: string
  citations: Citation[]
  chunksUsed: number
  confidence: number  // 0–1, average similarity of top chunks
}

/** Parameters for the match_all_chunks RPC */
export interface SearchParams {
  queryEmbedding: EmbeddingVector
  matchThreshold?: number
  matchCount?: number
}
