'use client'

// NO SUPABASE IMPORT HERE

export interface FileItem {
  id: string
  name: string
  size: number
  path: string
  type: 'pdf' | 'xlsx' | 'docx' | 'other'
  createdAt: string
}

// Keep these exports so your components don't break
export function useDocumentTree(shouldFetch: boolean = false) {
  // Hardcoded empty state
  return { 
    companies: new Map(), 
    loading: false, 
    error: null 
  }
}

export function getFileType(filename: string): 'pdf' | 'xlsx' | 'docx' | 'other' {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (['xlsx', 'xls'].includes(ext!)) return 'xlsx'
  if (['docx', 'doc'].includes(ext!)) return 'docx'
  return 'other'
}

export function getFileIcon(type: 'pdf' | 'xlsx' | 'docx' | 'other'): string {
  const icons = { pdf: '📄', xlsx: '📊', docx: '📝', other: '📎' }
  return icons[type] || '📎'
}