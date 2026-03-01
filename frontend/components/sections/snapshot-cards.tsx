'use client'

import { useSnapshot } from '@/hooks/useV2Data'
import { Skeleton } from '@/components/ui/skeleton'

export function SnapshotCards() {
  const { data, loading, error } = useSnapshot()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  if (error || !data) {
    return <div className="text-destructive text-sm">Failed to load snapshot data</div>
  }

  const cards = [
    {
      label: 'Total Unique Companies',
      value: data.total_unique_companies,
      subtitle: '',
    },
    {
      label: 'Courses Covered',
      value: data.courses_covered,
      subtitle: data.courses_covered_list || '',
    },
    {
      label: 'Highest CTC',
      value: `${data.highest_ctc} LPA`,
      subtitle: data.highest_ctc_companies || '',
    },
    {
      label: 'Average CTC',
      value: `${data.avg_ctc} LPA`,
      subtitle: '',
    },
    {
      label: 'Latest Drive',
      value: data.latest_drive_date,
      subtitle: data.latest_drive_companies || '',
    },
    {
      label: 'Most Active Week',
      value: data.most_active_week_label,
      subtitle: `${data.most_active_week_count} companies`,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-card border border-border rounded-lg p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {card.label}
          </p>
          <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground truncate">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  )
}
