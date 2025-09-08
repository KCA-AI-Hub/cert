import sources from '../fixtures/sources.json'
import { Source, Citation } from './types'

export function findRelevantSources(query: string, maxResults: number = 3): Citation[] {
  const queryLower = query.toLowerCase()
  const keywords = queryLower.split(/\s+/).filter(word => word.length > 1)
  
  const relevantCitations: Citation[] = []
  
  sources.forEach((source: Source) => {
    source.snippets.forEach(snippet => {
      // 키워드 매칭 점수 계산
      let score = 0
      keywords.forEach(keyword => {
        if (snippet.keywords.some(k => k.toLowerCase().includes(keyword))) {
          score += 2
        }
        if (snippet.content.toLowerCase().includes(keyword)) {
          score += 1
        }
      })
      
      if (score > 0) {
        relevantCitations.push({
          title: source.title,
          sourceId: source.id,
          snippet: snippet.content,
          url: source.url
        })
      }
    })
  })
  
  // 점수 순으로 정렬하고 상위 결과만 반환
  return relevantCitations
    .sort((a, b) => {
      const aScore = calculateRelevanceScore(a, keywords)
      const bScore = calculateRelevanceScore(b, keywords)
      return bScore - aScore
    })
    .slice(0, maxResults)
}

function calculateRelevanceScore(citation: Citation, keywords: string[]): number {
  let score = 0
  const content = citation.snippet.toLowerCase()
  const title = citation.title.toLowerCase()
  
  keywords.forEach(keyword => {
    if (title.includes(keyword)) score += 3
    if (content.includes(keyword)) score += 1
  })
  
  return score
}

export function getAllSources(): Source[] {
  return sources as Source[]
}


