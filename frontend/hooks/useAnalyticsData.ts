'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Type definitions for each view
export interface DrivesOverTime {
  date: string
  drives: number
}

export interface DrivesOverTimeByCourse {
  date: string
  course: string
  drives: number
}

export interface DrivesByCourse {
  course: string
  drives: number
}

export interface AvgCtcByCourse {
  course: string
  avg_ctc: number
}

export interface MaxCtcByCourse {
  course: string
  max_ctc: number
}

export interface TopCompaniesOverall {
  company_name: string
  max_ctc: number
}

export interface TopCompaniesByCourse {
  course: string
  company_name: string
  max_ctc: number
}

export interface RepeatRecruiters {
  company_slug: string
  drives: number
}

export interface DailyAvgCtcTrend {
  date: string
  avg_ctc: number
}

// Custom hook for data fetching with loading/error states
export function useDrivesOverTime() {
  const [data, setData] = useState<DrivesOverTime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_drives_over_time')
          .select('*')
          .order('date', { ascending: true })

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useDrivesOverTimeByCourse() {
  const [data, setData] = useState<DrivesOverTimeByCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_drives_over_time_by_course')
          .select('*')
          .order('date', { ascending: true })

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useDrivesByCourse() {
  const [data, setData] = useState<DrivesByCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_drives_by_course')
          .select('*')
          .order('drives', { ascending: false })

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useAvgCtcByCourse() {
  const [data, setData] = useState<AvgCtcByCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_avg_ctc_by_course')
          .select('*')

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useMaxCtcByCourse() {
  const [data, setData] = useState<MaxCtcByCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_max_ctc_by_course')
          .select('*')

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useTopCompaniesOverall() {
  const [data, setData] = useState<TopCompaniesOverall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_top_companies_overall')
          .select('*')

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useTopCompaniesByCourse() {
  const [data, setData] = useState<TopCompaniesByCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_top_companies_by_course')
          .select('*')

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useRepeatRecruiters() {
  const [data, setData] = useState<RepeatRecruiters[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_repeat_recruiters')
          .select('*')
          .order('drives', { ascending: false })

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useDailyAvgCtcTrend() {
  const [data, setData] = useState<DailyAvgCtcTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: result, error: err } = await supabase
          .from('analytics_daily_avg_ctc_trend')
          .select('*')
          .order('date', { ascending: true })

        if (err) throw err
        setData(result || [])
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// Global data refresh function
export async function refreshAllData() {
  // This function can be called to refresh all cached data
  // In the future, this can be triggered by:
  // - A cron job every 12 hours
  // - A manual admin trigger via API
  // - External event webhooks from Supabase
  
  console.log('Refreshing all analytics data')
  
  // Implementation note: Since we're using client-side hooks,
  // we would need to use a state management system (like Context or Zustand)
  // to invalidate all data at once. For now, components will re-fetch on next mount.
}
