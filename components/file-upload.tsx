"use client"

import React from "react"
import { t } from "@/lib/i18n";
import { Upload } from "lucide-react"
import { useCallback, useState } from "react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string
}

export function FileUpload({ onFileSelect, acceptedTypes = ".xlsx,.xls" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        const file = files[0]
        setFileName(file.name)
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        setFileName(file.name)
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  return (
    <div
      className={`relative border-2 border-dashed rounded-md p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-accent hover:border-primary/50"
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Subir archivo"
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        {fileName ? (
          <p className="text-sm font-medium text-foreground">{fileName}</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {t("uploadFile.accion")} 
            </p>
            <p className="text-xs text-muted-foreground">
              {t("uploadFile.formato")} 
            </p>
          </>
        )}
      </div>
    </div>
  )
}
