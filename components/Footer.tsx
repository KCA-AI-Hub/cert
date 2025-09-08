import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">KCA 자격검정 업무도우미</h3>
            <p className="text-sm text-muted-foreground">
              KCA 자격검정 담당자를 위한 업무 지원 시스템입니다.
              AI 업무도우미, 담당자 연락처, 응시자격 진단을 통해
              업무 효율성을 높여보세요.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">빠른 링크</h3>
            <nav className="space-y-2" aria-label="Footer navigation">
              <Link
                href="/chat"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
              >
                AI 업무도우미
              </Link>
              <Link
                href="/contacts"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
              >
                담당자 연락처
              </Link>
              <Link
                href="/eligibility"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
              >
                응시자격 진단
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">연락처</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>서울특별시 강남구 테헤란로 123</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <a
                  href="tel:02-1234-5678"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
                >
                  02-1234-5678
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a
                  href="mailto:info@kca.go.kr"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
                >
                  info@kca.go.kr
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 KCA 자격검정 업무도우미. 모든 권리 보유.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
              >
                이용약관
              </Link>
              <Link
                href="/accessibility"
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1 py-1"
              >
                웹접근성
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


