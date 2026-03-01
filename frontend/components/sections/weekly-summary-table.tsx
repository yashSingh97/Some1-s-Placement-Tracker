'use client'

import { useWeeklySummary } from '@/hooks/useV2Data'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function WeeklySummaryTable() {
  const { data, loading, error } = useWeeklySummary()

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-lg" />
  }

  if (error || !data.length) {
    return <div className="text-destructive text-sm">Failed to load weekly summary</div>
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead>Unique Companies</TableHead>
              <TableHead>Courses Active</TableHead>
              <TableHead>Avg CTC (LPA)</TableHead>
              <TableHead>Highest CTC (LPA)</TableHead>
              <TableHead>Top Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{row.week_label}</TableCell>
                <TableCell>{row.unique_companies}</TableCell>
                <TableCell>{row.courses_active}</TableCell>
                <TableCell>{row.avg_ctc?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell>{row.max_ctc?.toFixed(2) || 'N/A'}</TableCell>
                <TableCell className="text-sm text-muted-foreground truncate max-w-xs">
                  {row.top_companies || 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
