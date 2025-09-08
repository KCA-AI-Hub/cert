import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Supabase 클라이언트 생성 (클라이언트 사이드용)
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// 서버 사이드용 Supabase 클라이언트 (서비스 롤 키 사용)
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

// 데이터베이스 타입 정의 (필요시 추가)
export type Database = {
  // 여기에 데이터베이스 스키마 타입을 정의할 수 있습니다
  // 예: public: { Tables: { ... } }
}
