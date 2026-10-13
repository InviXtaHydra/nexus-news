import { useState, useMemo } from 'react'
import { Clock, Filter, LoaderCircle, ChevronDown } from 'lucide-react'
import type { ArticleWithMeta, CategorySlug } from '../../types/news'
import { SectionHeading } from '../news/SectionHeading'
import { ArticleListItem } from '../news/ArticleListItem'
import { categories } from '../../data/categories'
import { Reveal } from '../ui/Reveal'

interface LatestSectionProps {
  initialArticles: ArticleWithMeta[]
}

const PAGE_SIZE = 4

export function LatestSection({ initialArticles }: LatestSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') return initialArticles
    return initialArticles.filter((a) => a.category === selectedCategory)
  }, [initialArticles, selectedCategory])

  const visibleArticles = useMemo(() => {
    return filtered.slice(0, visibleCount)
  }, [filtered, visibleCount])

  const hasMore = visibleCount < filtered.length

  const handleLoadMore = () => {
    setLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE)
      setLoadingMore(false)
    }, 400)
  }

  const handleCategorySelect = (slug: CategorySlug | 'all') => {
    setSelectedCategory(slug)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeading
        eyebrow="Continuous Stream"
        title="Latest Dispatches"
        icon={Clock}
        action={
          <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-full border border-line bg-surface">
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted hover:text-fg'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => handleCategorySelect(c.slug)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                  selectedCategory === c.slug
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted hover:text-fg'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        }
      />

      {/* Mobile filter pills */}
      <div className="flex sm:hidden overflow-x-auto gap-2 pb-4 -mt-4 mb-4 scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategorySelect('all')}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedCategory === 'all'
              ? 'bg-accent text-white shadow-sm'
              : 'border border-line bg-surface text-muted'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => handleCategorySelect(c.slug)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedCategory === c.slug
                ? 'bg-accent text-white shadow-sm'
                : 'border border-line bg-surface text-muted'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Article List with Dividers */}
      <div className="divide-y divide-line rounded-2xl border border-line bg-surface/50 p-2 sm:p-6 backdrop-blur-sm">
        {visibleArticles.length === 0 ? (
          <div className="py-12 text-center text-muted">
            <Filter className="mx-auto size-8 text-faint mb-2" />
            <p>No articles found for this topic.</p>
          </div>
        ) : (
          visibleArticles.map((article, index) => (
            <Reveal key={article.id} delay={index * 0.04}>
              <ArticleListItem article={article} />
            </Reveal>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group flex items-center gap-2 rounded-full border border-line bg-surface-strong px-8 py-3.5 text-sm font-semibold text-fg shadow-lg transition-all hover:border-accent hover:shadow-accent/10 disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <LoaderCircle className="size-4 animate-spin text-accent" />
                <span>Loading dispatches…</span>
              </>
            ) : (
              <>
                <span>Load More Stories</span>
                <ChevronDown className="size-4 text-faint transition group-hover:translate-y-0.5" />
              </>
            )}
          </button>
          <p className="font-mono text-xs text-faint">
            Showing {visibleArticles.length} of {filtered.length} stories
          </p>
        </div>
      )}
    </section>
  )
}
