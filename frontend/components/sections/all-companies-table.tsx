'use client'

import { useMemo, useState } from 'react'
import { usePlacementDrives } from '@/hooks/useV2Data'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'

export function AllCompaniesTable() {
  const { data, loading, error } = usePlacementDrives()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and format data
  const filteredData = useMemo(() => {
    return data
      .filter(row =>
        row.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(row => ({
        ...row,
        ctc_display: formatCtcDisplay(row.ctc_lpa),
      }))
  }, [data, searchQuery])

  // Sorted data (already sorted in hook by date ASC then company name ASC)
  const sortedData = useMemo(() => {
    return [...filteredData]
  }, [filteredData])

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-lg" />
  }

  if (error) {
    return <div className="text-destructive text-sm">Failed to load companies</div>
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <Input
        placeholder="Search by company name..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="mb-4 max-w-sm"
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Date of Visit</TableHead>
              <TableHead>CTC by Course</TableHead>
              <TableHead>Bond</TableHead>
              <TableHead>Job Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{row.company_name}</TableCell>
                <TableCell className="text-sm">
                  {row.date_of_visit
                    ? new Date(row.date_of_visit).toLocaleDateString('en-US', {
                        year: '2-digit',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {row.ctc_display}
                </TableCell>
                <TableCell>{row.bond || '-'}</TableCell>
                <TableCell className="text-sm">{row.job_location || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Showing {sortedData.length} of {data.length} companies
      </p>
    </div>
  )
}

function formatCtcDisplay(ctcLpa: any): string {
  if (!ctcLpa) return 'N/A'
  
  if (typeof ctcLpa === 'string') {
    try {
      ctcLpa = JSON.parse(ctcLpa)
    } catch {
      return ctcLpa
    }
  }

  if (typeof ctcLpa === 'object') {
    return Object.entries(ctcLpa)
      .map(([course, ctc]) => `${course}: ${ctc} LPA`)
      .join(', ')
  }

  return `${ctcLpa} LPA`
}
