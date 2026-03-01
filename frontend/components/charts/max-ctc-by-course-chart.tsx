'use client'

import { useMemo } from 'react'
import { useMaxCtcByCourse } from '@/hooks/useAnalyticsData'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const chartConfig = {
  max_ctc: {
    label: 'Highest CTC',
    color: '#f87171',
  },
}

export function MaxCtcByCourseChart() {
  const { data, loading, error } = useMaxCtcByCourse()

  const chartData = useMemo(() => {
    return data.sort((a, b) => b.max_ctc - a.max_ctc)
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
          dataKey="course"
          angle={-45}
          textAnchor="end"
          height={80}
          stroke="#999"
        />
        <YAxis stroke="#999" />
        <ChartTooltip
          content={<ChartTooltipContent formatter={(value) => `₹${(value as number).toFixed(2)} LPA`} />}
        />
        <Bar
          dataKey="max_ctc"
          fill="#f87171"
          isAnimationActive
        />
      </BarChart>
    </ChartContainer>
  )
}
