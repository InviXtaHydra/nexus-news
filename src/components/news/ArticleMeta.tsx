import { Clock } from 'lucide-react'
import { formatRelative } from '../../lib/format'

interface ArticleMetaProps {
  publishedAt: string
  readingTime: number
  className?: string
}

export function ArticleMeta({ publishedAt, readingTime, className = '' }: ArticleMetaProps) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[11px] tracking-wide text-faint uppercase ${className}`}>
      <time dateTime={publishedAt}>{formatRelative(publishedAt)}</time>
      <span className="size-1 rounded-full bg-current opacity-50" aria-hidden />
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3" aria-hidden />
        {readingTime} min read
      </span>
    </div>
  )
}
