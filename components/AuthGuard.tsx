"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = localStorage.getItem("kca_authenticated") === "true"
      const loginTime = localStorage.getItem("kca_login_time")
      
      if (!authenticated || !loginTime) {
        setIsAuthenticated(false)
        router.push("/login")
        return
      }

      // Check if login is still valid (24 hours)
      const loginDate = new Date(loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff > 24) {
        // Session expired
        localStorage.removeItem("kca_authenticated")
        localStorage.removeItem("kca_login_time")
        setIsAuthenticated(false)
        router.push("/login")
        return
      }

      setIsAuthenticated(true)
    }

    checkAuth()
  }, [router])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show children only if authenticated
  return isAuthenticated ? <>{children}</> : null
}


