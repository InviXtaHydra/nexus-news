import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Share2,
  Check,
  MapPin,
  Tag,
  Quote,
  Sparkles,
} from 'lucide-react'
import { getArticle, getRelated } from '../services/newsService'
import type { ArticleWithMeta } from '../types/news'
import { ArticleSkeleton } from '../components/ui/Skeletons'
import { CategoryBadge } from '../components/ui/CategoryBadge'
import { SmartImage } from '../components/ui/SmartImage'
import { ArticleCard } from '../components/news/ArticleCard'
import { SectionHeading } from '../components/news/SectionHeading'
import { XIcon, LinkedInIcon } from '../components/ui/BrandIcons'
import { useBookmarks } from '../context/BookmarkContext'
import { formatLongDate } from '../lib/format'

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<ArticleWithMeta | null>(null)
  const [related, setRelated] = useState<ArticleWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!slug) return

    let active = true
    setLoading(true)

    async function load() {
      if (!slug) return
      const found = await getArticle(slug)
      if (!active) return
      if (found) {
        setArticle(found)
        const rel = await getRelated(found, 3)
        if (active) setRelated(rel)
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [slug])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <ArticleSkeleton />
  }

  if (!article) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="font-display text-4xl">Article Not Found</h1>
        <p className="mt-4 text-muted">The dispatch you are looking for does not exist or has been archived.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    )
  }

  const saved = isBookmarked(article.id)

  return (
    <>
      {/* Scroll Reading Progress Bar at the very top of page */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-accent via-accent-2 to-sky-400"
        style={{ scaleX }}
      />

      <article className="container-page pt-28 pb-20">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
          <Link
            to="/"
            className="group flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider transition hover:text-fg"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-faint">Share story:</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-fg/30 hover:text-fg"
              title="Copy link"
              aria-label="Copy link"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-fg/30 hover:text-fg"
              title="Share on X"
              aria-label="Share on X"
            >
              <XIcon className="size-3.5" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="grid size-8 place-items-center rounded-lg border border-line text-muted transition hover:border-fg/30 hover:text-fg"
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
            >
              <LinkedInIcon className="size-3.5" />
            </a>
          </div>
        </div>

        {/* Article Header */}
        <header className="mx-auto max-w-4xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CategoryBadge slug={article.category} />
            {article.location && (
              <span className="inline-flex items-center gap-1 font-mono text-xs text-faint">
                <MapPin className="size-3 text-accent" />
                {article.location.name}
              </span>
            )}
            <span className="font-mono text-xs text-faint flex items-center gap-1">
              <Clock className="size-3" />
              {article.readingTime} min read
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.06] tracking-tight text-fg">
            {article.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted font-normal">
            {article.summary}
          </p>

          {/* Author Byline & Bookmark */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-y border-line py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-accent/20 text-accent-fg font-bold">
                {article.author.name[0]}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-fg">{article.author.name}</div>
                <div className="text-xs text-faint">{article.author.role}</div>
              </div>
            </div>

            <div className="hidden sm:block text-line">•</div>

            <time dateTime={article.publishedAt} className="font-mono text-xs text-faint">
              {formatLongDate(article.publishedAt)}
            </time>

            <div className="hidden sm:block text-line">•</div>

            <button
              type="button"
              onClick={() => toggleBookmark(article.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                saved
                  ? 'border border-accent bg-accent/15 text-accent-fg'
                  : 'border border-line bg-surface text-muted hover:text-fg hover:border-fg/30'
              }`}
            >
              <Bookmark className={`size-3.5 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? 'Saved to list' : 'Bookmark story'}</span>
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/10] overflow-hidden rounded-3xl border border-line shadow-2xl">
            <SmartImage
              src={article.image.src}
              alt={article.image.alt}
              sizes="(min-width: 1280px) 1120px, 95vw"
              widths={[800, 1200, 1800]}
              priority
              className="size-full"
            />
          </div>
          <p className="mt-2 text-center font-mono text-xs text-faint">
            {article.image.alt} • Photo by {article.image.credit}
          </p>
        </div>

        {/* Article Body */}
        <div className="mx-auto mt-12 max-w-3xl">
          {/* Pull quote highlight if present */}
          {article.quote && (
            <div className="my-8 rounded-2xl border-l-4 border-accent bg-accent/5 p-6 sm:p-8 backdrop-blur-sm">
              <Quote className="size-8 text-accent/50 mb-2" />
              <blockquote className="font-display text-2xl sm:text-3xl italic text-fg leading-snug">
                {article.quote}
              </blockquote>
            </div>
          )}

          {/* Prose Content */}
          <div className="prose-article space-y-6 text-lg leading-relaxed text-fg/90">
            {article.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <span className="flex items-center gap-1.5 font-mono text-xs text-faint uppercase mr-2">
              <Tag className="size-3 text-accent" /> Tags:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Card Footer */}
          <div className="mt-10 rounded-2xl border border-line bg-surface/50 p-6 backdrop-blur-sm flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white font-bold text-lg">
              {article.author.name[0]}
            </div>
            <div>
              <p className="font-mono text-xs text-accent-fg uppercase tracking-wider">Written By</p>
              <h4 className="font-display text-xl text-fg">{article.author.name}</h4>
              <p className="text-xs text-muted mt-1">
                {article.author.role} at Nexus News Media. Covering critical developments with an analytical, on-the-ground lens.
              </p>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {related.length > 0 && (
          <section className="mx-auto mt-24 max-w-6xl border-t border-line pt-16">
            <SectionHeading
              eyebrow="Continue Reading"
              title="Related Dispatches"
              icon={Sparkles}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relArt) => (
                <ArticleCard key={relArt.id} article={relArt} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
