'use client'

import { useMemo, useState } from 'react'
import { useTopCompaniesOverall, useTopCompaniesByCourse, useCourseSummary } from '@/hooks/useV2Data'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { CHART_COLORS } from '@/lib/chart-colors'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function CompanyIntelligenceSection() {
  const { data: topCompaniesData, loading: topCompaniesLoading } = useTopCompaniesOverall()
  const { data: topCompaniesCourseData, loading: topCompaniesCourseLoading } = useTopCompaniesByCourse()
  const { data: courseSummaryData, loading: courseSummaryLoading } = useCourseSummary()
  const [selectedCourse, setSelectedCourse] = useState<string>('')

  // Get unique courses
  const courses = useMemo(
    () => [...new Set(topCompaniesCourseData.map(item => item.course))],
    [topCompaniesCourseData]
  )

  // Set default course on first load
  useMemo(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0])
    }
  }, [courses])

  // Filter top companies by selected course
  const filteredCompaniesByC = useMemo(() => {
    if (!selectedCourse) return []
    return topCompaniesCourseData
      .filter(item => item.course === selectedCourse)
      .sort((a, b) => a.rank - b.rank)
  }, [topCompaniesCourseData, selectedCourse])

  if (topCompaniesLoading || topCompaniesCourseLoading || courseSummaryLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />
  }

  return (
    <div className="space-y-4">
      {/* Chart 1: Top Paying Companies */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-white">Top Paying Companies</h3>
        <ChartContainer config={{}} className="h-80 w-full">
          <BarChart
            data={topCompaniesData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 250, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis type="number" stroke="#999" />
            <YAxis dataKey="company_name" type="category" stroke="#999" width={250} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} LPA`} />} />
            <Bar dataKey="max_ctc" fill={CHART_COLORS[0]} isAnimationActive />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Chart 2: Top Companies by Course */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Top Paying Companies by Course</h3>
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
        </div>
        <ChartContainer config={{}} className="h-64 w-full">
          <BarChart data={filteredCompaniesByC}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="company_name" angle={-45} textAnchor="end" height={100} stroke="#999" />
            <YAxis stroke="#999" />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} LPA`} />} />
            <Bar dataKey="max_ctc" fill={CHART_COLORS[1]} isAnimationActive />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Table 3: Course Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-white">Course Summary</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Unique Companies</TableHead>
                <TableHead>Avg CTC (LPA)</TableHead>
                <TableHead>Max CTC (LPA)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseSummaryData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.course}</TableCell>
                  <TableCell>{row.unique_companies}</TableCell>
                  <TableCell>{row.avg_ctc?.toFixed(2) || 'N/A'}</TableCell>
                  <TableCell>{row.max_ctc?.toFixed(2) || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
