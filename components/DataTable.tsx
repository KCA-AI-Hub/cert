"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Contact } from '@/lib/validators'
import { Search, Mail, Phone, Building } from 'lucide-react'

interface DataTableProps {
  data: Contact[]
}

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Contact>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredData = data.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="이름, 부서, 담당업무로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="담당자 검색"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        총 {sortedData.length}명의 담당자가 있습니다.
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedData.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                {contact.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">{contact.department}</p>
                <p className="text-sm text-muted-foreground">{contact.role}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
                    aria-label={`${contact.name}에게 이메일 보내기`}
                  >
                    {contact.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
                    aria-label={`${contact.name}에게 전화하기`}
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}




