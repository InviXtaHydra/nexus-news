import { TrendingUp } from 'lucide-react'
import type { ArticleWithMeta } from '../../types/news'
import { SectionHeading } from '../news/SectionHeading'
import { ArticleCard } from '../news/ArticleCard'
import { Reveal } from '../ui/Reveal'

interface TrendingSectionProps {
  articles: ArticleWithMeta[]
}

export function TrendingSection({ articles }: TrendingSectionProps) {
  if (!articles.length) return null

  const lead = articles[0]
  const secondary = articles.slice(1, 5)

  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Curated Digest"
        title="Trending Stories"
        icon={TrendingUp}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Large featured trending card */}
        {lead && (
          <div className="lg:col-span-6">
            <Reveal delay={0.05} className="h-full">
              <ArticleCard article={lead} size="large" />
            </Reveal>
          </div>
        )}

        {/* 4 secondary cards in a 2x2 grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6">
          {secondary.map((article, index) => (
            <Reveal key={article.id} delay={0.1 + index * 0.08} className="h-full">
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
