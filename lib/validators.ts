import { z } from 'zod'

// Chat validation schemas
export const chatMessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, '메시지를 입력해주세요').max(1000, '메시지는 1000자 이내로 입력해주세요'),
  role: z.enum(['user', 'assistant']),
  timestamp: z.date(),
})

export const chatRequestSchema = z.object({
  message: z.string().min(1, '메시지를 입력해주세요').max(1000, '메시지는 1000자 이내로 입력해주세요'),
  sessionId: z.string().uuid().optional(),
})

// Contact validation schemas
export const contactSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, '이름을 입력해주세요'),
  department: z.string().min(1, '부서를 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  phone: z.string().regex(/^[0-9-]+$/, '올바른 전화번호를 입력해주세요'),
  role: z.string().min(1, '담당 업무를 입력해주세요'),
})

// Eligibility validation schemas
export const eligibilityQuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1, '질문을 입력해주세요'),
  type: z.enum(['yesno', 'multiple', 'text']),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(true),
})

export const eligibilityAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.union([z.string(), z.boolean(), z.array(z.string())]),
})

export const eligibilityRequestSchema = z.object({
  answers: z.array(eligibilityAnswerSchema),
  sessionId: z.string().uuid().optional(),
})

// User interaction logging schema
export const userInteractionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['chat_start', 'chat_message', 'eligibility_start', 'eligibility_complete', 'contact_view']),
  sessionId: z.string().uuid(),
  timestamp: z.date(),
  data: z.record(z.any()).optional(),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type Contact = z.infer<typeof contactSchema>
export type EligibilityQuestion = z.infer<typeof eligibilityQuestionSchema>
export type EligibilityAnswer = z.infer<typeof eligibilityAnswerSchema>
export type EligibilityRequest = z.infer<typeof eligibilityRequestSchema>
export type UserInteraction = z.infer<typeof userInteractionSchema>




