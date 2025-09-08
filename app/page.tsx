"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("kca_authenticated") === "true"
    const loginTime = localStorage.getItem("kca_login_time")
    
    if (!isAuthenticated || !loginTime) {
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
      router.push("/login")
      return
    }

    // Authenticated, redirect to main page
    router.push("/home")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}



