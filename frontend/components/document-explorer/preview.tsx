'use client'

import { useEffect, useState } from 'react'
import { Download, ExternalLink } from 'lucide-react'
import { FileItem } from '@/hooks/useDocumentTree'
import { supabase } from '@/lib/supabase'

interface PreviewProps {
  file: FileItem | null
}

export function FilePreview({ file }: PreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }

    const loadPreview = async () => {
      try {
        setLoading(true)
        setError('')

        // Get public URL directly (bucket is public)
        const { data } = supabase.storage
          .from('placement-files')
          .getPublicUrl(file.path)

        if (!data?.publicUrl) {
          throw new Error('Failed to generate preview URL')
        }

        setPreviewUrl(data.publicUrl)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load preview')
      } finally {
        setLoading(false)
      }
    }

    loadPreview()
  }, [file])

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a file to preview</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{file.name}</h3>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          {previewUrl && (
            <>
              <a
                href={previewUrl}
                download={file.name}
                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-sm text-destructive">
            <p>{error}</p>
          </div>
        ) : file.type === 'pdf' && previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        ) : file.type === 'xlsx' && previewUrl ? (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
            className="w-full h-full border-0"
            title="Excel Preview"
            allow="fullscreen"
          />
        ) : file.type === 'docx' && previewUrl ? (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
            className="w-full h-full border-0"
            title="Document Preview"
            allow="fullscreen"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {file.type === 'other'
                  ? 'Preview not available for this file type'
                  : 'Click "Open in new tab" to view'}
              </p>
              {previewUrl && (
                <a
                  href={previewUrl}
                  download={file.name}
                  className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  Download File
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
