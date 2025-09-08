import { AuthGuard } from '@/components/AuthGuard'
import { NavBar } from '@/components/NavBar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <NavBar />
        {children}
      </div>
    </AuthGuard>
  )
}


