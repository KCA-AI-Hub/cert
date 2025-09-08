import { PageHeader } from '@/components/PageHeader'
import { EligibilityDiagnosis } from '@/components/EligibilityDiagnosis'

export default function EligibilityPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="응시자격 진단" 
        description="자격검정 응시자격을 진단해보세요. 기본 정보와 경력을 입력하시면 해당하는 자격검정을 추천해드립니다." 
      />
      <EligibilityDiagnosis />
    </div>
  )
}



