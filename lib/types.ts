export interface SourceSnippet {
  id: string
  content: string
  keywords: string[]
}

export interface Source {
  id: string
  title: string
  source: string
  url?: string
  snippets: SourceSnippet[]
}

export interface Citation {
  title: string
  sourceId: string
  snippet: string
  url?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: Citation[]
}

export interface ChatRequest {
  messages: ChatMessage[]
  sessionId?: string
}

export interface ChatResponse {
  answer: string
  citations: Citation[]
  sessionId?: string
}


