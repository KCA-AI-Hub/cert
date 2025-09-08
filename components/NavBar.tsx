"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"
import { LogOut } from "lucide-react"

const navigation = [
  { name: 'AI 업무도우미', href: '/chat', description: '자격검정 업무 관련 질문을 AI에게 물어보세요' },
  { name: '담당자 연락처', href: '/contacts', description: 'KCA 자격검정 담당자 연락처 정보' },
  { name: '응시자격 진단', href: '/eligibility', description: '응시자격을 진단해보세요' },
  { name: '공지사항', href: '/notices', description: 'KCA 자격검정 관련 공지사항 및 안내' },
]

export function NavBar() {
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    // Clear authentication
    localStorage.removeItem("kca_authenticated")
    localStorage.removeItem("kca_login_time")
    // Redirect to login
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              KCA 자격검정 업무도우미
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
                title={item.description}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/home" className="md:hidden font-bold">
              KCA 자격검정 업무도우미
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}


