import { PageHeader } from '@/components/PageHeader'
import { NoticeWriter } from '@/components/NoticeWriter'

export default function WriteNoticePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="공지사항 작성" description="KCA 자격검정 관련 공지사항을 작성하실 수 있습니다. 제목, 내용, 카테고리를 입력하고 미리보기 기능을 통해 작성 내용을 확인해보세요." />
      <NoticeWriter />
    </div>
  )
}



