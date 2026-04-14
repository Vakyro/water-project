'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ReportIssueDialog } from '@/components/verification/report-issue-dialog'
import { getWaterQualityById } from '@/src/data/water-quality'
import { getCityById } from '@/src/data/cities'
import { WATER_QUALITY_COLORS } from '@/src/core/constants'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Droplets,
  MapPin,
  Calendar,
  Flag,
  Activity,
  Thermometer,
  Wind,
  Gauge,
  FlaskConical,
} from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const ratingDescriptions: Record<string, string> = {
  excellent: 'This station shows excellent water quality across all measured parameters. Conditions are well within safe limits.',
  good: 'This station shows good water quality. Most parameters are within acceptable ranges with minor deviations.',
  fair: 'This station shows fair water quality with some parameters approaching concern thresholds. Monitoring recommended.',
  poor: 'This station shows poor water quality with multiple parameters exceeding safe limits. Caution advised.',
}

const parameterRanges = {
  ph: { min: 6.5, max: 8.5, unit: '', label: 'pH', icon: FlaskConical },
  dissolvedOxygen: { min: 6, max: 12, unit: 'mg/L', label: 'Dissolved O₂', icon: Wind },
  turbidity: { min: 0, max: 10, unit: 'NTU', label: 'Turbidity', icon: Activity },
  temperature: { min: 10, max: 25, unit: '°C', label: 'Temperature', icon: Thermometer },
  salinity: { min: 30, max: 37, unit: 'ppt', label: 'Salinity', icon: Droplets },
  conductivity: { min: 40000, max: 55000, unit: 'μS/cm', label: 'Conductivity', icon: Gauge },
}

function parameterStatus(key: keyof typeof parameterRanges, value: number) {
  const range = parameterRanges[key]
  if (value >= range.min && value <= range.max) return 'within'
  const margin = (range.max - range.min) * 0.15
  if (value >= range.min - margin && value <= range.max + margin) return 'marginal'
  return 'outside'
}

export default function WaterQualityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [reportOpen, setReportOpen] = useState(false)

  const point = getWaterQualityById(id)
  if (!point) notFound()

  const city = getCityById(point.cityId)

  const metrics = point.metrics

  const radarData = [
    {
      subject: 'pH',
      value: Math.round(((metrics.ph - 6) / (9 - 6)) * 100),
      fullMark: 100,
    },
    {
      subject: 'DO',
      value: Math.round((metrics.dissolvedOxygen / 12) * 100),
      fullMark: 100,
    },
    {
      subject: 'Clarity',
      value: Math.round(Math.max(0, (1 - metrics.turbidity / 30)) * 100),
      fullMark: 100,
    },
    {
      subject: 'Temp',
      value: Math.round(Math.max(0, (1 - Math.abs(metrics.temperature - 18) / 15)) * 100),
      fullMark: 100,
    },
    {
      subject: 'Salinity',
      value: Math.round((metrics.salinity / 40) * 100),
      fullMark: 100,
    },
  ]

  const barData = [
    { name: 'pH', value: metrics.ph, reference: 7.5 },
    { name: 'DO (mg/L)', value: metrics.dissolvedOxygen, reference: 7 },
    { name: 'Turbidity', value: metrics.turbidity, reference: 5 },
    { name: 'Temp (°C)', value: metrics.temperature, reference: 18 },
    { name: 'Salinity', value: metrics.salinity, reference: 35 },
  ]

  const paramEntries = (Object.keys(parameterRanges) as (keyof typeof parameterRanges)[]).map(key => ({
    key,
    ...parameterRanges[key],
    value: metrics[key as keyof typeof metrics] as number,
    status: parameterStatus(key, metrics[key as keyof typeof metrics] as number),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href={city ? `/app/contamination/${city.slug}` : '/app/water-analysis'}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          {city ? `Back to ${city.name}` : 'Back to Water Analysis'}
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={cn(WATER_QUALITY_COLORS[point.rating], 'text-white capitalize')}>
                {point.rating}
              </Badge>
              {city && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {city.name}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-balance">{point.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last updated: {point.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {point.coordinates[1].toFixed(4)}°N, {Math.abs(point.coordinates[0]).toFixed(4)}°W
              </span>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setReportOpen(true)}>
            <Flag className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </div>
      </div>

      {/* Rating interpretation */}
      <Card className={cn(
        'border-l-4',
        point.rating === 'excellent' ? 'border-l-teal-500' :
        point.rating === 'good' ? 'border-l-sky-500' :
        point.rating === 'fair' ? 'border-l-slate-400' : 'border-l-blue-600'
      )}>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">{ratingDescriptions[point.rating]}</p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {paramEntries.map(param => {
          const Icon = param.icon
          const statusColor =
            param.status === 'within' ? 'text-teal-600' :
            param.status === 'marginal' ? 'text-sky-600' : 'text-blue-700'
          return (
            <Card key={param.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Icon className="h-3.5 w-3.5" />
                  {param.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn('text-xl font-bold', statusColor)}>
                  {param.value}
                  {param.unit && <span className="text-sm font-normal ml-1">{param.unit}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{param.status}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quality Profile</CardTitle>
            <CardDescription>Normalized score across key parameters (0–100)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Measured vs Reference</CardTitle>
            <CardDescription>Measured value compared to regional reference baseline</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Measured" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="reference" name="Reference" fill="hsl(var(--muted-foreground) / 0.3)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Parameter Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Details</CardTitle>
          <CardDescription>Full parameter values with acceptable range reference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Parameter</th>
                  <th className="text-right py-2 pr-4 font-medium text-muted-foreground">Measured</th>
                  <th className="text-right py-2 pr-4 font-medium text-muted-foreground">Acceptable Range</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paramEntries.map(param => (
                  <tr key={param.key}>
                    <td className="py-3 pr-4 font-medium">{param.label}</td>
                    <td className="py-3 pr-4 text-right font-mono">
                      {param.value} {param.unit}
                    </td>
                    <td className="py-3 pr-4 text-right text-muted-foreground">
                      {param.min}–{param.max} {param.unit}
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize',
                          param.status === 'within' && 'border-teal-400 text-teal-700',
                          param.status === 'marginal' && 'border-sky-400 text-sky-700',
                          param.status === 'outside' && 'border-blue-500 text-blue-700',
                        )}
                      >
                        {param.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Related Links */}
      {city && (
        <Card>
          <CardHeader>
            <CardTitle>Related</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/app/contamination/${city.slug}`}>
                <MapPin className="mr-2 h-4 w-4" />
                {city.name} City Profile
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/app/water-analysis">
                <Droplets className="mr-2 h-4 w-4" />
                Water Analysis Overview
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/app/biochem/qmra">
                <FlaskConical className="mr-2 h-4 w-4" />
                QMRA Risk Explorer
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <ReportIssueDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        reportType="city_page"
        route={`/app/water-quality/${id}`}
      />
    </div>
  )
}
