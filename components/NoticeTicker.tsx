"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Megaphone } from "lucide-react"

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

const fallback: Notice[] = [
  {
    id: 90001,
    title: "KCA 자격검정 일정 안내",
    content: "",
    author: "자격검정팀",
    date: new Date().toISOString().slice(0, 10),
    category: "공지",
    views: 0,
    isImportant: true,
    isPublished: true,
  },
  {
    id: 90002,
    title: "시스템 점검 예정 안내",
    content: "",
    author: "시스템관리팀",
    date: new Date().toISOString().slice(0, 10),
    category: "안내",
    views: 0,
    isImportant: false,
    isPublished: true,
  },
]

export function NoticeTicker() {
  const [index, setIndex] = useState(0)
  const [items, setItems] = useState<Notice[]>([])

  // load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const list = raw ? (JSON.parse(raw) as Notice[]) : []
      const published = list.filter((n) => n.isPublished)
      const important = published.filter((n) => n.isImportant)

      const base = important.length > 0 ? important : published
      let final = base.sort((a, b) => b.id - a.id)

      if (final.length === 0) {
        const fbImportant = fallback.filter((n) => n.isImportant)
        final = (fbImportant.length > 0 ? fbImportant : fallback)
      }

      setItems(final)
    } catch {
      const fbImportant = fallback.filter((n) => n.isImportant)
      setItems(fbImportant.length > 0 ? fbImportant : fallback)
    }
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 2000) // 2s interval
    return () => clearInterval(timer)
  }, [items])

  const current = items.length > 0 ? items[index] : undefined

  if (!current) return null

  return (
    <div className="mt-2">
      <div className="relative overflow-hidden rounded-md border bg-background/70 backdrop-blur">
        <div className="flex items-center gap-2 px-3 py-2 text-sm">
          <span className="inline-flex items-center rounded-sm bg-primary/15 px-2 py-1 text-primary">
            <Megaphone className="h-4 w-4 mr-1" /> 공지
          </span>
          <div className="relative h-6 flex-1">
            {/* sliding wrapper */}
            <div
              key={`${current.id}-${index}`}
              className="absolute inset-0 flex items-center animate-[tickerSlide_0.35s_ease]"
            >
              <Link
                href="/notices"
                className="truncate hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                title={current.title}
                aria-label={`${current.title} 상세 보기`}
              >
                {current.title}
              </Link>
            </div>
          </div>
          <Link
            href="/notices"
            className="text-xs text-muted-foreground hover:text-primary"
            aria-label="공지사항 전체 보기"
          >
            전체보기
          </Link>
        </div>
      </div>
      <style jsx global>{`
        @keyframes tickerSlide {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
