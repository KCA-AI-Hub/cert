'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Search,
  Building,
  User,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { useState } from 'react'

interface Contact {
  id: number
  name: string
  position: string
  department: string
  phone: string
  email: string
  office: string
  workingHours: string
  responsibilities: string[]
}

const mockContacts: Contact[] = [
  {
    id: 1,
    name: '김자격',
    position: '팀장',
    department: '자격검정팀',
    phone: '02-1234-5678',
    email: 'qualification@kca.kr',
    office: '본관 3층 301호',
    workingHours: '09:00 ~ 18:00',
    responsibilities: ['자격검정 전반 관리', '시험 일정 관리', '원서접수 관리']
  },
  {
    id: 2,
    name: '이시험',
    position: '주무관',
    department: '자격검정팀',
    phone: '02-1234-5679',
    email: 'exam@kca.kr',
    office: '본관 3층 302호',
    workingHours: '09:00 ~ 18:00',
    responsibilities: ['시험 시행 관리', '시험장 관리', '감독관 배정']
  },
  {
    id: 3,
    name: '박합격',
    position: '주무관',
    department: '자격검정팀',
    phone: '02-1234-5680',
    email: 'result@kca.kr',
    office: '본관 3층 303호',
    workingHours: '09:00 ~ 18:00',
    responsibilities: ['합격자 발표', '성적 관리', '자격증 발급']
  },
  {
    id: 4,
    name: '최교육',
    position: '팀장',
    department: '교육팀',
    phone: '02-1234-5681',
    email: 'education@kca.kr',
    office: '본관 4층 401호',
    workingHours: '09:00 ~ 18:00',
    responsibilities: ['자격취득교육 관리', '교육과정 운영', '교육생 관리']
  },
  {
    id: 5,
    name: '정보안',
    position: '주무관',
    department: '교육팀',
    phone: '02-1234-5682',
    email: 'security@kca.kr',
    office: '본관 4층 402호',
    workingHours: '09:00 ~ 18:00',
    responsibilities: ['통신보안교육 관리', '교육자료 관리', '수료증 발급']
  },
  {
    id: 6,
    name: '한고객',
    position: '팀장',
    department: '고객지원팀',
    phone: '02-1234-5683',
    email: 'support@kca.kr',
    office: '본관 2층 201호',
    workingHours: '09:00 ~ 18:00',
    responsibilities: ['고객 문의 응답', '민원 처리', '시스템 지원']
  }
]

export function ContactList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('전체')
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  // 실제 담당자들의 부서를 기반으로 동적 필터 생성
  const departments = ['전체', ...Array.from(new Set(contacts.map(c => c.department).filter(Boolean)))]

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === '전체' || contact.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleEdit = (contact: Contact) => {
    setEditingContact({ ...contact })
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    const newContact: Contact = {
      id: Math.max(...contacts.map(c => c.id)) + 1,
      name: '',
      position: '',
      department: '',
      phone: '',
      email: '',
      office: '',
      workingHours: '09:00 ~ 18:00',
      responsibilities: []
    }
    setEditingContact(newContact)
    setIsAddingNew(true)
  }

  const handleSave = () => {
    if (!editingContact) return

    if (isAddingNew) {
      setContacts([...contacts, editingContact])
    } else {
      setContacts(contacts.map(c => c.id === editingContact.id ? editingContact : c))
    }
    setEditingContact(null)
    setIsAddingNew(false)
  }

  const handleCancel = () => {
    setEditingContact(null)
    setIsAddingNew(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('정말로 이 담당자를 삭제하시겠습니까?')) {
      setContacts(contacts.filter(c => c.id !== id))
    }
  }

  const handleInputChange = (field: keyof Contact, value: string | string[]) => {
    if (!editingContact) return
    setEditingContact({ ...editingContact, [field]: value })
  }

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case '자격검정팀': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case '교육팀': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case '고객지원팀': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              담당자 검색
            </CardTitle>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              담당자 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="이름, 직책, 부서로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 담당자 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{contact.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDepartmentColor(contact.department)}>
                    {contact.department}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(contact)}
                      title="수정"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                      title="삭제"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 연락처 정보 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="break-all">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span>{contact.office}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>{contact.workingHours}</span>
                </div>
              </div>

              {/* 담당 업무 */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  담당 업무
                </h4>
                <div className="space-y-1">
                  {contact.responsibilities.map((responsibility, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                      {responsibility}
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* 검색 결과 없음 */}
      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
            <p className="text-muted-foreground">
              다른 검색어나 부서를 선택해보세요.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 편집 모달 */}
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isAddingNew ? '새 담당자 추가' : '담당자 정보 수정'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">이름 *</label>
                  <Input
                    value={editingContact.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="담당자 이름"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">직책 *</label>
                  <Input
                    value={editingContact.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="팀장, 주무관 등"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">부서 *</label>
                  <Input
                    value={editingContact.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="부서명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">전화번호</label>
                  <Input
                    value={editingContact.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="02-1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">이메일</label>
                  <Input
                    value={editingContact.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@kca.kr"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">사무실</label>
                  <Input
                    value={editingContact.office}
                    onChange={(e) => handleInputChange('office', e.target.value)}
                    placeholder="본관 3층 301호"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">근무시간</label>
                  <Input
                    value={editingContact.workingHours}
                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                    placeholder="09:00 ~ 18:00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">담당 업무</label>
                <div className="space-y-2">
                  {editingContact.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={responsibility}
                        onChange={(e) => {
                          const newResponsibilities = [...editingContact.responsibilities]
                          newResponsibilities[index] = e.target.value
                          handleInputChange('responsibilities', newResponsibilities)
                        }}
                        placeholder="담당 업무를 입력하세요"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newResponsibilities = editingContact.responsibilities.filter((_, i) => i !== index)
                          handleInputChange('responsibilities', newResponsibilities)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newResponsibilities = [...editingContact.responsibilities, '']
                      handleInputChange('responsibilities', newResponsibilities)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    업무 추가
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button onClick={handleSave} disabled={!editingContact.name || !editingContact.position || !editingContact.department}>
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingNew ? '추가' : '저장'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 전체 연락처 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            KCA 전체 연락처
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">대표전화</h4>
              <p className="text-2xl font-bold text-primary">1688-0013</p>
              <p className="text-sm text-muted-foreground">평일 09:00 ~ 18:00</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">주소</h4>
              <p className="text-sm">전남 나주시 빛가람로 760(빛가람동)</p>
              <p className="text-sm text-muted-foreground">한국방송통신전파진흥원</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
