"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '@/lib/logger'

interface Question {
  id: string
  question: string
  type: 'yesno' | 'multiple' | 'text'
  options?: string[]
  required: boolean
}

const questions: Question[] = [
  {
    id: '1',
    question: '만 18세 이상이신가요?',
    type: 'yesno',
    required: true,
  },
  {
    id: '2',
    question: '고등학교 졸업 이상의 학력이 있으신가요?',
    type: 'yesno',
    required: true,
  },
  {
    id: '3',
    question: '관련 분야에서 몇 년간의 경험이 있으신가요?',
    type: 'multiple',
    options: ['없음', '1년 미만', '1-3년', '3-5년', '5년 이상'],
    required: true,
  },
  {
    id: '4',
    question: '필요한 자격증이나 교육과정을 이수하셨나요?',
    type: 'multiple',
    options: ['없음', '기초과정 이수', '심화과정 이수', '전문과정 이수'],
    required: true,
  },
  {
    id: '5',
    question: '신체적 제약이 있으신가요?',
    type: 'yesno',
    required: true,
  },
]

export function FormStepper() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [sessionId] = useState(() => uuidv4())

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      logger.logUserInteraction('eligibility_start', sessionId, {
        step: currentStep + 1,
        questionId: questions[currentStep].id,
        answer: answers[questions[currentStep].id]
      })
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    logger.logUserInteraction('eligibility_complete', sessionId, {
      answers,
      totalQuestions: questions.length
    })
    
    // 결과 계산 로직
    const result = calculateResult(answers)
    setCurrentStep(questions.length) // 결과 페이지로 이동
  }

  const calculateResult = (answers: Record<string, any>) => {
    let score = 0
    let totalQuestions = 0

    questions.forEach(question => {
      if (answers[question.id]) {
        totalQuestions++
        
        if (question.id === '1' && answers[question.id] === 'yes') score += 20
        if (question.id === '2' && answers[question.id] === 'yes') score += 20
        if (question.id === '3') {
          const experienceMap: Record<string, number> = {
            '없음': 0,
            '1년 미만': 10,
            '1-3년': 15,
            '3-5년': 20,
            '5년 이상': 25
          }
          score += experienceMap[answers[question.id]] || 0
        }
        if (question.id === '4') {
          const educationMap: Record<string, number> = {
            '없음': 0,
            '기초과정 이수': 10,
            '심화과정 이수': 15,
            '전문과정 이수': 20
          }
          score += educationMap[answers[question.id]] || 0
        }
        if (question.id === '5' && answers[question.id] === 'no') score += 15
      }
    })

    const percentage = (score / 100) * 100
    
    if (percentage >= 80) return { eligible: true, message: '응시 가능합니다!', score: percentage }
    if (percentage >= 60) return { eligible: true, message: '조건부 응시 가능합니다.', score: percentage }
    return { eligible: false, message: '현재 응시 자격이 없습니다.', score: percentage }
  }

  const currentQuestion = questions[currentStep]
  const isLastStep = currentStep === questions.length - 1
  const canProceed = answers[currentQuestion?.id] && currentQuestion?.required

  if (currentStep === questions.length) {
    const result = calculateResult(answers)
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">진단 결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl mb-4 ${result.eligible ? 'text-green-600' : 'text-red-600'}`}>
              {result.eligible ? '✓' : '✗'}
            </div>
            <h3 className="text-xl font-semibold mb-2">{result.message}</h3>
            <p className="text-muted-foreground">점수: {result.score.toFixed(1)}점</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">진단 상세 결과:</h4>
            {questions.map(question => (
              <div key={question.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm">{question.question}</span>
                <span className="text-sm font-medium">
                  {answers[question.id] || '미답변'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setCurrentStep(0)
                setAnswers({})
              }}
              className="flex-1"
            >
              다시 진단하기
            </Button>
            <Button className="flex-1">
              상담 신청하기
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {questions.map((_, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index < currentStep 
                ? 'bg-primary text-primary-foreground' 
                : index === currentStep 
                ? 'bg-primary/20 text-primary border-2 border-primary' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
            {index < questions.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                index < currentStep ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">질문 {currentStep + 1}/{questions.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
            
            {currentQuestion.type === 'yesno' && (
              <RadioGroup
                value={answers[currentQuestion.id]}
                onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${currentQuestion.id}-yes`} />
                  <Label htmlFor={`${currentQuestion.id}-yes`}>예</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${currentQuestion.id}-no`} />
                  <Label htmlFor={`${currentQuestion.id}-no`}>아니오</Label>
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === 'multiple' && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id]}
                onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                    <Label htmlFor={`${currentQuestion.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              이전
            </Button>
            
            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                진단 완료
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                다음
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




