'use client'

import { FileItem } from '@/hooks/useDocumentTree'

interface TreeProps {
  onFileSelect: (file: FileItem) => void
  selectedFile: FileItem | null
  shouldFetch: boolean
}

export function DocumentTree({ onFileSelect, selectedFile, shouldFetch }: TreeProps) {
  // Logic and hooks removed to prevent data fetching
  
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground p-6 text-center">
      <div>
        <p className="text-sm font-medium">Storage Offline</p>
        <p className="text-xs mt-1">The document tree is currently unavailable.</p>
      </div>
    </div>
  )
}