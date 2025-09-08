"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  FileText, 
  ExternalLink,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '@/lib/logger'
import { ChatMessage, Citation } from '@/lib/types'

export function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCitations, setShowCitations] = useState(true)
  const [sessionId] = useState(() => uuidv4())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // 챗봇 시작 로깅
    logger.logUserInteraction('chat_start', sessionId)
    // 초기 환영 메시지
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      content: `안녕하세요! KCA 자격검정 업무도우미입니다.

📋 **제공 서비스**
• KCA 자격검정 제도 안내
• 업무 절차 및 가이드라인
• 시험 운영 관련 문의
• 자격증 발급 및 관리

💡 **예시 질문**
• "필기시험 접수기간과 환불규정 알려줘"
• "시험 감독 업무 절차는 어떻게 되나요?"
• "자격증 발급 신청 방법을 알려주세요"
• "응시자격 심사 기준은 무엇인가요?"

모든 답변은 KCA 공식 문서에 근거하여 제공됩니다.`,
      role: 'assistant',
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [sessionId])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // 사용자 메시지 로깅
    logger.logUserInteraction('chat_message', sessionId, {
      message: userMessage.content,
      messageId: userMessage.id
    })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: data.answer,
        role: 'assistant',
        timestamp: new Date(),
        citations: data.citations || []
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReset = () => {
    setMessages([])
    setInputMessage('')
    logger.logUserInteraction('chat_reset', sessionId)
  }

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user'
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted border'
          }`}
        >
          <div className="flex items-start gap-2">
            {!isUser && (
              <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-3 w-3" />
                    <span className="text-xs font-medium">관련 근거 자료</span>
                  </div>
                  <div className="space-y-2">
                    {message.citations.map((citation, index) => (
                      <div key={index} className="text-xs bg-background/50 rounded p-2">
                        <div className="font-medium">{citation.title}</div>
                        <div className="text-muted-foreground">{citation.snippet}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
            {isUser && (
              <User className="h-4 w-4 mt-1 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderCitationsPanel = () => {
    const allCitations = messages
      .filter(msg => msg.citations && msg.citations.length > 0)
      .flatMap(msg => msg.citations || [])
      .slice(-6) // 최근 6개만 표시

    if (allCitations.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">질문하시면 관련 근거 자료가 여기에 표시됩니다</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">참고자료 (근거)</h3>
          <Badge variant="secondary" className="text-xs">
            {allCitations.length}개
          </Badge>
        </div>
        <div className="space-y-3">
          {allCitations.map((citation, index) => (
            <Card key={index} className="text-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {citation.title}
                  {citation.url && (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  문서 ID: {citation.sourceId}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {citation.snippet}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* 좌측: 채팅 히스토리 */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  KCA AI 업무도우미
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCitations(!showCitations)}
                    className="hidden lg:flex"
                  >
                    {showCitations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    근거 {showCitations ? '숨기기' : '보기'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    <RotateCcw className="h-4 w-4" />
                    초기화
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  공식 문서 기반
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  개인정보 미수집
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* 메시지 영역 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(renderMessage)}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 border">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">답변을 생성하고 있습니다...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="border-t p-4">
                <div className="space-y-3">
                  <Textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="자격검정 관련 질문을 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
                    disabled={isLoading}
                    className="min-h-[80px] resize-none"
                    aria-label="메시지 입력"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Enter 키를 눌러 메시지를 전송하세요. Shift + Enter로 줄바꿈할 수 있습니다.
                    </p>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                      aria-label="메시지 전송"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      전송
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 근거 자료 영역 */}
        {showCitations && (
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">참고자료 (근거)</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto">
                {renderCitationsPanel()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


