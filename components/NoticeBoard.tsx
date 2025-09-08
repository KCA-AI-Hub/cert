'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NoticeEditor } from './NoticeEditor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search, Calendar, User, Eye, FileText, Plus, Edit, Trash2, EyeOff, Eye as EyeIcon, Paperclip, Download } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  data?: string
}

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
  attachments?: UploadedFile[]
}

const STORAGE_KEY = 'kca_user_notices'

const mockNotices: Notice[] = [
  {
    id: 1,
    title: '2024년 KCA 자격검정 일정 안내',
    content: '2024년 KCA 자격검정 시험 일정이 확정되었습니다. 자세한 내용은 첨부파일을 참고하시기 바랍니다.',
    author: '자격검정팀',
    date: '2024-01-15',
    category: '공지',
    views: 245,
    isImportant: true,
    isPublished: true
  },
  {
    id: 2,
    title: '자격검정 시스템 점검 안내',
    content: '2024년 1월 20일 오전 2시부터 6시까지 시스템 점검이 예정되어 있습니다. 해당 시간대에는 서비스 이용이 제한될 수 있습니다.',
    author: '시스템관리팀',
    date: '2024-01-14',
    category: '안내',
    views: 189,
    isImportant: false,
    isPublished: true
  },
  {
    id: 3,
    title: 'AI 업무도우미 기능 업데이트',
    content: 'AI 챗봇 기능이 개선되었습니다. 더 정확하고 상세한 답변을 제공할 수 있도록 업데이트되었습니다.',
    author: '개발팀',
    date: '2024-01-13',
    category: '업데이트',
    views: 156,
    isImportant: false,
    isPublished: true
  },
  {
    id: 4,
    title: '응시자격 진단 시스템 개선',
    content: '응시자격 진단 시스템이 더욱 정확하고 사용하기 쉽게 개선되었습니다. 새로운 기능들을 확인해보세요.',
    author: '개발팀',
    date: '2024-01-12',
    category: '업데이트',
    views: 134,
    isImportant: false,
    isPublished: false
  },
  {
    id: 5,
    title: '담당자 연락처 정보 업데이트',
    content: '담당자 연락처 정보가 최신으로 업데이트되었습니다. 정확한 연락처로 문의하시기 바랍니다.',
    author: '인사팀',
    date: '2024-01-11',
    category: '안내',
    views: 98,
    isImportant: false,
    isPublished: true
  }
]

function readUserNotices(): Notice[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Notice[]
  } catch {
    return []
  }
}

function writeUserNotices(notices: Notice[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices))
}

export function NoticeBoard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const noticesPerPage = 5
  const [notices, setNotices] = useState<Notice[]>([])
  const [showUnpublished, setShowUnpublished] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)

  // 초기 로드: 사용자 공지 + 기본 공지 합치기
  useEffect(() => {
    const user = readUserNotices()
    setNotices([...user, ...mockNotices])
  }, [])

  // 다른 탭에서 저장 변경 반영
  useEffect(() => {
    const handler = () => {
      const user = readUserNotices()
      setNotices([...user, ...mockNotices])
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const categories = ['전체', '공지', '안내', '업데이트']

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory
    const matchesPublishStatus = showUnpublished ? true : notice.isPublished
    return matchesSearch && matchesCategory && matchesPublishStatus
  })

  const totalPages = Math.ceil(filteredNotices.length / noticesPerPage)
  const startIndex = (currentPage - 1) * noticesPerPage
  const endIndex = startIndex + noticesPerPage
  const currentNotices = filteredNotices.slice(startIndex, endIndex)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공지': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case '안내': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case '업데이트': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // user 생성 글인지 확인 (모크와 구분: id를 100000 이상으로 생성하도록 가정)
  const isUserNotice = (n: Notice) => n.id >= 100000

  const saveBackToStorageIfUser = (updated: Notice[]) => {
    const userOnly = updated.filter(isUserNotice)
    writeUserNotices(userOnly)
  }

  const handleTogglePublish = (noticeId: number) => {
    setNotices(prev => {
      const next = prev.map(n => n.id === noticeId ? { ...n, isPublished: !n.isPublished } : n)
      saveBackToStorageIfUser(next)
      return next
    })
  }

  const handleDelete = (noticeId: number) => {
    if (confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      setNotices(prev => {
        const next = prev.filter(n => n.id !== noticeId)
        saveBackToStorageIfUser(next)
        return next
      })
      if (selectedNotice?.id === noticeId) setSelectedNotice(null)
      if (editingNotice?.id === noticeId) setEditingNotice(null)
    }
  }

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice)
    setSelectedNotice(null)
  }

  const handleSaveEdit = (updatedNotice: Notice) => {
    setNotices(prev => {
      const next = prev.map(n => n.id === updatedNotice.id ? updatedNotice : n)
      saveBackToStorageIfUser(next)
      return next
    })
  }

  const handleCancelEdit = () => {
    setEditingNotice(null)
  }

  // 수정 모드일 때는 편집기 표시
  if (editingNotice) {
    return (
      <NoticeEditor
        notice={editingNotice}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            공지사항 검색
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="제목 또는 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="showUnpublished"
                checked={showUnpublished}
                onCheckedChange={(checked) => setShowUnpublished(checked === true)}
              />
              <Label htmlFor="showUnpublished" className="text-sm">비게시 공지사항 포함</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 공지사항 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>공지사항 목록</CardTitle>
            <Button asChild size="sm">
              <Link href="/notices/write">
                <Plus className="h-4 w-4 mr-2" />
                공지사항 작성
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentNotices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {currentNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedNotice(notice)}>
                      <div className="flex items-center gap-2 mb-2">
                        {notice.isImportant && (
                          <Badge variant="destructive" className="text-xs">
                            중요
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getCategoryColor(notice.category)}`}>
                          {notice.category}
                        </Badge>
                        {!notice.isPublished && (
                          <Badge variant="outline" className="text-xs">
                            비게시
                          </Badge>
                        )}
                        {notice.attachments && notice.attachments.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Paperclip className="h-3 w-3" />
                            <span>{notice.attachments.length}</span>
                          </div>
                        )}
                        <h3 className="font-semibold text-lg">{notice.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {notice.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {notice.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {notice.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          조회 {notice.views}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(notice)
                        }}
                        title="수정"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTogglePublish(notice.id)
                        }}
                        title={notice.isPublished ? "비게시" : "게시"}
                      >
                        {notice.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(notice.id)
                        }}
                        title="삭제"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 공지사항 상세보기 모달 */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  공지사항 상세보기
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNotice(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {selectedNotice.isImportant && (
                  <Badge variant="destructive">중요</Badge>
                )}
                <Badge className={getCategoryColor(selectedNotice.category)}>
                  {selectedNotice.category}
                </Badge>
                {!selectedNotice.isPublished && (
                  <Badge variant="outline">비게시</Badge>
                )}
              </div>
              
              <h2 className="text-xl font-bold">{selectedNotice.title}</h2>
              
              <Separator />
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  작성자: {selectedNotice.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  작성일: {selectedNotice.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  조회수: {selectedNotice.views}
                </span>
              </div>
              
              <Separator />
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{selectedNotice.content}</p>
              </div>
              
              {/* 첨부파일 섹션 */}
              {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    첨부파일 ({selectedNotice.attachments.length}개)
                  </h4>
                  <div className="space-y-2">
                    {selectedNotice.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)}KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (file.data) {
                              const link = document.createElement('a')
                              link.href = file.data
                              link.download = file.name
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          다운로드
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
