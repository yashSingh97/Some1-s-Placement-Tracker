import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Snapshot
export function useSnapshot() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_snapshot')
          .select('*')
          .limit(1)

        if (err) throw err
        setData(rows?.[0] || null)
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch snapshot'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Drives Over Time
export function useDrivesOverTime() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_drives_over_time')
          .select('date, week_label, drives')
          .order('date', { ascending: true })

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch drives over time'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Drives by Course by Week
export function useDrivesByCourseBWeek() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_drives_by_course_by_week')
          .select('week_label, course, drives')

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch drives by course by week'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Weekly Summary
export function useWeeklySummary() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_weekly_summary')
          .select('week_label, unique_companies, courses_active, avg_ctc, max_ctc, top_companies')

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch weekly summary'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// CTC Range by Course
export function useCtcRangeByCourse() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_ctc_range_by_course')
          .select('course, min_ctc, avg_ctc, max_ctc, company_count')
          .order('avg_ctc', { ascending: false })

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch CTC range'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// CTC Distribution
export function useCtcDistribution() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_ctc_distribution')
          .select('course, bucket, bucket_order, count')
          .order('bucket_order', { ascending: true })

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch CTC distribution'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Top Companies Overall
export function useTopCompaniesOverall() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_top_companies_overall')
          .select('rank, company_name, max_ctc, courses')
          .order('rank', { ascending: true })
          .limit(10)

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch top companies'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Top Companies by Course
export function useTopCompaniesByCourse() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_top_companies_by_course')
          .select('course, rank, company_name, max_ctc')

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch top companies by course'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Course Summary
export function useCourseSummary() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_course_summary')
          .select('course, unique_companies, avg_ctc, max_ctc')
          .order('unique_companies', { ascending: false })

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch course summary'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Placement Drives (All Companies)
export function usePlacementDrives() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('placement_drives')
          .select('company_name, ctc_lpa, bond, job_location, date_of_visit')
          .order('date_of_visit', { ascending: true })
          .order('company_name', { ascending: true })

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch placement drives'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}

// Daily Average CTC
export function useDailyAvgCtc() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data: rows, error: err } = await supabase
          .from('v2_daily_avg_ctc')
          .select('date, week_label, avg_ctc, max_ctc')
          .order('date', { ascending: true })

        if (err) throw err
        setData(rows || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch daily avg CTC'))
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}
