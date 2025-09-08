import { Hero } from '@/components/Hero'
import { ServiceCards } from '@/components/ServiceCards'
import { FeatureGrid } from '@/components/FeatureGrid'
import { RecentNotices } from '@/components/RecentNotices'
import { NoticeTicker } from '@/components/NoticeTicker'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <NoticeTicker />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ServiceCards />
        <FeatureGrid />
        <RecentNotices />
      </main>
    </div>
  )
}



