'use client'

import { useMemo } from 'react'
import { useTopCompaniesOverall } from '@/hooks/useAnalyticsData'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const chartConfig = {
  max_ctc: {
    label: 'Max CTC',
    color: '#a78bfa',
  },
}

export function TopCompaniesChart() {
  const { data, loading, error } = useTopCompaniesOverall()

  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      displayName: truncateName(item.company_name, 15)
    }))
  }, [data])

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-destructive">
        <p>Error loading chart</p>
      </div>
    )
  }

  if (!chartData.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis
          dataKey="displayName"
          angle={-45}
          textAnchor="end"
          height={80}
          stroke="#999"
        />
        <YAxis stroke="#999" />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload?.[0]?.payload) {
              return (
                <div className="bg-background border border-border rounded px-2 py-1 text-xs">
                  <p className="font-semibold">{payload[0].payload.company_name}</p>
                  <p>₹{(payload[0].value as number).toFixed(2)} LPA</p>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="max_ctc"
          fill="#a78bfa"
          isAnimationActive
        />
      </BarChart>
    </ChartContainer>
  )
}

function truncateName(name: string, length: number): string {
  return name.length > length ? name.substring(0, length) + '...' : name
}
