'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
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
  Paperclip
} from 'lucide-react'
import { FileUpload, UploadedFile } from '@/components/ui/file-upload'

interface NoticeForm {
  title: string
  content: string
  category: '공지' | '안내' | '업데이트'
  isImportant: boolean
  author: string
  attachments: UploadedFile[]
}

const STORAGE_KEY = 'kca_user_notices'

export function NoticeWriter() {
  const router = useRouter()
  const [formData, setFormData] = useState<NoticeForm>({
    title: '',
    content: '',
    category: '안내',
    isImportant: false,
    author: '자격검정팀',
    attachments: []
  })
  
  const [errors, setErrors] = useState<Partial<NoticeForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<NoticeForm> = {}

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

    // 저장 데이터 구성 (id는 100000 이상으로 생성)
    const newNotice = {
      id: Date.now(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: formData.author.trim(),
      date: new Date().toISOString().slice(0, 10),
      category: formData.category,
      views: 0,
      isImportant: formData.isImportant,
      isPublished: true,
      attachments: formData.attachments,
    }

    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      const list = raw ? (JSON.parse(raw) as typeof newNotice[]) : []
      list.unshift(newNotice)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      }
    } catch {
      // ignore storage errors
    }
    
    // 실제로는 API 호출을 여기서 수행
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // 1초 후 목록으로 이동
    setTimeout(() => {
      router.push('/notices')
    }, 1000)
  }

  const handleReset = () => {
    setFormData({
      title: '',
      content: '',
      category: '안내',
      isImportant: false,
      author: '자격검정팀',
      attachments: []
    })
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
            <h3 className="text-xl font-semibold mb-2">공지사항이 성공적으로 등록되었습니다!</h3>
            <p className="text-muted-foreground mb-4">
              곧 목록으로 이동합니다.
            </p>
            <Button onClick={() => router.push('/notices')} variant="outline">
              목록으로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 제목 및 모드 전환 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          공지사항 작성
        </h2>
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
            </div>
            <CardTitle className="text-xl">{formData.title || '제목을 입력해주세요'}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                작성자: {formData.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                작성일: {new Date().toLocaleDateString('ko-KR')}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{formData.content || '내용을 입력해주세요'}</p>
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  첨부파일 ({formData.attachments.length}개)
                </h4>
                <div className="space-y-2">
                  {formData.attachments.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.size / 1024).toFixed(1)}KB
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  <Label>중요도</Label>
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

          {/* 첨부파일 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                첨부파일
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                files={formData.attachments}
                onFilesChange={(files) => setFormData({ ...formData, attachments: files })}
                maxFiles={5}
                maxSize={10}
                acceptedTypes={['*']}
              />
              <p className="text-sm text-muted-foreground mt-2">
                PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF 파일을 업로드할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* 작성 가이드 */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>작성 가이드:</strong> 공지사항은 명확하고 간결하게 작성해주세요. 
              중요한 정보는 상단에 배치하고, 필요한 경우 첨부파일을 안내해주세요.
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
              초기화
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? '등록 중...' : '공지사항 등록'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
