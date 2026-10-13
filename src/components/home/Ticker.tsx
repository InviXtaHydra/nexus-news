import { Link } from 'react-router-dom'
import { Radio } from 'lucide-react'
import type { ArticleWithMeta } from '../../types/news'

interface TickerProps {
  articles: ArticleWithMeta[]
}

export function Ticker({ articles }: TickerProps) {
  if (!articles.length) return null

  // Duplicate the list to ensure seamless infinite marquee scrolling
  const items = [...articles, ...articles]

  return (
    <div className="relative border-y border-line bg-surface/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center overflow-hidden">
        {/* Live indicator badge */}
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-line bg-surface-strong px-4 py-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-red-500" />
          </span>
          <span className="eyebrow flex items-center gap-1.5 text-xs text-fg">
            <Radio className="size-3 text-red-500" />
            <span>WIRE</span>
          </span>
        </div>

        {/* Marquee ticker track */}
        <div className="group relative flex overflow-x-hidden">
          <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap group-hover:[animation-play-state:paused]">
            {items.map((art, idx) => (
              <div key={`${art.id}-${idx}`} className="flex items-center">
                <Link
                  to={`/article/${art.slug}`}
                  className="mx-5 text-xs font-medium text-muted transition hover:text-accent-fg"
                >
                  <span className="font-mono text-[10px] text-accent uppercase mr-2">[{art.category}]</span>
                  {art.title}
                </Link>
                <span className="text-line select-none">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
