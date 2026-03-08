'use client'

import { FileItem } from '@/hooks/useDocumentTree'

interface PreviewProps {
  file: FileItem | null
}

export function FilePreview({ file }: PreviewProps) {
  // All Supabase imports and useEffect logic removed

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a file to preview</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{file.name}</h3>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-center p-8">
          <p className="text-sm text-destructive font-medium mb-2">
            Preview Service Offline
          </p>
          <p className="text-xs text-muted-foreground">
            Connection to storage has been disabled.
          </p>
        </div>
      </div>
    </div>
  )
}