import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Bookmark, Sparkles, Clock, MapPin } from 'lucide-react'
import type { ArticleWithMeta } from '../../types/news'
import HeroScene from '../three/HeroScene'
import { CategoryBadge } from '../ui/CategoryBadge'
import { SmartImage } from '../ui/SmartImage'
import { useBookmarks } from '../../context/BookmarkContext'
import { formatRelative } from '../../lib/format'

interface HeroSectionProps {
  article: ArticleWithMeta
}

export function HeroSection({ article }: HeroSectionProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const saved = isBookmarked(article.id)

  return (
    <section className="relative min-h-[85vh] pt-24 pb-12 sm:pt-28 lg:min-h-[90vh] lg:py-24 flex items-center overflow-hidden">
      {/* 3D Interactive Background Scene */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <HeroScene />
      </div>

      <div className="container-page relative z-10 w-full">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 lg:col-span-7"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-red-500 uppercase">
                <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
                BREAKING DISPATCH
              </span>
              <CategoryBadge slug={article.category} />
              {article.location && (
                <span className="inline-flex items-center gap-1 font-mono text-xs text-faint">
                  <MapPin className="size-3 text-accent" />
                  {article.location.name}
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.05] tracking-tight text-fg">
              {article.title}
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
              {article.summary}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-full bg-accent/15 text-accent-fg font-semibold text-xs border border-accent/20">
                  {article.author.name[0]}
                </div>
                <div>
                  <div className="font-medium text-fg">{article.author.name}</div>
                  <div className="text-[11px] text-faint">{article.author.role}</div>
                </div>
              </div>

              <span className="text-line">•</span>

              <div className="flex items-center gap-1.5 font-mono text-faint">
                <Clock className="size-3.5" />
                <span>{article.readingTime} min read</span>
              </div>

              <span className="text-line">•</span>

              <span className="font-mono text-faint">{formatRelative(article.publishedAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                to={`/article/${article.slug}`}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-accent hover:text-white"
              >
                <span>Read Full Story</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => toggleBookmark(article.id)}
                className={`grid size-12 place-items-center rounded-full border transition ${
                  saved
                    ? 'border-accent bg-accent/15 text-accent-fg'
                    : 'border-line text-muted hover:border-fg/30 hover:text-fg hover:bg-fg/5'
                }`}
                title={saved ? 'Remove bookmark' : 'Bookmark story'}
                aria-label={saved ? 'Remove bookmark' : 'Bookmark story'}
              >
                <Bookmark className={`size-5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.div>

          {/* Visual Showcase with Glass & Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="glow-border relative overflow-hidden rounded-3xl p-1 shadow-2xl">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-[22px]">
                <SmartImage
                  src={article.image.src}
                  alt={article.image.alt}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  widths={[600, 1000, 1400]}
                  priority
                  className="size-full"
                  imgClassName="transition-transform duration-1000 hover:scale-105"
                />

                {/* Ambient glow inside card */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating caption chip */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/50 p-3 backdrop-blur-md border border-white/10 text-xs text-white/90">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Sparkles className="size-3 text-accent" />
                    Editorial Lead Story
                  </span>
                  <span className="text-white/60 text-[10px]">Photo: {article.image.credit}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
