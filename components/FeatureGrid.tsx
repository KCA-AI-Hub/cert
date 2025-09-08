import { Shield, Clock, FileText, Sparkles, Settings, Rocket } from 'lucide-react'

interface FeatureItem {
  icon: any
  title: string
  description: string
}

const items: FeatureItem[] = [
  { icon: Sparkles, title: 'AI 기반 지원', description: '정확한 답변과 자료 근거 제공' },
  { icon: Settings, title: '업무 자동화', description: '반복 작업 최소화로 효율 향상' },
  { icon: Shield, title: '보안/접근성', description: '담당자 전용, 접근성 표준 준수' },
  { icon: Clock, title: '즉시 대응', description: '24/7 지원으로 지연 없는 업무' },
  { icon: FileText, title: '공식 근거', description: 'KCA 문서 기반의 신뢰' },
  { icon: Rocket, title: '빠른 배포', description: 'Vercel 기반 CI/CD' },
]

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((f, i) => {
        const Icon = f.icon
        return (
          <div
            key={i}
            className="group rounded-xl border p-6 transition-all hover:shadow-lg hover:border-primary/40 bg-card"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon className="text-primary h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </div>
        )
      })}
    </div>
  )
}


