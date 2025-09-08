'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, File, Download } from 'lucide-react'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  data?: string // base64 encoded data for demo
}

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  disabled?: boolean
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['*'],
  disabled = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = []
    
    Array.from(selectedFiles).forEach((file) => {
      // 파일 크기 체크
      if (file.size > maxSize * 1024 * 1024) {
        alert(`파일 크기가 ${maxSize}MB를 초과합니다: ${file.name}`)
        return
      }

      // 파일 타입 체크
      if (acceptedTypes[0] !== '*' && !acceptedTypes.some(type => 
        file.type.includes(type.replace('*', ''))
      )) {
        alert(`지원하지 않는 파일 형식입니다: ${file.name}`)
        return
      }

      // 최대 파일 수 체크
      if (files.length + newFiles.length >= maxFiles) {
        alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
        return
      }

      // 파일을 base64로 변환 (실제 환경에서는 서버로 업로드)
      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target?.result as string
        }
        newFiles.push(newFile)
        
        if (newFiles.length === Array.from(selectedFiles).length) {
          onFilesChange([...files, ...newFiles])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter(file => file.id !== fileId))
  }

  const downloadFile = (file: UploadedFile) => {
    if (file.data) {
      const link = document.createElement('a')
      link.href = file.data
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="p-6 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">
            파일을 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-500 mb-4">
            최대 {maxFiles}개 파일, 각 {maxSize}MB 이하
          </p>
          <Button 
            type="button" 
            variant="outline" 
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            파일 선택
          </Button>
        </CardContent>
      </Card>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* 업로드된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">첨부파일 ({files.length}개)</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file)}
                      title="다운로드"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={disabled}
                      title="삭제"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
