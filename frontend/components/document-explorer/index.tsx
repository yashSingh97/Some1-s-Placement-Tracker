"use client";

import { useState } from "react";
import { FileItem } from "@/hooks/useDocumentTree";
import { DocumentTree } from "./tree";
import { FilePreview } from "./preview";

export function DocumentExplorer() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">📂 Placement Documents</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm font-medium cursor-not-allowed"
          >
            Service Unavailable
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-2/5 border-r border-border overflow-hidden">
          <DocumentTree
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            shouldFetch={false} // Hardcoded to false to prevent hook activation
          />
        </div>

        <div className="w-3/5 overflow-hidden">
          <FilePreview file={selectedFile} />
        </div>
      </div>
    </div>
  );
}
