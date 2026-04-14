"use client"

import { useEffect, useMemo, useState } from 'react'
import { Factory, Droplets, ArrowLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { LayerTogglePanel } from '@/components/map/layer-toggle-panel'
import {
  geoJSONToSVGPath,
  projectToSVG,
  calculateBounds,
  cityCoordToSVG,
  cityFeatureToSVGPath,
} from '@/lib/map/mapUtils'
import type { GeoJSON } from '@/lib/map/mapTypes'
import type { MapEntity, MapLayer, Facility, MicroplasticsEntry, ContaminationMarker, WaterQualityPoint } from '@/src/core/types'
import { facilities } from '@/src/data/facilities'
import { microplasticsEntries } from '@/src/data/microplastics'
import { waterQualityPoints, contaminationMarkers } from '@/src/data/water-quality'

// ── City → GeoJSON file mapping ───────────────────────────────────────────────
const CITY_GEOJSON_MAP: Record<string, string> = {
  tijuana:       'tijuana',
  ensenada:      'ensenada',
  mexicali:      'mexicali',
  tecate:        'tecate',
  'san-diego':   'sanDiego',
  'san-luis':    'sanLuis',
  'los-angeles': 'losAngeles',
  bakersfield:   'bakersfield',
  brawley:       'bradwley',
}

const CITY_NAMES: Record<string, string> = {
  tijuana:       'Tijuana',
  ensenada:      'Ensenada',
  mexicali:      'Mexicali',
  tecate:        'Tecate',
  'san-diego':   'San Diego',
  'san-luis':    'San Luis',
  'los-angeles': 'Los Angeles',
  bakersfield:   'Bakersfield',
  brawley:       'Brawley',
}


// Base overview center for zoom
const BASE_CX = -50 + 700 / 2  // 300
const BASE_CY =  50 + 550 / 2  // 325

function getZoomedViewBox(zoom: number): string {
  const w = 700 / zoom
  const h = 550 / zoom
  return `${BASE_CX - w / 2} ${BASE_CY - h / 2} ${w} ${h}`
}

interface MapCanvasProps {
  layers: MapLayer[]
  onSelectEntity: (entity: MapEntity | null) => void
  selectedEntity: MapEntity | null
  onSelectLayer?: (layerId: string) => void
}

export function MapCanvas({ layers, onSelectEntity, selectedEntity, onSelectLayer }: MapCanvasProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [cityGeoJSON, setCityGeoJSON] = useState<GeoJSON | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showCityMap, setShowCityMap] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleZoomIn    = () => setZoom(prev => Math.min(prev * 1.2, 4))
  const handleZoomOut   = () => setZoom(prev => Math.max(prev / 1.2, 0.5))
  const handleResetView = () => setZoom(1)

  useEffect(() => {
    if (selectedCity && CITY_GEOJSON_MAP[selectedCity]) {
      fetch(`/maps_jsons/${CITY_GEOJSON_MAP[selectedCity]}.geojson`)
        .then(r => r.json())
        .then(data => { setCityGeoJSON(data); setIsLoading(false) })
        .catch(() => setIsLoading(false))
    } else {
      setCityGeoJSON(null)
    }
  }, [selectedCity])

  const isLayerVisible = (id: string) => layers.find(l => l.id === id)?.visible ?? false

  const handleCityClick = (cityId: string) => {
    if (isTransitioning || !CITY_GEOJSON_MAP[cityId]) return
    onSelectEntity(null)
    setIsLoading(true)
    setIsTransitioning(true)
    setSelectedCity(cityId)
    setTimeout(() => { setShowCityMap(true); setIsTransitioning(false) }, 600)
  }

  const handleBackToFullMap = () => {
    setIsTransitioning(true)
    setShowCityMap(false)
    onSelectEntity(null)
    setTimeout(() => {
      setSelectedCity(null)
      setCityGeoJSON(null)
      setIsTransitioning(false)
    }, 600)
  }

  // stopPropagation prevents the container onClick from also firing (click-outside logic)
  const handleEntityClick = (entity: MapEntity, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectEntity(selectedEntity?.id === entity.id ? null : entity)
  }

  // Entity counts per layer for the current city (used in LayerTogglePanel badges)
  const cityCounts = useMemo(() => {
    if (!selectedCity) return undefined
    return {
      facilities:      facilities.filter(f => f.cityId === selectedCity).length,
      microplastics:   microplasticsEntries.filter(m => m.cityId === selectedCity).length,
      contamination:   contaminationMarkers.filter(c => c.cityId === selectedCity).length,
      'water-quality': waterQualityPoints.filter(wq => wq.cityId === selectedCity).length,
    }
  }, [selectedCity])

  // ── City-level map ─────────────────────────────────────────────────────────
  const renderCityMap = () => {
    if (!cityGeoJSON || !selectedCity) return null

    const bounds = calculateBounds(cityGeoJSON)
    const animClass = showCityMap ? 'opacity-100 scale-100' : 'opacity-0 scale-95'

    const cityFacilities    = facilities.filter(f => f.cityId === selectedCity)
    const cityMicro         = microplasticsEntries.filter(m => m.cityId === selectedCity)
    const cityContamination = contaminationMarkers.filter(c => c.cityId === selectedCity)
    const cityWaterQuality  = waterQualityPoints.filter(wq => wq.cityId === selectedCity)

    const activeLayer = layers.find(l => l.visible)
    const activeCount = activeLayer ? ({
      facilities:      cityFacilities.length,
      microplastics:   cityMicro.length,
      contamination:   cityContamination.length,
      'water-quality': cityWaterQuality.length,
    } as Record<string, number>)[activeLayer.id] ?? 0 : 0

    const makeEntity = <T extends { id: string; coordinates: [number, number] }>(
      item: T,
      type: MapEntity['type'],
      name: string,
      data: Facility | MicroplasticsEntry | ContaminationMarker | WaterQualityPoint,
    ): MapEntity => ({ id: item.id, type, name, coordinates: item.coordinates, data })

    return (
      <>
      <svg
        viewBox="0 0 800 686"
        className={`absolute inset-0 w-full h-full transition-all duration-[600ms] ease-in-out ${animClass}`}
        style={{ transformOrigin: 'center center' }}
      >
        <defs>
          <linearGradient id="cityOceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0.5)" />
          </linearGradient>
          <pattern id="cityOceanTexture" patternUnits="userSpaceOnUse" width="30" height="20">
            <path d="M0 10 Q7.5 5 15 10 T30 10" stroke="oklch(0.75 0.08 160)" strokeWidth="0.5" fill="none" opacity="0.3"/>
          </pattern>
        </defs>

        {/* Clicking background deselects current entity */}
        <rect x="0" y="0" width="800" height="686" fill="url(#cityOceanGradient)" onClick={() => onSelectEntity(null)} style={{ cursor: 'default' }} />
        <rect x="0" y="0" width="800" height="686" fill="url(#cityOceanTexture)" style={{ pointerEvents: 'none' }} />

        {cityGeoJSON.features.map((feature, i) => {
          const coords = feature.geometry.coordinates[0] as number[][]
          return (
            <path
              key={i}
              d={cityFeatureToSVGPath(coords, bounds)}
              fill={i === 0 ? '#EDFCFF' : '#b5e0cf'}
              opacity="0.9"
              style={{ pointerEvents: 'none' }}
            />
          )
        })}

        <TooltipProvider>
          {/* Facilities */}
          {isLayerVisible('facilities') && cityFacilities.map(f => {
            const { x, y } = cityCoordToSVG(f.coordinates[1], f.coordinates[0], bounds)
            const entity = makeEntity(f, 'facility', f.name, f)
            const isSelected = selectedEntity?.id === entity.id
            return (
              <Tooltip key={f.id}>
                <TooltipTrigger asChild>
                  <g className="cursor-pointer" onClick={(e) => handleEntityClick(entity, e)}>
                    <circle cx={x} cy={y} r={isSelected ? 22 : 20} fill="white" fillOpacity="0.9" stroke={isSelected ? '#3b82f6' : '#94a3b8'} strokeWidth={isSelected ? 2.5 : 1} />
                    <foreignObject x={x - 12} y={y - 12} width="24" height="24" style={{ pointerEvents: 'none' }}>
                      <div className="flex items-center justify-center w-full h-full">
                        <Factory className="w-5 h-5 text-blue-600" />
                      </div>
                    </foreignObject>
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.type.replace(/-/g, ' ')}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Microplastics */}
          {isLayerVisible('microplastics') && cityMicro.map(m => {
            const { x, y } = cityCoordToSVG(m.coordinates[1], m.coordinates[0], bounds)
            const entity = makeEntity(m, 'microplastics', m.affectedArea, m)
            const isSelected = selectedEntity?.id === entity.id
            return (
              <Tooltip key={m.id}>
                <TooltipTrigger asChild>
                  <g className="cursor-pointer" onClick={(e) => handleEntityClick(entity, e)}>
                    {[14, 10, 6].map((r, i) => (
                      <circle key={i} cx={x + (i === 0 ? 0 : i === 1 ? 5 : -5)} cy={y + (i === 0 ? 0 : i === 1 ? -4 : 4)} r={r / 2} fill="rgba(100,150,180,0.6)" stroke={isSelected ? '#f59e0b' : 'none'} strokeWidth={1} />
                    ))}
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{m.affectedArea}</p>
                  <p className="text-xs text-muted-foreground capitalize">{m.severity} severity</p>
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Contamination */}
          {isLayerVisible('contamination') && cityContamination.map(c => {
            const { x, y } = cityCoordToSVG(c.coordinates[1], c.coordinates[0], bounds)
            const entity = makeEntity(c, 'contamination', c.description.substring(0, 40), c)
            const isSelected = selectedEntity?.id === entity.id
            const size = c.severity === 'critical' ? 14 : c.severity === 'high' ? 12 : 10
            return (
              <Tooltip key={c.id}>
                <TooltipTrigger asChild>
                  <g className="cursor-pointer" onClick={(e) => handleEntityClick(entity, e)}>
                    <polygon
                      points={`${x},${y - size} ${x + size},${y + size} ${x - size},${y + size}`}
                      fill="rgba(239,68,68,0.75)"
                      stroke={isSelected ? '#fff' : 'none'}
                      strokeWidth={2}
                    />
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium capitalize">{c.severity} contamination</p>
                  <p className="text-xs text-muted-foreground">{c.pollutants[0]?.name ?? ''}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Water quality */}
          {isLayerVisible('water-quality') && cityWaterQuality.map(wq => {
            const { x, y } = cityCoordToSVG(wq.coordinates[1], wq.coordinates[0], bounds)
            const entity = makeEntity(wq, 'water-quality', wq.name, wq)
            const isSelected = selectedEntity?.id === entity.id
            return (
              <Tooltip key={wq.id}>
                <TooltipTrigger asChild>
                  <g className="cursor-pointer" onClick={(e) => handleEntityClick(entity, e)}>
                    <circle cx={x} cy={y} r={isSelected ? 22 : 20} fill="white" fillOpacity="0.9" stroke={isSelected ? '#10b981' : '#94a3b8'} strokeWidth={isSelected ? 2.5 : 1} />
                    <foreignObject x={x - 12} y={y - 12} width="24" height="24" style={{ pointerEvents: 'none' }}>
                      <div className="flex items-center justify-center w-full h-full">
                        <Droplets className="w-5 h-5 text-emerald-600" />
                      </div>
                    </foreignObject>
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{wq.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{wq.rating} quality</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </svg>

      {/* Empty state — shown when active layer has no entities in this city */}
      {activeCount === 0 && activeLayer && showCityMap && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-xl px-6 py-4 shadow-lg text-center max-w-xs">
            <p className="text-sm font-medium text-foreground mb-1">Sin datos disponibles</p>
            <p className="text-xs text-muted-foreground">
              No hay registros de <span className="font-medium">{activeLayer.name}</span> para {CITY_NAMES[selectedCity]}
            </p>
          </div>
        </div>
      )}
      </>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg"
      style={{ backgroundColor: 'oklch(0.98 0.01 220)' }}
      onClick={() => onSelectEntity(null)}
    >
      {/* Loading spinner — shown while GeoJSON is fetching */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/40 backdrop-blur-sm">
          <div className="w-9 h-9 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Back button — top-left, only in city view */}
      {selectedCity && (
        <button
          onClick={(e) => { e.stopPropagation(); handleBackToFullMap() }}
          disabled={isTransitioning}
          className={`absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 border border-gray-200 cursor-pointer text-sm font-medium text-gray-700 ${
            showCityMap ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          {CITY_NAMES[selectedCity] ?? selectedCity}
        </button>
      )}

      {/* City name header — centered, only in city view */}
      {selectedCity && (
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 transition-all duration-300 pointer-events-none ${
            showCityMap ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full px-5 py-1.5 shadow-sm">
            <span className="text-sm font-semibold tracking-wide">{CITY_NAMES[selectedCity]}</span>
          </div>
        </div>
      )}

      {/* Layer toggle panel — top-right, only in city view */}
      {selectedCity && (
        <div
          className={`absolute top-4 right-4 z-10 transition-all duration-300 ${
            showCityMap ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <LayerTogglePanel
            layers={layers}
            onSelect={(id) => onSelectLayer?.(id)}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            counts={cityCounts}
          />
        </div>
      )}

      {/* ── Full overview SVG ── */}
      {!showCityMap && (
        <svg
          viewBox={getZoomedViewBox(zoom)}
          className={`absolute inset-0 w-full h-full transition-all duration-[600ms] ease-in-out ${
            isTransitioning && selectedCity ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0.5)" />
            </linearGradient>
            <pattern id="oceanTexture" patternUnits="userSpaceOnUse" width="30" height="20">
              <path d="M0 10 Q7.5 5 15 10 T30 10" stroke="oklch(0.75 0.08 160)" strokeWidth="0.5" fill="none" opacity="0.3"/>
            </pattern>
            <linearGradient id="leftEdgeShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>

          {/* Ocean */}
          <rect x="0" y="0" width="800" height="730" fill="url(#oceanGradient)" />
          <rect x="0" y="0" width="800" height="730" fill="url(#oceanTexture)" style={{ pointerEvents: 'none' }} />

          {/* ── Main land masses ── */}
          <path d={geoJSONToSVGPath([[-114.17533361632154,28.06335353159311],[-112.7671466591597,28.02596827692959],[-112.91688356083863,28.416107910664337],[-113.13491529854316,28.42987584814297],[-113.34116784387912,28.749458234601818],[-113.58303801992297,28.833902800512632],[-113.59413948739733,29.257346202631027],[-114.70510178420402,30.055580982331477],[-114.7605161175321,30.752941528286925],[-114.88574263787204,31.03487933958648],[-114.74932168941793,31.67663067094577],[-114.15083703581972,31.51591017220379],[-113.86752366529093,31.643277037103616],[-113.6548261643246,31.47208284785839],[-113.69121775771289,31.31144011539483],[-113.00589259265449,31.13974294426525],[-113.18823360436143,30.869843990536154],[-112.17053946174188,29.100166001176817],[-111.16392302736232,27.951045308788323],[-110.63479320805321,27.80781354202827],[-110.51502522240479,27.31160788205321],[-109.95411639707406,27.108788786725725],[-109.9393974112699,26.76343651273575],[-109.47970852737727,26.762309545611643],[-109.23731782217693,26.287674425117345],[-108.38890687926705,26.956018702268437],[-109.0864605539205,28.212762746100353],[-108.46257846635247,28.267519398164794],[-108.6491724750184,30.409062210621286],[-108.99480766818711,30.869017195224203],[-108.80272655456669,31.281631751974317],[-109.06628280922318,31.35076756504334],[-109.07359506415774,36.98666676426906],[-114.12016633061533,37.03105593804095],[-114.11506662268555,38.41315429917799],[-122.437573711333,37.77812884389593],[-122.40421048379413,37.249162177311916],[-121.89015800051855,36.99346986115336],[-121.78957532166582,36.733027595536186],[-122.08216675075107,36.75273648817917],[-120.6710627354761,35.148279474467984],[-120.65727141431107,34.5911344706539],[-119.34167500049897,34.32181377650339],[-119.20185610751433,34.09124695969473],[-118.48079148284101,34.09060465203005],[-118.42804452161347,33.72173663546967],[-117.65863810820143,33.48673164841607],[-117.20790242744062,32.654465089515284],[-117.16094521155084,32.28652493749526],[-116.62742562439168,31.84153022269615],[-116.79496626144446,31.637865381927256],[-115.75702549684105,30.046082471433508],[-115.71075366449962,29.766549088023552],[-114.13168968604582,28.62770383644326],[-114.17533361632154,28.06335353159311]])} fill="#edfcff" />

          <path d={geoJSONToSVGPath([[-114.20346346582606,28.017455687107955],[-112.76884050778419,27.97841516961759],[-112.86228104924975,28.41258060173223],[-113.07870568283762,28.473734135703523],[-113.34027891183244,28.772983865055892],[-113.58130950846744,28.880871976917874],[-113.59228206424724,29.304130890288405],[-114.7034404175602,30.101947912860595],[-114.73240009515153,30.775030514988586],[-114.88207746966846,31.127148477211506],[-114.75136159046393,31.630539889627485],[-114.87743961108912,31.888566594432902],[-115.03024474487653,32.17011296827462],[-114.82333819281716,32.46354432704986],[-114.46885580656918,32.867904390466975],[-114.67951649450463,33.105687798920115],[-114.54450110214525,33.518065421008984],[-114.51713518105994,33.9809889749247],[-114.18752028452859,34.250242957624195],[-114.70620203451527,35.0575018086887],[-118.53592077110791,38.091719163518945],[-122.37803977594494,37.778955278751454],[-122.37036673081879,37.1778209392789],[-121.79887264662221,36.92317027536086],[-121.75933223070614,36.70967859356594],[-121.99098698398097,36.68277372456198],[-121.43837568295712,35.98157573695245],[-120.6710627354761,35.148279474467984],[-120.60072910786654,34.56853755976857],[-119.25874882711044,34.460646347318914],[-119.17400160140075,34.04515994579677],[-118.28660292617882,34.089860847082704],[-118.40044086873782,33.721632373040094],[-117.68619684426679,33.48697798265253],[-117.20404076213252,32.83814055334483],[-117.13277906292437,32.33203631200013],[-116.65456493310045,31.842038469316506],[-116.7137657332185,31.636390708911662],[-116.24228557589849,31.02858503257039],[-115.72894264540427,30.091535602817345],[-115.65657973968244,29.788036855964563],[-114.13242890351613,28.6042004731858],[-114.20346346582606,28.017455687107955]])} fill="#c8e1f0" />

          {/* Green inland areas */}
          <g fill="#b5e0cf">
            <path d={geoJSONToSVGPath([[-117.12415859824307,32.535514692720085],[-117.03010623641671,32.286454427860704],[-116.90333433154572,32.24131837582263],[-116.83661227635034,32.01530187911128],[-116.59977470706916,31.901791659178286],[-116.72660744297164,31.58103569218177],[-115.76204418844235,30.131481259845117],[-115.56673583598855,29.98925419779647],[-115.44450672262188,30.10558259417519],[-115.1897454960404,29.943568067521298],[-114.96893840743978,29.987725080684513],[-115.09248409671899,30.606882950481562],[-115.16988122058652,30.70675271121921],[-115.26662762542105,31.022324656260878],[-115.4214218731561,31.13004461313112],[-115.4407711541231,31.336854778477843],[-115.27630226590432,31.303795585346407],[-115.28597690638804,31.658572400365614],[-115.4601204350901,31.89707907761249],[-115.69231180669269,31.946348421538687],[-115.7890582115272,32.24959172950045],[-115.83743141394446,32.470240715643584],[-115.98255102119624,32.63333675851129],[-117.12415859824307,32.535514692720085]])} />
            <path d={geoJSONToSVGPath([[-114.18611647612968,28.078602862025377],[-112.77777580052873,28.02430155022232],[-112.85297845796396,28.41585977456384],[-113.03756679894059,28.439908681587497],[-113.35888724434484,28.782010294258257],[-113.58449521664987,28.823945834143785],[-113.60500503231391,29.25430008415502],[-114.17244326568688,29.670971649312023],[-114.58947618419009,29.593719337615028],[-114.14509684480163,29.25430008415502],[-114.13142363435882,28.63210292147869],[-114.18611647612968,28.078602862025377]])} />
            <path d={geoJSONToSVGPath([[-114.90366464489294,31.151654067695944],[-114.7499290144632,31.671544778107318],[-114.27223531916431,31.55987533554881],[-114.3565342065702,31.862665955001773],[-114.6000643257416,31.87062076509521],[-114.87836461829707,32.142372486200756],[-114.63379769453638,32.36346680663473],[-114.54946427254986,32.74021638591584],[-115.28316504383234,32.71183767426615],[-115.38436515021586,32.47025442246702],[-115.17353159524994,31.88494355770483],[-115.06389814666753,31.741615509298967],[-115.10606485766078,31.519018225212875],[-114.90366464489294,31.151654067695944]])} />
            <path d={geoJSONToSVGPath([[-121.66761309116265,37.82834101158686],[-121.78745493066958,37.84878247116603],[-122.34383033941518,37.80783028771168],[-121.9764631930799,37.46387764444941],[-122.15638210109373,37.406397879179806],[-122.53681952146542,37.661607948003876],[-122.40337791172976,37.13554944744996],[-121.9339756717502,36.95109287623549],[-121.88858241677855,36.79485126699903],[-122.09703755197111,36.68405701686194],[-120.61910128696252,35.19143418158389],[-120.60912575495615,34.558829231853494],[-119.40327040686924,34.32952310731453],[-119.14692646590919,34.03799068387525],[-118.323334106728,34.100517846600255],[-118.57708204861893,34.45772101032374],[-118.78596348484254,34.789249247967376],[-118.99650034640837,35.094886078873],[-119.6601401682849,35.59929861451049],[-120.07554722261423,36.00475821038319],[-120.62109834324602,36.577375559356796],[-121.66761309116265,37.82834101158686]])} />
            <path d={geoJSONToSVGPath([[-114.60131209571165,32.76564758572604],[-114.44914551558489,32.84880052389255],[-114.71572747611583,33.108042395538405],[-114.52548905168072,33.53025169409936],[-114.53609688967111,34.02414963124369],[-114.15725447066569,34.28637079459065],[-114.69270747691706,35.052125715406305],[-118.56136713600998,38.10443685616647],[-120.36212363474192,37.94080211485746],[-118.88407297739809,36.58729526018749],[-118.54539462352551,35.11231781894993],[-118.15968617440615,34.95135617589641],[-117.88516194718636,35.01259900627183],[-117.74476107056256,34.90241275116365],[-117.80910687015066,34.70446930238043],[-116.90975967671665,33.970872508945476],[-116.43479628110802,33.93230644524721],[-115.96033714672654,33.595570095677814],[-115.48853707980041,33.38308716656441],[-115.39020499688996,32.67349909530448],[-114.60131209571165,32.76564758572604]])} />
            <path d={geoJSONToSVGPath([[-117.42650273935223,33.28375273994487],[-117.19725220045503,32.89962281475674],[-117.19725220045503,32.55842042957357],[-116.06863416280683,32.61290245836017],[-115.9745826596693,32.978555442363046],[-116.18619854172832,33.12144108838443],[-115.88053115653202,33.14605310019083],[-116.05687772491463,33.32305567379581],[-116.58591743006215,33.86166990788462],[-117.04441850785688,33.92022404590848],[-117.37947698778362,33.627051890567614],[-117.42650273935223,33.28375273994487]])} />
          </g>

          {/* ── Clickable city shapes ── */}
          <TooltipProvider delayDuration={300}>
          <g fillRule="nonzero">
            {/* Tijuana — drillable */}
            <Tooltip>
            <TooltipTrigger asChild>
            <path
              d={geoJSONToSVGPath([[-117.11071903189584,32.549851835614774],[-117.12276449114015,32.488910756226446],[-117.08662811340753,32.39233625748811],[-117.03844627643063,32.275291978662565],[-116.92401441361022,32.254921008940656],[-116.88787803587763,32.14279899796445],[-116.50242334006211,32.285475748650285],[-116.61083247326022,32.346554348200016],[-116.6210235744971,32.39652299304902],[-116.5746960955274,32.483742010665694],[-116.73862409803561,32.567873346138484],[-117.11071903189584,32.549851835614774]])}
              fill="#edfcff" stroke="#edfcff" strokeWidth="1.5"
              className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300"
              onClick={() => handleCityClick('tijuana')}
            />
            </TooltipTrigger>
            <TooltipContent side="top"><p className="font-medium">Tijuana</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent>
            </Tooltip>

            {/* Tecate — drillable */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-116.3693311679791,32.59739773213356],[-116.43087472189936,32.541827993922126],[-116.43966665817351,32.47880735869357],[-116.2110763150416,32.46768148526604],[-115.99567387632113,32.541827993922126],[-116.00886178073256,32.61591332574508],[-116.3693311679791,32.59739773213356]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" onClick={() => handleCityClick('tecate')} />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">Tecate</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent></Tooltip>

            {/* Mexicali — drillable */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-115.67722138705811,32.64581153463858],[-115.65129454649623,32.57483280358643],[-115.57999573495194,32.53841164110976],[-115.48277008284617,32.542054422473456],[-115.40931070125504,32.47828442061487],[-115.20621711685648,32.54933954185127],[-115.19325369657574,32.61851868044313],[-115.34881473994506,32.656726345080855],[-115.3617781602258,32.67491473462563],[-115.67722138705811,32.64581153463858]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" onClick={() => handleCityClick('mexicali')} />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">Mexicali</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent></Tooltip>

            {/* San Luis — drillable */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-114.71724326196758,32.72426095758392],[-114.77734011464986,32.6197124150642],[-114.81740468310485,32.61633784513798],[-114.79336594203194,32.58258515142127],[-114.8142955426648,32.5682308218218],[-114.81255731085764,32.558952663588855],[-114.79401617158237,32.560906039795796],[-114.80676320483428,32.54576626199825],[-114.80096909881048,32.53746271904153],[-114.81139848965334,32.528669895488875],[-114.80908084724382,32.5179219423307],[-114.80212792001524,32.514990459267665],[-114.80618379423191,32.509127206315455],[-114.81603377447193,32.508638584640934],[-114.81371613206241,32.50033160989017],[-114.9302659737181,32.48105021228355],[-114.96848129728615,32.388896630818266],[-114.96302196534769,32.32433311513614],[-115.05583060829865,32.25972353073054],[-115.00669662085421,32.204307257407464],[-114.82380900092154,32.46032386970842],[-114.58086872966804,32.74087434797593],[-114.71724326196758,32.72426095758392]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" onClick={() => handleCityClick('san-luis')} />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">San Luis</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent></Tooltip>

            {/* Ensenada — drillable */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-116.72623545198061,31.95322346876017],[-116.59688038572898,31.86279235148757],[-116.66536247962702,31.552069509863458],[-116.26207903778396,31.344343822870698],[-116.20120606543037,31.6039289008979],[-116.20881518697445,31.882177928248126],[-116.54361653491983,32.08870334373789],[-116.72623545198061,31.95322346876017]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" onClick={() => handleCityClick('ensenada')} />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">Ensenada</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent></Tooltip>

            {/* San Diego — drillable */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-117.12277702197949,32.56207068050169],[-117.00724261912109,32.536100678268994],[-116.83008986807106,32.756605943987395],[-116.95332656445359,33.12505366788156],[-117.19979995721866,33.401987128913106],[-117.40005958884072,33.19598065979953],[-117.25371601188614,32.90546255219587],[-117.27682289245782,32.847244033982406],[-117.23060913131448,32.70477128029685],[-117.13818160902738,32.70477128029685],[-117.12277702197949,32.56207068050169]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" onClick={() => handleCityClick('san-diego')} />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">San Diego</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent></Tooltip>

            {/* Imperial Valley — no drill-down */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-115.72438037305193,32.66024350986979],[-115.2630668242669,32.678626147341376],[-115.29582281589653,32.85307239633276],[-115.28490415202016,32.9241298657562],[-115.3067414797729,32.981392747788774],[-115.38317212690905,33.150673228220995],[-115.45960277404517,33.21235659025761],[-115.49235876567481,33.25801996180601],[-115.5742487447494,33.214640325132805],[-115.74894736677442,32.8920464522937],[-115.72438037305193,32.66024350986979]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">Imperial Valley</p></TooltipContent></Tooltip>

            {/* Los Angeles — drillable */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-117.58964411406168,33.3992734587805],[-117.54626269606894,33.679502709013434],[-117.73063372253827,33.77872025220418],[-117.60591214580894,33.87782300245155],[-117.48661324632863,33.78773433911074],[-117.16667528863172,34.09364794191484],[-117.41069576484135,34.23722639313283],[-117.5950667913107,34.14751847592359],[-118.14275719347,34.2282598963002],[-118.4410044421704,34.32683882514523],[-118.58741672789623,34.28204455214775],[-118.67960224113105,34.16546769251367],[-118.37593231518137,34.10262874732979],[-118.50607656915969,34.02176720233993],[-118.39762302417765,33.850806373435574],[-118.41389105592515,33.76970521659368],[-118.26747877019932,33.706573414011146],[-118.25663341570105,33.75618088462953],[-118.11022112997549,33.747163477802104],[-117.96380884424966,33.63888066620193],[-117.83908726752033,33.58017053777982],[-117.76316978603278,33.51237842099411],[-117.71436569079101,33.462630414586116],[-117.58964411406168,33.3992734587805]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" onClick={() => handleCityClick('los-angeles')} />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">Los Angeles</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent></Tooltip>

            {/* Bakersfield — drillable */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-119.01070655316693,35.17541672240576],[-118.9490703659567,35.31481337384302],[-118.86609857548122,35.361225645797305],[-118.74282620106072,35.477139635264294],[-118.8613573303115,35.52345851549073],[-118.99174157248677,35.453970180937006],[-119.0818252307175,35.496442414591954],[-119.25488067942327,35.44045158386085],[-119.23354507615801,35.32641894080835],[-119.10079021139722,35.27998668036129],[-119.01070655316693,35.17541672240576]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" onClick={() => handleCityClick('bakersfield')} />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">Bakersfield</p><p className="text-xs text-muted-foreground">Haz clic para explorar</p></TooltipContent></Tooltip>

            {/* San Jose — no drill-down */}
            <Tooltip><TooltipTrigger asChild>
            <path d={geoJSONToSVGPath([[-122.29543781638078,37.458955931320915],[-121.92746667774564,37.16629447902261],[-121.68687016402293,37.143734894336944],[-121.45335001835076,37.26772928009292],[-121.81424478893501,37.82876745550438],[-122.25297960807688,37.80081591710356],[-121.98407762215132,37.4533385756433],[-122.06899403875914,37.41400527361813],[-122.36620149688753,37.610464970825205],[-122.29543781638078,37.458955931320915]])} fill="#edfcff" stroke="#edfcff" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] cursor-pointer transition-all duration-300" />
            </TooltipTrigger><TooltipContent side="top"><p className="font-medium">San Jose</p></TooltipContent></Tooltip>
          </g>
          </TooltipProvider>

          {/* ── City label dots ── */}
          <g fill="#edfcff" stroke="black" strokeWidth="1.5">
            {[
              { lat: 32.63999314440635, lng: -115.47908841624707, label: 'Mexicali' },
              { lat: 32.5667092943212,   lng: -116.2324118203895,  label: 'Tecate' },
              { lat: 32.53386438508963,  lng: -117.02061807383475, label: 'Tijuana' },
              { lat: 31.87062509556867,  lng: -116.6059016809374,  label: 'Ensenada' },
              { lat: 32.719915996083316, lng: -117.16458880708407, label: 'San Diego' },
              { lat: 32.49,              lng: -114.78,             label: 'San Luis' },
              { lat: 34.07293537861122,  lng: -118.23740844512099, label: 'Los Angeles' },
              { lat: 35.38462772701179,  lng: -119.02279870936317, label: 'Bakersfield' },
              { lat: 37.33770965963264,  lng: -121.90734936437048, label: 'San Jose' },
            ].map(({ lat, lng, label }) => {
              const { x, y } = projectToSVG(lat, lng)
              return (
                <g key={label}>
                  <circle cx={x} cy={y} r={4} />
                  <text x={x + 8} y={y + 4} fontSize="11" fill="#6b7280" fontFamily="var(--font-geist-sans, sans-serif)" fontWeight="400" style={{ pointerEvents: 'none' }}>{label}</text>
                </g>
              )
            })}
          </g>

          {/* Brawley — drillable dot (no polygon shape) */}
          {(() => {
            const { x, y } = projectToSVG(32.98, -115.53)
            return (
              <g className="cursor-pointer" onClick={() => handleCityClick('brawley')}>
                <circle cx={x} cy={y} r={10} fill="transparent" />
                <circle cx={x} cy={y} r={4} fill="#edfcff" stroke="black" strokeWidth="1.5" className="hover:fill-amber-50 hover:stroke-[#f59e0b] transition-all duration-300" />
                <text x={x + 8} y={y + 4} fontSize="11" fill="#6b7280" fontFamily="var(--font-geist-sans, sans-serif)" fontWeight="400" style={{ pointerEvents: 'none' }}>Brawley</text>
              </g>
            )
          })()}

          {/* Clip overflows */}
          <rect x="740" y="0" width="120" height="730" fill="#EDFBFF" style={{ pointerEvents: 'none' }} />
          <rect x="480" y="0" width="320" height="80" fill="#EDFBFF" style={{ pointerEvents: 'none' }} />
          <rect x="0" y="0" width="10" height="730" fill="url(#leftEdgeShadow)" style={{ pointerEvents: 'none' }} />
        </svg>
      )}

      {/* ── City drill-down SVG ── */}
      {selectedCity && cityGeoJSON && renderCityMap()}
    </div>
  )
}
