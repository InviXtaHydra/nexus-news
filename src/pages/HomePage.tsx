import { useEffect, useState } from 'react'
import type { ArticleWithMeta } from '../types/news'
import { getFeatured, getTrending, getGeoStories, getLatest } from '../services/newsService'
import { HeroSkeleton } from '../components/ui/Skeletons'
import { HeroSection } from '../components/home/HeroSection'
import { Ticker } from '../components/home/Ticker'
import { TrendingSection } from '../components/home/TrendingSection'
import { GlobeSection } from '../components/home/GlobeSection'
import { LatestSection } from '../components/home/LatestSection'
import { NewsletterCard } from '../components/home/NewsletterCard'

export function HomePage() {
  const [featured, setFeatured] = useState<ArticleWithMeta | null>(null)
  const [trending, setTrending] = useState<ArticleWithMeta[]>([])
  const [geoStories, setGeoStories] = useState<ArticleWithMeta[]>([])
  const [allArticles, setAllArticles] = useState<ArticleWithMeta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [feat, trend, geo, latestPage] = await Promise.all([
          getFeatured(),
          getTrending(5),
          getGeoStories(),
          getLatest(0, 15),
        ])

        if (!active) return

        setFeatured(feat)
        setTrending(trend)
        setGeoStories(geo)
        setAllArticles(latestPage.items)
      } catch (err) {
        console.error('Failed to load news data', err)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [])

  if (loading || !featured) {
    return <HeroSkeleton />
  }

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Lead Article with 3D Canvas Background */}
      <HeroSection article={featured} />

      {/* 2. Breaking News Live Ticker */}
      <Ticker articles={allArticles} />

      {/* 3. Trending News 3D Grid */}
      <TrendingSection articles={trending} />

      {/* 4. 3D World Globe Dispatch Radar */}
      <GlobeSection stories={geoStories} />

      {/* 5. Latest Chronological Stream with Category Tabs and Load More */}
      <LatestSection initialArticles={allArticles} />

      {/* 6. Newsletter Subscription with Confetti */}
      <NewsletterCard />
    </div>
  )
}
