"use client";

import { useState } from "react";
import { FileItem } from "@/hooks/useDocumentTree";
import { DocumentTree } from "./tree";
import { FilePreview } from "./preview";

export function DocumentExplorer() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleRemoveDocuments = () => {
    // Clear the loaded state, which will unmount the tree and clear selection
    setIsLoaded(false);
    setSelectedFile(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">📂 Placement Documents</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Documents ARE mismatched, the documents are for archival reference only
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isLoaded && (
            <button
              onClick={() => setIsLoaded(true)}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Load Documents
            </button>
          )}
          {isLoaded && (
            <button
              onClick={handleRemoveDocuments}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Remove Documents
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tree Panel - 40% */}
        <div className="w-2/5 border-r border-border overflow-hidden">
          <DocumentTree
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            shouldFetch={isLoaded}
          />
        </div>

        {/* Preview Panel - 60% */}
        <div className="w-3/5 overflow-hidden">
          <FilePreview file={selectedFile} />
        </div>
      </div>
    </div>
  );
}
