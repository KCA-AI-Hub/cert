9# 공공기관 자격검정 서비스

Next.js 14 기반의 공공기관 자격검정 웹서비스입니다. AI 챗봇, 담당자 연락처, 응시자격 진단 기능을 제공합니다.

## 🚀 주요 기능

- **AI 챗봇**: 자격검정 관련 질문에 대한 24시간 AI 상담 서비스
- **담당자 연락처**: 자격검정 담당자 연락처 정보 제공
- **응시자격 진단**: 단계별 질문을 통한 응시자격 진단
- **접근성**: WAI-ARIA, 키보드 내비게이션, 명도대비 지원
- **다크모드**: 라이트/다크 테마 전환 지원
- **보안**: Zod를 통한 서버사이드 유효성 검증, PII 최소 수집

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **UI Components**: Radix UI
- **Validation**: Zod
- **AI**: OpenAI API
- **Logging**: 커스텀 로거 (콘솔 → 추후 Log API 추상화)
- **Deployment**: Vercel (Edge Runtime 지원)

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── (marketing)/       # 마케팅 페이지
│   │   └── page.tsx       # 홈페이지
│   ├── chat/              # AI 챗봇
│   │   └── page.tsx
│   ├── contacts/          # 담당자 연락처
│   │   └── page.tsx
│   ├── eligibility/       # 응시자격 진단
│   │   └── page.tsx
│   ├── api/               # API 라우트
│   │   └── chat/
│   │       └── route.ts0
│   ├── globals.css        # 전역 스타일
│   └── layout.tsx         # 루트 레이아웃
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── NavBar.tsx        # 네비게이션 바
│   ├── Footer.tsx        # 푸터
│   ├── PageHeader.tsx    # 페이지 헤더
│   ├── DataTable.tsx     # 데이터 테이블
│   ├── FormStepper.tsx   # 폼 스테퍼
│   └── ChatUI.tsx        # 챗봇 UI
├── lib/                  # 유틸리티
│   ├── env.ts           # 환경 변수 타입 정의
│   ├── validators.ts    # Zod 스키마
│   ├── logger.ts        # 로깅 유틸리티
│   └── utils.ts         # 공용 유틸리티
└── public/              # 정적 파일
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Application Configuration
NEXT_PUBLIC_APP_NAME="공공기관 자격검정 서비스"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Logging Configuration
LOG_LEVEL=INFO

# Security Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📋 접근성 기능

- **WAI-ARIA**: 시맨틱 HTML과 ARIA 속성 사용
- **키보드 내비게이션**: 모든 인터랙션 요소에 키보드 접근 지원
- **명도대비**: WCAG AA 기준 충족
- **폰트 크기 조절**: 브라우저 기본 기능 지원
- **스크린 리더**: 적절한 라벨과 설명 제공

## 🔒 보안 기능

- **환경 변수 분리**: 민감한 정보는 .env 파일에 저장
- **서버사이드 유효성 검증**: Zod를 통한 입력 데이터 검증
- **PII 최소 수집**: 개인정보 수집 최소화
- **로깅 수준 관리**: INFO 레벨 로깅으로 민감 정보 보호

## 📊 사용자 상호작용 로깅

익명 UUID를 사용하여 사용자 상호작용을 로깅합니다:

- 챗봇 질문/답변
- 진단 시작/완료
- 페이지 방문

현재는 콘솔에 로깅되며, 추후 외부 로깅 서비스로 추상화 예정입니다.

## 🚀 배포

### Vercel 배포

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포

### Edge Runtime

API 라우트는 가능한 경우 Edge Runtime을 사용하여 빠른 응답을 제공합니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.




