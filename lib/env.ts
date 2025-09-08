import { z } from 'zod'

const envSchema = z.object({
  // OpenAI Configuration
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required').default('dummy-key-for-development'),
  OPENAI_MODEL: z.string().default('gpt-3.5-turbo'),
  
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('https://your-project.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required').default('dummy-anon-key-for-development'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required').default('dummy-service-role-key-for-development'),
  
  // Application Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default('KCA 자격검정 업무도우미'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('1.0.0'),
  
  // Logging Configuration
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),
  
  // Security Configuration
  NEXTAUTH_SECRET: z.string().min(1, 'NextAuth secret is required').default('dummy-secret-for-development'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>


