import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { NavBar } from '@/components/NavBar'
import { AuthGuard } from '@/components/AuthGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KCA 자격검정 업무도우미',
  description: 'KCA 자격검정 담당자를 위한 업무 지원 시스템 - AI 챗봇, 연락처 관리, 응시자격 진단',
  keywords: ['KCA', '자격검정', '업무도우미', '담당자', 'AI 챗봇', '응시자격'],
  authors: [{ name: 'KCA 자격검정팀' }],
  robots: 'index, follow',
  openGraph: {
    title: 'KCA 자격검정 업무도우미',
    description: 'KCA 자격검정 담당자를 위한 업무 지원 시스템',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
