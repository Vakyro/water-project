"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { cities, cityProfiles } from '@/src/data/cities'

const data = cities.map(city => {
  const profile = cityProfiles[city.slug]
  return {
    name: city.name.length > 10 ? city.name.substring(0, 10) + '...' : city.name,
    pH: profile?.waterQuality.avgPh || 7,
    salinity: profile?.waterQuality.avgSalinity || 0,
  }
}).filter(d => d.salinity > 0)

export function WaterQualityChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="pH" fill="hsl(var(--chart-2))" name="pH Level" />
        <Bar dataKey="salinity" fill="hsl(var(--chart-1))" name="Salinity (ppt)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
