import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { ArticleWithMeta } from '../../types/news'
import { SmartImage } from '../ui/SmartImage'
import { CategoryBadge } from '../ui/CategoryBadge'
import { ArticleMeta } from './ArticleMeta'
import { TiltCard } from './TiltCard'

interface ArticleCardProps {
  article: ArticleWithMeta
  /** Larger type and image for lead stories in a grid. */
  size?: 'default' | 'large'
}

export const ArticleCard = memo(function ArticleCard({ article, size = 'default' }: ArticleCardProps) {
  const large = size === 'large'

  return (
    <TiltCard className="h-full">
      <article className="glass relative flex h-full flex-col overflow-hidden rounded-2xl shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset,0_20px_40px_-24px_rgb(0_0_0/0.5)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_var(--glow)]">
        <div className="relative">
          <SmartImage
            src={article.image.src}
            alt={article.image.alt}
            sizes={large ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className={large ? 'aspect-[16/9]' : 'aspect-[16/10]'}
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <CategoryBadge slug={article.category} className="absolute top-4 left-4 bg-black/40! text-white!" />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <h3
            className={`font-display leading-[1.1] tracking-tight text-fg ${
              large ? 'text-3xl sm:text-4xl' : 'text-2xl'
            }`}
          >
            <Link
              to={`/article/${article.slug}`}
              className="outline-none after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-accent"
            >
              {article.title}
            </Link>
          </h3>
          <p className={`text-sm leading-relaxed text-muted ${large ? 'sm:text-base' : 'line-clamp-3'}`}>
            {article.summary}
          </p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <ArticleMeta publishedAt={article.publishedAt} readingTime={article.readingTime} />
            <ArrowUpRight
              className="size-4 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-fg"
              aria-hidden
            />
          </div>
        </div>
      </article>
    </TiltCard>
  )
})
