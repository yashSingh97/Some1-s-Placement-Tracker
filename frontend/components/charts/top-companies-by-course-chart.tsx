'use client'

import { useMemo, useState } from 'react'
import { useTopCompaniesByCourse } from '@/hooks/useAnalyticsData'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const chartConfig = {
  max_ctc: {
    label: 'Max CTC',
    color: '#fbbf24',
  },
}

export function TopCompaniesByCourseChart() {
  const { data, loading, error } = useTopCompaniesByCourse()
  const [selectedCourse, setSelectedCourse] = useState<string>('')

  const courses = useMemo(() => {
    const uniqueCourses = Array.from(new Set(data.map(item => item.course))).sort()
    if (uniqueCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(uniqueCourses[0])
    }
    return uniqueCourses
  }, [data, selectedCourse])

  const chartData = useMemo(() => {
    return data
      .filter(item => item.course === selectedCourse)
      .map(item => ({
        ...item,
        displayName: truncateName(item.company_name, 15)
      }))
      .sort((a, b) => b.max_ctc - a.max_ctc)
  }, [data, selectedCourse])

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="w-32 h-10 rounded" />
        <Skeleton className="w-full h-64 rounded-lg" />
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

  if (!courses.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {courses.map(course => (
            <SelectItem key={course} value={course}>
              {course}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {chartData.length === 0 ? (
        <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
          <p>No data for selected course</p>
        </div>
      ) : (
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
              fill="#fbbf24"
              isAnimationActive
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}

function truncateName(name: string, length: number): string {
  return name.length > length ? name.substring(0, length) + '...' : name
}
