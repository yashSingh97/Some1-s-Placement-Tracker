'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface FileItem {
  id: string
  name: string
  size: number
  path: string
  type: 'pdf' | 'xlsx' | 'docx' | 'other'
  createdAt: string
}

export interface DateFolder {
  date: string
  files: FileItem[]
  loading: boolean
}

export interface CompanyFolder {
  company: string
  dateMap: Map<string, DateFolder>
  loading: boolean
}

export function useDocumentTree(shouldFetch: boolean = true) {
  const [companies, setCompanies] = useState<Map<string, CompanyFolder>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!shouldFetch) return

    const fetchDocumentStructure = async () => {
      try {
        setLoading(true)

        // Recursively list all files in the placement-files bucket
        const allFiles: any[] = []
        const listFilesRecursively = async (path: string = '') => {
          const { data, error: err } = await supabase.storage
            .from('placement-files')
            .list(path, {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' },
            })

          if (err) throw err

          for (const item of data || []) {
            if (item.name.startsWith('.')) continue

            const fullPath = path ? `${path}/${item.name}` : item.name

            if (item.id === null) {
              // It's a folder, recurse
              await listFilesRecursively(fullPath)
            } else {
              // It's a file
              allFiles.push({
                name: item.name,
                path: fullPath,
                size: item.metadata?.size || 0,
                created_at: item.created_at,
              })
            }
          }
        }

        await listFilesRecursively()

        // Parse the file structure (company/date/filename pattern)
        const newCompanies = new Map<string, CompanyFolder>()

        for (const file of allFiles) {
          const parts = file.path.split('/')
          if (parts.length >= 3) {
            const company = parts[0]
            const date = parts[1]
            const filename = parts[parts.length - 1]

            if (!newCompanies.has(company)) {
              newCompanies.set(company, {
                company,
                dateMap: new Map(),
                loading: false,
              })
            }

            const companyFolder = newCompanies.get(company)!
            if (!companyFolder.dateMap.has(date)) {
              companyFolder.dateMap.set(date, {
                date,
                files: [],
                loading: false,
              })
            }

            const dateFolder = companyFolder.dateMap.get(date)!
            dateFolder.files.push({
              id: file.path,
              name: filename,
              size: file.size,
              path: file.path,
              type: getFileType(filename),
              createdAt: file.created_at || new Date().toISOString(),
            })
          }
        }

        setCompanies(newCompanies)
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to fetch documents'))
      } finally {
        setLoading(false)
      }
    }

    fetchDocumentStructure()
  }, [shouldFetch])

  return { companies, loading, error }
}

export function getFileType(filename: string): 'pdf' | 'xlsx' | 'docx' | 'other' {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return 'pdf'
    case 'xlsx':
    case 'xls':
      return 'xlsx'
    case 'docx':
    case 'doc':
      return 'docx'
    default:
      return 'other'
  }
}

export function getFileIcon(type: 'pdf' | 'xlsx' | 'docx' | 'other'): string {
  switch (type) {
    case 'pdf':
      return '📄'
    case 'xlsx':
      return '📊'
    case 'docx':
      return '📝'
    default:
      return '📎'
  }
}
