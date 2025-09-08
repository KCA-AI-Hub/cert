"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, FileCheck, Megaphone } from "lucide-react"

export function ServiceCards() {
  const services = [
    {
      title: "AI 업무도우미",
      description: "자격검정 업무 관련 질문을 AI에게 물어보세요",
      icon: MessageSquare,
      href: "/chat",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "담당자 연락처",
      description: "KCA 자격검정 담당자 연락처 정보",
      icon: Users,
      href: "/contacts",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "응시자격 진단",
      description: "응시자격을 진단해보세요",
      icon: FileCheck,
      href: "/eligibility",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "공지사항",
      description: "KCA 자격검정 관련 공지사항 및 안내",
      icon: Megaphone,
      href: "/notices",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ]

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          제공 서비스
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          KCA 자격검정 담당자를 위한 종합적인 업무 지원 시스템입니다
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Link key={service.title} href={service.href}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
                <Button 
                  variant="ghost" 
                  className="mt-4 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                >
                  바로가기 →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
