'use client'

import { useMemo } from 'react'
import { useDrivesByCourse } from '@/hooks/useAnalyticsData'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const chartConfig = {
  drives: {
    label: 'Drives',
    color: '#60a5fa',
  },
}

export function DrivesByCourseChart() {
  const { data, loading, error } = useDrivesByCourse()

  const chartData = useMemo(() => {
    return data.sort((a, b) => b.drives - a.drives)
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="drives"
          fill="#60a5fa"
          isAnimationActive
        />
      </BarChart>
    </ChartContainer>
  )
}
