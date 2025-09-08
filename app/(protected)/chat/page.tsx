import { PageHeader } from '@/components/PageHeader'
import { ChatUI } from '@/components/ChatUI'

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader 
        title="AI 업무도우미" 
        description="KCA 자격검정 업무 관련 질문을 AI에게 물어보세요. 자격검정 절차, 서류 준비, 시스템 사용법 등에 대해 도움을 받을 수 있습니다." 
      />
      <ChatUI />
    </div>
  )
}


