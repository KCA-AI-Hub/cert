'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Eye,
  Calendar,
  User,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  category: '공지' | '안내' | '업데이트'
  views: number
  isImportant: boolean
  isPublished: boolean
}

interface NoticeEditorProps {
  notice: Notice
  onSave: (updatedNotice: Notice) => void
  onCancel: () => void
}

export function NoticeEditor({ notice, onSave, onCancel }: NoticeEditorProps) {
  const [formData, setFormData] = useState<Notice>(notice)
  const [errors, setErrors] = useState<Partial<Notice>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    setFormData(notice)
  }, [notice])

  const validateForm = (): boolean => {
    const newErrors: Partial<Notice> = {}

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    } else if (formData.title.length < 5) {
      newErrors.title = '제목은 5자 이상 입력해주세요'
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요'
    } else if (formData.content.length < 10) {
      newErrors.content = '내용은 10자 이상 입력해주세요'
    }

    if (!formData.author.trim()) {
      newErrors.author = '작성자를 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // 실제로는 API 호출을 여기서 수행
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // 업데이트된 공지사항을 부모 컴포넌트에 전달
    onSave(formData)
    
    // 2초 후 성공 메시지 숨김
    setTimeout(() => {
      setIsSubmitted(false)
      onCancel()
    }, 2000)
  }

  const handleReset = () => {
    setFormData(notice)
    setErrors({})
    setIsSubmitted(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공지': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case '안내': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case '업데이트': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">공지사항이 성공적으로 수정되었습니다!</h3>
            <p className="text-muted-foreground mb-4">
              수정된 내용이 공지사항 목록에 반영되었습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 제목 및 모드 전환 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            공지사항 수정
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant={previewMode ? "outline" : "default"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? '편집 모드' : '미리보기'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        /* 미리보기 모드 */
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              {formData.isImportant && (
                <Badge variant="destructive">중요</Badge>
              )}
              <Badge className={getCategoryColor(formData.category)}>
                {formData.category}
              </Badge>
              {!formData.isPublished && (
                <Badge variant="outline">비게시</Badge>
              )}
            </div>
            <CardTitle className="text-xl">{formData.title || '제목을 입력해주세요'}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                작성자: {formData.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                작성일: {formData.date}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{formData.content || '내용을 입력해주세요'}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 편집 모드 */
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="공지사항 제목을 입력하세요"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* 카테고리 및 중요도 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>카테고리 *</Label>
                  <RadioGroup
                    value={formData.category}
                    onValueChange={(value: '공지' | '안내' | '업데이트') => 
                      setFormData({ ...formData, category: value })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="공지" id="notice" />
                      <Label htmlFor="notice">공지</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="안내" id="info" />
                      <Label htmlFor="info">안내</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="업데이트" id="update" />
                      <Label htmlFor="update">업데이트</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>설정</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="important"
                        checked={formData.isImportant}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, isImportant: checked as boolean })
                        }
                      />
                      <Label htmlFor="important">중요 공지사항으로 설정</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="published"
                        checked={formData.isPublished}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, isPublished: checked as boolean })
                        }
                      />
                      <Label htmlFor="published">게시 상태</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 작성자 */}
              <div className="space-y-2">
                <Label htmlFor="author">작성자 *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="작성자를 입력하세요"
                  className={errors.author ? 'border-red-500' : ''}
                />
                {errors.author && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.author}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 내용 */}
          <Card>
            <CardHeader>
              <CardTitle>공지사항 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="공지사항 내용을 입력하세요"
                  className={`min-h-[200px] resize-none ${errors.content ? 'border-red-500' : ''}`}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.content}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  현재 {formData.content.length}자 입력됨
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 작성 가이드 */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>수정 가이드:</strong> 공지사항 내용을 수정하실 수 있습니다. 
              게시 상태를 변경하여 즉시 게시하거나 비게시 상태로 설정할 수 있습니다.
            </AlertDescription>
          </Alert>

          {/* 버튼 */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              원래대로
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? '수정 중...' : '공지사항 수정'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}


