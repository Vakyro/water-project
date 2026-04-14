import type { GeoJSON, Bounds } from './mapTypes'

// Regional bounds for the full overview map (Baja California + Southern California corridor)
const REGION_MIN_LAT = 28.5
const REGION_MAX_LAT = 37.5
const REGION_MIN_LNG = -122.54
const REGION_MAX_LNG = -109.07
const SVG_W = 800
const SVG_H = 686

/** Convert a GeoJSON coordinate array to an SVG path string using the regional projection. */
export const geoJSONToSVGPath = (coordinates: number[][]): string => {
  const commands = coordinates.map(([lng, lat], i) => {
    const x = ((lng - REGION_MIN_LNG) / (REGION_MAX_LNG - REGION_MIN_LNG)) * SVG_W
    const y = ((REGION_MAX_LAT - lat) / (REGION_MAX_LAT - REGION_MIN_LAT)) * SVG_H
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  })
  return commands.join(' ') + ' Z'
}

/** Project a lat/lng to SVG x/y using the regional projection. */
export const projectToSVG = (lat: number, lng: number): { x: number; y: number } => {
  const x = ((lng - REGION_MIN_LNG) / (REGION_MAX_LNG - REGION_MIN_LNG)) * SVG_W
  const y = ((REGION_MAX_LAT - lat) / (REGION_MAX_LAT - REGION_MIN_LAT)) * SVG_H
  return { x, y }
}

/** Calculate padded bounds from a city GeoJSON, maintaining the SVG aspect ratio. */
export const calculateBounds = (geoJSON: GeoJSON): Bounds => {
  let minLat = Infinity, maxLat = -Infinity
  let minLng = Infinity, maxLng = -Infinity

  geoJSON.features.forEach(feature => {
    const coords = feature.geometry.coordinates[0] as number[][]
    coords.forEach(([lng, lat]) => {
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
    })
  })

  const latRange = maxLat - minLat
  const lngRange = maxLng - minLng
  const latPadding = latRange * 0.02
  const lngPadding = lngRange * 0.02
  const viewBoxAspect = SVG_W / SVG_H

  let finalMinLat = minLat - latPadding
  let finalMaxLat = maxLat + latPadding
  let finalMinLng = minLng - lngPadding
  let finalMaxLng = maxLng + lngPadding

  const contentAspect = lngRange / latRange
  if (contentAspect > viewBoxAspect) {
    const targetLatRange = (lngRange + 2 * lngPadding) / viewBoxAspect
    const extra = (targetLatRange - (latRange + 2 * latPadding)) / 2
    finalMinLat -= extra
    finalMaxLat += extra
  } else {
    const targetLngRange = (latRange + 2 * latPadding) * viewBoxAspect
    const extra = (targetLngRange - (lngRange + 2 * lngPadding)) / 2
    finalMinLng -= extra
    finalMaxLng += extra
  }

  return { minLat: finalMinLat, maxLat: finalMaxLat, minLng: finalMinLng, maxLng: finalMaxLng }
}

/** Project a lat/lng to SVG x/y within the city-level bounds. */
export const cityCoordToSVG = (lat: number, lng: number, bounds: Bounds): { x: number; y: number } => {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * SVG_W
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * SVG_H
  return { x, y }
}

/** Convert a city GeoJSON feature coordinate array to an SVG path within the given bounds. */
export const cityFeatureToSVGPath = (coordinates: number[][], bounds: Bounds): string => {
  const commands = coordinates.map(([lng, lat], i) => {
    const { x, y } = cityCoordToSVG(lat, lng, bounds)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  })
  return commands.join(' ') + ' Z'
}
