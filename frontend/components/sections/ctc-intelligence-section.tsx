'use client'

import { useMemo, useState } from 'react'
import { useCtcRangeByCourse, useCtcDistribution, useWeeklySummary, useDailyAvgCtc } from '@/hooks/useV2Data'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CHART_COLORS } from '@/lib/chart-colors'
import { CHART_CONFIG } from '@/lib/chart-config'

export function CtcIntelligenceSection() {
  const { data: ctcRangeData, loading: ctcRangeLoading } = useCtcRangeByCourse()
  const { data: ctcDistData, loading: ctcDistLoading } = useCtcDistribution()
  const { data: weeklySummaryData, loading: weeklySummaryLoading } = useWeeklySummary()
  const { data: dailyAvgCtcData, loading: dailyAvgCtcLoading } = useDailyAvgCtc()
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL')
  const [trendMode, setTrendMode] = useState<'day' | 'week'>('week')

  // Get unique courses for dropdown (exclude ALL from data, filter duplicates, sort alphabetically)
  const courses = useMemo(() => {
    const uniqueCourses = [...new Set(ctcDistData.map(item => item.course))]
    return uniqueCourses
      .filter(course => course !== 'ALL')
      .sort((a, b) => a.localeCompare(b))
  }, [ctcDistData])

  // Filter CTC distribution by course
  const filteredDistData = useMemo(() => {
    if (selectedCourse === 'ALL') return ctcDistData.filter(item => item.course === 'ALL')
    return ctcDistData.filter(item => item.course === selectedCourse)
  }, [ctcDistData, selectedCourse])

  // Sort and transform CTC range data for horizontal grouped bar chart
  const transformedRangeData = useMemo(() => {
    return ctcRangeData
      .map(item => ({
        course: item.course,
        min_ctc: item.min_ctc,
        avg_ctc: item.avg_ctc,
        max_ctc: item.max_ctc,
      }))
      .sort((a, b) => a.course.localeCompare(b.course))
  }, [ctcRangeData])

  // Transform daily/weekly CTC data for area chart
  const trendData = useMemo(() => {
    if (trendMode === 'day') {
      return dailyAvgCtcData.map(item => ({
        label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        avg_ctc: item.avg_ctc,
      }))
    } else {
      return weeklySummaryData.map(item => ({
        label: item.week_label,
        avg_ctc: item.avg_ctc,
      }))
    }
  }, [dailyAvgCtcData, weeklySummaryData, trendMode])

  if (ctcRangeLoading || ctcDistLoading || weeklySummaryLoading || dailyAvgCtcLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />
  }

  return (
    <div className="space-y-4">
      {/* Chart 1: CTC Range by Course - Grouped Bar (Vertical) */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-white">CTC Range by Course</h3>
        <ChartContainer config={{}} className="h-96 w-full">
          <BarChart
            data={transformedRangeData}
            margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="course" 
              stroke="#999" 
              angle={-45} 
              textAnchor="end" 
              height={35}
            />
            
            <YAxis stroke="#999" />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border border-border rounded px-3 py-2 text-xs">
                      <p className="font-semibold text-white">{payload[0].payload.course}</p>
                      <p className="text-blue-400">Min: {payload[0].payload.min_ctc} LPA</p>
                      <p className="text-yellow-400">Avg: {payload[0].payload.avg_ctc} LPA</p>
                      <p className="text-emerald-400">Max: {payload[0].payload.max_ctc} LPA</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey="min_ctc" 
              fill={CHART_COLORS[1]} 
              name="Min" 
              isAnimationActive={false}
              label={{
                position: 'insideTop',
                fill: '#fff',
                fontSize: 11,
                fontWeight: 'bold',
                formatter: (value) => `${value}`
              }}
            />
            <Bar 
              dataKey="avg_ctc" 
              fill={CHART_COLORS[0]} 
              name="Avg" 
              isAnimationActive={false}
              label={{
                position: 'insideTop',
                fill: '#000',
                fontSize: 11,
                fontWeight: 'bold',
                formatter: (value) => `${value}`
              }}
            />
            <Bar 
              dataKey="max_ctc" 
              fill={CHART_COLORS[2]} 
              name="Max" 
              isAnimationActive={false}
              label={{
                position: 'insideTop',
                fill: '#000',
                fontSize: 11,
                fontWeight: 'bold',
                formatter: (value) => `${value}`
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Chart 2: CTC Distribution with Course Dropdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">CTC Distribution</h3>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              {courses.map(course => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ChartContainer config={{}} className="h-64 w-full">
          <BarChart data={filteredDistData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="bucket" stroke="#999" />
            <YAxis stroke="#999" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill={CHART_COLORS[1]} isAnimationActive />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Chart 3: Average CTC Trend (Day/Week toggle) */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Average CTC Trend</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTrendMode('day')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                trendMode === 'day'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTrendMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                trendMode === 'week'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Week
            </button>
          </div>
        </div>
        <ChartContainer config={{}} className="h-64 w-full" key={trendMode}>
          <AreaChart data={trendData} animationDuration={CHART_CONFIG.ANIMATION_DURATION}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="label" stroke="#999" />
            <YAxis stroke="#999" />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => `${value} LPA`} />}
            />
            <Area
              type="monotone"
              dataKey="avg_ctc"
              fill={CHART_COLORS[4]}
              stroke={CHART_COLORS[4]}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
