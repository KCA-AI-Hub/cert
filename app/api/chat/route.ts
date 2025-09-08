import { NextRequest, NextResponse } from 'next/server'
import { chatRequestSchema } from '@/lib/validators'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'
import { findRelevantSources } from '@/lib/sources'
import { ChatRequest, ChatResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Zod를 사용한 서버사이드 유효성 검증
    const validatedData = chatRequestSchema.parse(body)
    
    logger.info('Chat API request received', {
      sessionId: validatedData.sessionId,
      messageLength: validatedData.message.length
    })

    // 근거 자료 찾기
    const citations = findRelevantSources(validatedData.message)
    
    // 시스템 프롬프트 정의
    const systemPrompt = `당신은 KCA 자격검정 업무도우미입니다.

역할: KCA 자격검정 담당자를 위한 업무 지원 도우미

답변 원칙:
1. KCA 법/고시/공식문서에 근거한 답변을 우선 제공
2. 불확실한 정보는 '확인 필요'로 명시
3. 민감정보 수집 금지
4. 특정인 신상 추정 금지

답변 형식:
1. 간결 요약 (핵심 정보)
2. 상세 설명 (구체적인 업무 절차)
3. 관련 근거 (제공된 근거 자료 기반)
4. 다음 행동 제안 (업무 처리 방법 등)

답변은 한국어로 제공하며, KCA 공식적이고 신뢰할 수 있는 정보를 제공해야 합니다.`

    // OpenAI API 호출 (실제 구현에서는 env.OPENAI_API_KEY 사용)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: validatedData.message
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || '죄송합니다. 답변을 생성할 수 없습니다.'

    logger.info('Chat API response sent', {
      sessionId: validatedData.sessionId,
      responseLength: aiResponse.length,
      citationsCount: citations.length
    })

    const chatResponse: ChatResponse = {
      answer: aiResponse,
      citations: citations,
      sessionId: validatedData.sessionId
    }

    return NextResponse.json(chatResponse)
  } catch (error) {
    logger.error('Chat API error', error as Error, {
      requestBody: await request.text()
    })
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      },
      { status: 500 }
    )
  }
}


