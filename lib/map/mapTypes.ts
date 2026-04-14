export interface GeoJSONGeometry {
  type: string
  coordinates: number[][] | number[][][]
}

export interface GeoJSONFeature {
  type: string
  geometry: GeoJSONGeometry
  properties: Record<string, unknown>
}

export interface GeoJSON {
  type: string
  features: GeoJSONFeature[]
}

export interface Bounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}
