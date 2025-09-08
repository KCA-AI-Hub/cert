import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, ClipboardCheck } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-transparent to-primary/5 dark:from-primary/20 dark:to-transparent">
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]">
        <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
      </div>
      <div className="relative z-10 px-6 py-16 md:px-12 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          KCA <span className="text-primary">자격검정 업무도우미</span>
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          AI, 데이터, 자동화로 담당자 업무를 혁신하세요. 더 빠르고 정확하게.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/chat">
              <MessageSquare className="h-5 w-5 mr-2" /> AI 업무도우미 시작하기
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
            <Link href="/eligibility">
              <ClipboardCheck className="h-5 w-5 mr-2" /> 응시자격 진단
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="text-lg px-8 py-3">
            <Link href="/contacts">
              <Users className="h-5 w-5 mr-2" /> 담당자 연락처
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
