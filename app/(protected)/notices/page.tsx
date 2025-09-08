import { PageHeader } from '@/components/PageHeader'
import { NoticeBoard } from '@/components/NoticeBoard'

export default function NoticesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="공지사항" description="KCA 자격검정 관련 공지사항, 안내사항, 업데이트 정보를 확인하실 수 있습니다. 검색과 필터링 기능을 통해 원하는 정보를 빠르게 찾아보세요." />
      <NoticeBoard />
    </div>
  )
}



