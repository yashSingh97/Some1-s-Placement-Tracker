'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, Calendar } from 'lucide-react'
import { useDocumentTree, getFileIcon } from '@/hooks/useDocumentTree'
import { FileItem } from '@/hooks/useDocumentTree'
import { Skeleton } from '@/components/ui/skeleton'

interface TreeProps {
  onFileSelect: (file: FileItem) => void
  selectedFile: FileItem | null
  shouldFetch: boolean
}

export function DocumentTree({ onFileSelect, selectedFile, shouldFetch }: TreeProps) {
  const { companies, loading, error } = useDocumentTree(shouldFetch)
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

  const toggleCompany = (company: string) => {
    const newExpanded = new Set(expandedCompanies)
    if (newExpanded.has(company)) {
      newExpanded.delete(company)
    } else {
      newExpanded.add(company)
    }
    setExpandedCompanies(newExpanded)
  }

  const toggleDate = (dateKey: string) => {
    const newExpanded = new Set(expandedDates)
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey)
    } else {
      newExpanded.add(dateKey)
    }
    setExpandedDates(newExpanded)
  }

  if (!shouldFetch) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">Click "Load Documents" to view placement files</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-destructive">
        <p>Error loading documents</p>
      </div>
    )
  }

  if (companies.size === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        <p>No documents available</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-2 space-y-1">
        {Array.from(companies.entries()).map(([company, companyFolder]) => (
          <div key={company}>
            <button
              onClick={() => toggleCompany(company)}
              className="w-full flex items-center gap-2 px-2 py-1 hover:bg-accent/20 rounded text-sm text-left group"
            >
              {expandedCompanies.has(company) ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
              <Folder className="w-4 h-4 flex-shrink-0 text-accent" />
              <span className="font-medium truncate">{company}</span>
            </button>

            {expandedCompanies.has(company) && (
              <div className="ml-6 space-y-1">
                {Array.from(companyFolder.dateMap.entries()).map(([date, dateFolder]) => {
                  const dateKey = `${company}-${date}`
                  return (
                    <div key={dateKey}>
                      <button
                        onClick={() => toggleDate(dateKey)}
                        className="w-full flex items-center gap-2 px-2 py-1 hover:bg-accent/20 rounded text-sm text-left"
                      >
                        {expandedDates.has(dateKey) ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )}
                        <Calendar className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        <span className="text-xs truncate">{date}</span>
                      </button>

                      {expandedDates.has(dateKey) && (
                        <div className="ml-6 space-y-1">
                          {dateFolder.files.map(file => (
                            <button
                              key={file.id}
                              onClick={() => onFileSelect(file)}
                              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs text-left truncate transition-colors ${
                                selectedFile?.id === file.id
                                  ? 'bg-accent/40 text-foreground'
                                  : 'hover:bg-accent/20 text-muted-foreground'
                              }`}
                            >
                              <span className="flex-shrink-0 text-sm">
                                {getFileIcon(file.type)}
                              </span>
                              <span className="truncate">{file.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
