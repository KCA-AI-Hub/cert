"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Plus, ArrowRight } from "lucide-react"

interface Notice {
  id: number
  title: string
  content: string
  author: string
  date: string
  category: "공지" | "안내" | "업데이트"
  views: number
  isImportant: boolean
  isPublished: boolean
}

const STORAGE_KEY = "kca_user_notices"

const mockNotices: Notice[] = [
  {
    id: 1,
    title: "2024년 자격검정 일정 안내",
    content: "2024년도 자격검정 일정이 확정되었습니다.",
    author: "자격검정팀",
    date: "2024-01-15",
    category: "공지",
    views: 156,
    isImportant: true,
    isPublished: true,
  },
  {
    id: 2,
    title: "시스템 점검 안내",
    content: "정기 시스템 점검이 예정되어 있습니다.",
    author: "시스템관리팀",
    date: "2024-01-10",
    category: "안내",
    views: 89,
    isImportant: false,
    isPublished: true,
  },
  {
    id: 3,
    title: "신규 기능 업데이트",
    content: "AI 챗봇 기능이 업데이트되었습니다.",
    author: "개발팀",
    date: "2024-01-05",
    category: "업데이트",
    views: 234,
    isImportant: false,
    isPublished: true,
  },
]

export function RecentNotices() {
  const [recentNotices, setRecentNotices] = useState<Notice[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const storedNotices = raw ? (JSON.parse(raw) as Notice[]) : []
      
      // Combine stored notices with mock notices
      const allNotices = [...storedNotices, ...mockNotices]
      
      // Filter published notices and get the 3 most recent
      const publishedNotices = allNotices
        .filter(notice => notice.isPublished)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
      
      setRecentNotices(publishedNotices)
    } catch {
      // Fallback to mock notices if localStorage fails
      setRecentNotices(mockNotices.slice(0, 3))
    }
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "공지": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "안내": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "업데이트": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            최근 공지사항
          </h2>
          <p className="text-muted-foreground">
            최근 게시된 공지사항을 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/notices">
              전체보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/notices/write">
              <Plus className="mr-2 h-4 w-4" />
              글쓰기
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentNotices.map((notice) => (
          <Card key={notice.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(notice.category)}>
                  {notice.category}
                </Badge>
                {notice.isImportant && (
                  <Badge variant="destructive" className="text-xs">
                    중요
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {notice.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 mb-4">
                {notice.content}
              </CardDescription>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{notice.author}</span>
                <span>{notice.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recentNotices.length === 0 && (
        <div className="text-center py-12">
          <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">공지사항이 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            아직 게시된 공지사항이 없습니다.
          </p>
          <Button asChild>
            <Link href="/notices/write">
              <Plus className="mr-2 h-4 w-4" />
              첫 공지사항 작성하기
            </Link>
          </Button>
        </div>
      )}
    </section>
  )
}
