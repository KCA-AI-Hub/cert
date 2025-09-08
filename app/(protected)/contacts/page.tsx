import { PageHeader } from '@/components/PageHeader'
import { ContactList } from '@/components/ContactList'

export default function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="담당자 연락처"
        description="KCA 자격검정 관련 담당자 연락처 정보를 확인하실 수 있습니다."
      />
      <ContactList />
    </div>
  )
}
