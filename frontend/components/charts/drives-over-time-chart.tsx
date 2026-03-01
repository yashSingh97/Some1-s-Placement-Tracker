'use client'

import { useMemo, useState } from 'react'
import { useDrivesOverTimeByCourse } from '@/hooks/useAnalyticsData'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'

const COLORS = [
  '#fbbf24',
  '#60a5fa',
  '#34d399',
  '#f87171',
  '#a78bfa',
]

export function DrivesByCoursOverTimeChart() {
  const { data, loading, error } = useDrivesOverTimeByCourse()
  const [visibleCourses, setVisibleCourses] = useState<Set<string>>(new Set())

  const processedData = useMemo(() => {
    if (!data.length) return []

    // Group by date and create aggregated data
    const dateMap = new Map()
    const courses = new Set<string>()

    data.forEach(item => {
      courses.add(item.course)
      const dateStr = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, { date: dateStr })
      }

      dateMap.get(dateStr)[item.course] = item.drives
    })

    // Initialize all courses as visible on first load
    if (visibleCourses.size === 0) {
      setVisibleCourses(new Set(courses))
    }

    return Array.from(dateMap.values())
  }, [data, visibleCourses])

  const courseArray = useMemo(() => {
    const courses = new Set<string>()
    data.forEach(item => courses.add(item.course))
    return Array.from(courses).sort()
  }, [data])

  const handleLegendClick = (e: any) => {
    const course = e.dataKey
    const newVisibleCourses = new Set(visibleCourses)
    if (newVisibleCourses.has(course)) {
      newVisibleCourses.delete(course)
    } else {
      newVisibleCourses.add(course)
    }
    setVisibleCourses(newVisibleCourses)
  }

  if (loading) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-destructive">
        <p>Error loading chart</p>
      </div>
    )
  }

  if (!processedData.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    courseArray.forEach((course, idx) => {
      config[course] = {
        label: course,
        color: COLORS[idx % COLORS.length],
      }
    })
    return config
  }, [courseArray])

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <LineChart data={processedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#999" />
        <YAxis stroke="#999" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {courseArray.map((course, idx) =>
          visibleCourses.has(course) && (
            <Line
              key={course}
              type="monotone"
              dataKey={course}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          )
        )}
      </LineChart>
    </ChartContainer>
  )
}
