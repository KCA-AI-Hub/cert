"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Trophy,
  Briefcase as WorkIcon
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '@/lib/logger'

interface Qualification {
  id: string
  qualificationInfo: string
  acquisitionDate: string
}

interface WorkExperience {
  id: string
  jobField: string
  experiencePeriod: string
}

interface SkillCompetition {
  id: string
  competition: string
  awardDate: string
}

interface Education {
  id: string
  education: string
}

interface DiagnosisResult {
  eligibleCategories: string[]
  exemptSubjects: string[]
  notes: string[]
}

export function EligibilityDiagnosis() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionId] = useState(() => uuidv4())

  // 학력 정보
  const [education, setEducation] = useState<Education[]>([])
  const [newEducation, setNewEducation] = useState('')

  // 보유 자격
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [newQualification, setNewQualification] = useState({
    qualificationInfo: '',
    acquisitionDate: ''
  })

  // 직무 경력
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([])
  const [newWorkExperience, setNewWorkExperience] = useState({
    jobField: '',
    experiencePeriod: ''
  })

  // 기능경기대회 수상
  const [skillCompetitions, setSkillCompetitions] = useState<SkillCompetition[]>([])
  const [newSkillCompetition, setNewSkillCompetition] = useState({
    competition: '',
    awardDate: ''
  })

  // 진단 결과
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null)
  const [isDiagnosing, setIsDiagnosing] = useState(false)

  const addEducation = () => {
    if (newEducation.trim()) {
      setEducation([...education, { id: uuidv4(), education: newEducation.trim() }])
      setNewEducation('')
    }
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id))
  }

  const addQualification = () => {
    if (newQualification.qualificationInfo.trim()) {
      setQualifications([...qualifications, { ...newQualification, id: uuidv4() }])
      setNewQualification({
        qualificationInfo: '',
        acquisitionDate: ''
      })
    }
  }

  const removeQualification = (id: string) => {
    setQualifications(qualifications.filter(qual => qual.id !== id))
  }

  const addWorkExperience = () => {
    if (newWorkExperience.jobField.trim() && newWorkExperience.experiencePeriod.trim()) {
      setWorkExperience([...workExperience, { ...newWorkExperience, id: uuidv4() }])
      setNewWorkExperience({ jobField: '', experiencePeriod: '' })
    }
  }

  const removeWorkExperience = (id: string) => {
    setWorkExperience(workExperience.filter(work => work.id !== id))
  }

  const addSkillCompetition = () => {
    if (newSkillCompetition.competition.trim()) {
      setSkillCompetitions([...skillCompetitions, { ...newSkillCompetition, id: uuidv4() }])
      setNewSkillCompetition({ competition: '', awardDate: '' })
    }
  }

  const removeSkillCompetition = (id: string) => {
    setSkillCompetitions(skillCompetitions.filter(comp => comp.id !== id))
  }

  const handleDiagnosis = async () => {
    setIsDiagnosing(true)
    
    // 진단 시작 로깅
    logger.logUserInteraction('eligibility_diagnosis_start', sessionId, {
      educationCount: education.length,
      qualificationCount: qualifications.length,
      workExperienceCount: workExperience.length,
      skillCompetitionCount: skillCompetitions.length
    })

    // 실제 진단 로직 (모의) - KCA 18개 종목 기준
    setTimeout(() => {
      const mockResult: DiagnosisResult = {
        eligibleCategories: [
          '정보통신기술사',
          '정보통신기사',
          '정보통신산업기사',
          '무선설비기사',
          '무선설비산업기사',
          '무선설비기능사',
          '방송통신기사',
          '방송통신산업기사',
          '방송통신기능사',
          '전파전자통신기사',
          '전파전자통신산업기사',
          '전파전자통신기능사',
          '통신선로산업기사',
          '통신선로기능사',
          '통신기기기능사',
          '통신설비기능장',
          '정보보안기사',
          '정보보안산업기사'
        ],
        exemptSubjects: [
          '정보통신기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '정보통신산업기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '무선설비기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '무선설비산업기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '방송통신기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '방송통신산업기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '전파전자통신기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '전파전자통신산업기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '정보보안기사: 필기시험 전과목 면제 (실기시험만 응시)',
          '정보보안산업기사: 필기시험 전과목 면제 (실기시험만 응시)'
        ],
        notes: [
          '학력 요건 충족: 대학 졸업',
          '관련 학과 이수 확인 필요',
          '경력 인정 기간: 2년 6개월',
          '과목면제 진단 결과와 일치하지 않는 경우 해당 지방본부로 문의하시기 바랍니다.',
          'KCA에서 시행하는 18개 종목에 대한 진단 결과입니다.',
          '기능경기대회 입상자에 대한 검정과목 면제가 적용될 수 있습니다.'
        ]
      }
      
      setDiagnosisResult(mockResult)
      setIsDiagnosing(false)
      
      // 진단 완료 로깅
      logger.logUserInteraction('eligibility_diagnosis_complete', sessionId, {
        eligibleCategories: mockResult.eligibleCategories,
        exemptSubjectsCount: mockResult.exemptSubjects.length
      })
    }, 2000)
  }

  const resetForm = () => {
    setEducation([])
    setQualifications([])
    setWorkExperience([])
    setSkillCompetitions([])
    setDiagnosisResult(null)
    setCurrentStep(1)
    
    logger.logUserInteraction('eligibility_diagnosis_reset', sessionId)
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          학력 정보
        </CardTitle>
        <CardDescription>
          최종 학력 정보를 입력해주세요. 졸업예정자도 포함됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <GraduationCap className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <span className="flex-1 font-medium">{edu.education}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newEducation}
            onChange={(e) => setNewEducation(e.target.value)}
            placeholder="예: 서울대학교 컴퓨터공학과 졸업"
            onKeyPress={(e) => e.key === 'Enter' && addEducation()}
            className="flex-1"
          />
          <Button onClick={addEducation} disabled={!newEducation.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">졸업예정자 안내</p>
              <p>졸업예정자란 시험원서 접수마감일 현재 초·중등교육법 및 고등교육법에 따라 정해진 학년 중 최종 학년에 재학 중인 사람을 말합니다.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setCurrentStep(2)}>
            다음 단계
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          보유자격 입력
        </CardTitle>
        <CardDescription>
          보유하고 계신 자격정보를 입력하세요. 추가버튼을 클릭하여 추가로 등록할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">동일 유사 자격증 관련 안내</p>
              <p>해당정보가 화면에 모두 표시 되지 않을 수 있으니 정확한 확인을 위해 국가기술자격법 시행규칙 [별표2]를 참고하여 주시기 바랍니다.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {qualifications.map((qual) => (
            <div key={qual.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium">{qual.qualificationInfo}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeQualification(qual.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground ml-8">
                취득일: {qual.acquisitionDate}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>자격정보</Label>
            <Input
              value={newQualification.qualificationInfo}
              onChange={(e) => setNewQualification({ ...newQualification, qualificationInfo: e.target.value })}
              placeholder="예: 정보처리기사"
            />
          </div>
          <div className="space-y-2">
            <Label>취득일자</Label>
            <Input
              type="date"
              value={newQualification.acquisitionDate}
              onChange={(e) => setNewQualification({ ...newQualification, acquisitionDate: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={addQualification} disabled={!newQualification.qualificationInfo.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            이전 단계
          </Button>
          <Button onClick={() => setCurrentStep(3)}>
            다음 단계
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WorkIcon className="h-5 w-5" />
          직무경력 입력
        </CardTitle>
        <CardDescription>
          학력 또는 자격이 있는 경우는 졸업(이수)/취득 후 경력을 입력하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {workExperience.map((work) => (
            <div key={work.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <WorkIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium">{work.jobField}</span>
                <span className="text-muted-foreground ml-2">- {work.experiencePeriod}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeWorkExperience(work.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>직무분야</Label>
            <Input
              value={newWorkExperience.jobField}
              onChange={(e) => setNewWorkExperience({ ...newWorkExperience, jobField: e.target.value })}
              placeholder="예: 정보처리"
            />
          </div>
          <div className="space-y-2">
            <Label>경력기간</Label>
            <Input
              value={newWorkExperience.experiencePeriod}
              onChange={(e) => setNewWorkExperience({ ...newWorkExperience, experiencePeriod: e.target.value })}
              placeholder="예: 2년 6개월"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={addWorkExperience} disabled={!newWorkExperience.jobField.trim() || !newWorkExperience.experiencePeriod.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">군 병과 경력 인증 기준</p>
              <p>군별 주특기 번호를 확인하여 직무경력을 입력하세요.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(2)}>
            이전 단계
          </Button>
          <Button onClick={() => setCurrentStep(4)}>
            다음 단계
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          기능경기대회 수상입력
        </CardTitle>
        <CardDescription>
          대회 수상 정보를 입력하세요. 추가버튼을 클릭하여 추가로 등록할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {skillCompetitions.map((comp) => (
            <div key={comp.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <Trophy className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <span className="font-medium">{comp.competition}</span>
                <span className="text-muted-foreground ml-2">- {comp.awardDate}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSkillCompetition(comp.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>기능경기대회</Label>
            <Input
              value={newSkillCompetition.competition}
              onChange={(e) => setNewSkillCompetition({ ...newSkillCompetition, competition: e.target.value })}
              placeholder="예: 전국기능경기대회"
            />
          </div>
          <div className="space-y-2">
            <Label>수상일자</Label>
            <Input
              type="date"
              value={newSkillCompetition.awardDate}
              onChange={(e) => setNewSkillCompetition({ ...newSkillCompetition, awardDate: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={addSkillCompetition} disabled={!newSkillCompetition.competition.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="font-medium mb-1">교육이수 내역</p>
              <p>이수한 교육정보를 입력하세요. 추가버튼을 클릭하여 추가로 등록할 수 있습니다.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(3)}>
            이전 단계
          </Button>
          <Button onClick={handleDiagnosis} disabled={isDiagnosing} size="lg">
            {isDiagnosing ? '진단 중...' : '응시자격 진단하기'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )


  const renderResult = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          응시자격 진단 결과
        </CardTitle>
        <CardDescription>
          입력하신 정보를 바탕으로 응시가능 종목 및 관련종목의 면제과목을 확인할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            응시가능 종목 (KCA 18개 종목)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {diagnosisResult?.eligibleCategories.map((category, index) => (
              <Badge key={index} variant="default" className="text-sm p-2">
                {category}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            총 {diagnosisResult?.eligibleCategories.length}개 종목에 응시 가능합니다.
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            면제과목 (기능경기대회 입상자)
          </h3>
          <div className="space-y-2">
            {diagnosisResult?.exemptSubjects.map((subject, index) => (
              <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950 rounded border-l-4 border-blue-500">
                <p className="text-sm font-medium">{subject}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded border-l-4 border-yellow-500">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">기능경기대회 입상자 면제 안내</p>
                <p>국제대회, 전국대회, 지방대회 입상자에 따라 면제 범위가 다릅니다.</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            주의사항
          </h3>
          <div className="space-y-2">
            {diagnosisResult?.notes.map((note, index) => (
              <div key={index} className="flex items-start gap-2">
                <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={resetForm}>
            처음부터 다시 진단
          </Button>
          <Button onClick={() => setCurrentStep(1)}>
            정보 수정
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* 진행 단계 표시 */}
      {!diagnosisResult && (
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-8 h-1 mx-2 ${
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 단계별 내용 */}
      {diagnosisResult ? (
        renderResult()
      ) : (
        <>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </>
      )}

      {/* 안내사항 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            안내사항
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-2">KCA 응시자격 자가진단 안내</p>
                <p>한국방송통신전파진흥원(KCA)에서 시행하는 18개 종목에 대한 응시자격을 진단합니다.</p>
                <p className="mt-2">응시자의 학력/경력/자격사항을 통한 응시가능종목 및 관련종목의 면제과목을 확인할 수 있습니다.</p>
                <p className="mt-2">본 응시자격 자가진단은 본인이 입력한 기초자료의 인증결과 및 응시자격기준에 따라 진단 결과가 반영될 수 있습니다.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">응시자의 보유자격, 기능경기입상 경력 등에 따라 과목을 면제 받을 수 있습니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">시험원서 접수 시 과목면제 진단 결과와 일치하지 않는 경우 해당 지방본부로 문의하시기 바랍니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">과목면제에 대한 자세한 안내는 <strong>자격검정안내 메뉴</strong>를 참조해 주시기 바랍니다.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">군 병과 경력 인증 기준(군별 주특기 번호)를 확인하여 직무경력을 입력하세요.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">KCA에서 시행하는 18개 종목: 정보통신기술사, 정보통신기사, 정보통신산업기사, 무선설비기사, 무선설비산업기사, 무선설비기능사, 방송통신기사, 방송통신산업기사, 방송통신기능사, 전파전자통신기사, 전파전자통신산업기사, 전파전자통신기능사, 통신선로산업기사, 통신선로기능사, 통신기기기능사, 통신설비기능장, 정보보안기사, 정보보안산업기사</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">기능경기대회 입상자에 대한 검정과목 면제는 국제대회, 전국대회, 지방대회에 따라 면제 범위가 다릅니다.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


