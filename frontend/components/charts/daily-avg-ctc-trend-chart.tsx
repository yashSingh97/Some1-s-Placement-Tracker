'use client'

import { useMemo } from 'react'
import { useDailyAvgCtcTrend } from '@/hooks/useAnalyticsData'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const chartConfig = {
  avg_ctc: {
    label: 'Average CTC',
    color: '#34d399',
  },
}

export function DailyAvgCtcTrendChart() {
  const { data, loading, error } = useDailyAvgCtcTrend()

  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
      <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#999" />
        <YAxis stroke="#999" />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(value) => `₹${(value as number).toFixed(2)} LPA`} />}
        />
        <Area
          type="monotone"
          dataKey="avg_ctc"
          fill="#34d399"
          stroke="#34d399"
          strokeWidth={2}
          isAnimationActive
        />
      </AreaChart>
    </ChartContainer>
  )
}
