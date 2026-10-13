import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { ArticleWithMeta } from '../../types/news'
import { SmartImage } from '../ui/SmartImage'
import { CategoryBadge } from '../ui/CategoryBadge'
import { ArticleMeta } from './ArticleMeta'

export const ArticleListItem = memo(function ArticleListItem({ article }: { article: ArticleWithMeta }) {
  return (
    <article className="group relative flex gap-4 py-6 sm:gap-6">
      <SmartImage
        src={article.image.src}
        alt={article.image.alt}
        sizes="(min-width: 640px) 192px, 112px"
        widths={[240, 400]}
        className="aspect-[4/3] w-28 shrink-0 rounded-xl sm:w-48"
        imgClassName="transition-transform duration-700 group-hover:scale-105"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <CategoryBadge slug={article.category} className="self-start" />
        <h3 className="font-display text-xl leading-snug tracking-tight sm:text-2xl">
          <Link
            to={`/article/${article.slug}`}
            className="bg-gradient-to-r from-accent to-accent-2 bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px] after:absolute after:inset-0 after:content-['']"
          >
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm max-sm:hidden leading-relaxed text-muted">{article.summary}</p>
        <ArticleMeta publishedAt={article.publishedAt} readingTime={article.readingTime} className="mt-1" />
      </div>
    </article>
  )
})
