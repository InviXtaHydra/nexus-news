import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Filter } from 'lucide-react'
import type { ArticleWithMeta, CategorySlug } from '../types/news'
import { getCategory, isCategorySlug } from '../data/categories'
import { getByCategory } from '../services/newsService'
import { ArticleCard } from '../components/news/ArticleCard'
import { CardSkeleton } from '../components/ui/Skeletons'
import { Reveal } from '../components/ui/Reveal'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [articles, setArticles] = useState<ArticleWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const category = slug && isCategorySlug(slug) ? getCategory(slug) : undefined

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!slug || !isCategorySlug(slug)) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    setSelectedTag('all')

    getByCategory(slug as CategorySlug).then((data) => {
      if (active) {
        setArticles(data)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [slug])

  // Extract all unique tags in this category
  const allTags = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)))
    return Array.from(set)
  }, [articles])

  // Filter articles based on tag
  const filteredArticles = useMemo(() => {
    if (selectedTag === 'all') return articles
    return articles.filter((a) => a.tags.includes(selectedTag))
  }, [articles, selectedTag])

  if (!category) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="font-display text-4xl">Category Not Found</h1>
        <p className="mt-4 text-muted">The requested topic does not exist.</p>
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

  const featured = filteredArticles[0]
  const rest = filteredArticles.slice(1)

  return (
    <div className="container-page pt-28 pb-24">
      {/* Back button */}
      <div className="mb-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider transition hover:text-fg"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>All Dispatches</span>
        </Link>
      </div>

      {/* Category Hero Banner */}
      <header className="mb-12 rounded-3xl border border-line bg-gradient-to-br from-surface to-surface-strong/70 p-8 sm:p-12 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="eyebrow rounded-full bg-accent/10 px-3 py-1 text-accent-fg border border-accent/20">
            Category Archive
          </span>
          <span className="font-mono text-xs text-faint">
            {articles.length} dispatches recorded
          </span>
        </div>

        <h1 className="mt-4 font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight text-fg">
          {category.name}
        </h1>

        <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted">
          {category.description}
        </p>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <span className="flex items-center gap-1.5 font-mono text-xs text-faint mr-2">
              <Filter className="size-3" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag('all')}
              className={`rounded-full px-3.5 py-1 text-xs font-mono transition ${
                selectedTag === 'all'
                  ? 'bg-accent text-white shadow-sm'
                  : 'border border-line bg-surface text-muted hover:text-fg'
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-3.5 py-1 text-xs font-mono transition ${
                  selectedTag === tag
                    ? 'bg-accent text-white shadow-sm'
                    : 'border border-line bg-surface text-muted hover:text-fg'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-20 text-center text-muted">
          <p>No stories found for tag #{selectedTag}.</p>
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            className="mt-4 text-sm font-semibold text-accent-fg hover:underline"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Featured in Category */}
          {featured && (
            <section>
              <div className="mb-4 flex items-center gap-2 font-mono text-xs text-faint uppercase">
                <Sparkles className="size-3 text-accent" />
                Featured in {category.name}
              </div>
              <ArticleCard article={featured} size="large" />
            </section>
          )}

          {/* Remaining in Category */}
          {rest.length > 0 && (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((art, idx) => (
                <Reveal key={art.id} delay={idx * 0.05}>
                  <ArticleCard article={art} />
                </Reveal>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
