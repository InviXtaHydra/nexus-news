import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ArrowLeft, Filter, Sparkles } from 'lucide-react'
import { searchArticles } from '../services/newsService'
import type { ArticleWithMeta, CategorySlug } from '../types/news'
import { categories } from '../data/categories'
import { ArticleCard } from '../components/news/ArticleCard'
import { CardSkeleton } from '../components/ui/Skeletons'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [inputVal, setInputVal] = useState(q)
  const [results, setResults] = useState<ArticleWithMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all')

  useEffect(() => {
    setInputVal(q)
    if (!q.trim()) {
      setResults([])
      return
    }

    let active = true
    setLoading(true)

    searchArticles(q.trim()).then((data) => {
      if (active) {
        setResults(data)
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [q])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() })
    }
  }

  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return results
    return results.filter((r) => r.category === selectedCategory)
  }, [results, selectedCategory])

  return (
    <div className="container-page pt-28 pb-24">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider transition hover:text-fg"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Search Header */}
      <div className="mb-10 max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-fg">
          Search Nexus Archive
        </h1>
        <p className="mt-2 text-sm text-muted">
          Query full text across dispatches, correspondents, topics, and field locations.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-faint" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search by keywords, people, technology…"
              className="w-full rounded-2xl border border-line bg-surface-strong/90 py-3.5 pr-4 pl-12 text-base text-fg outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Filter Chips */}
      {results.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-line pb-6">
          <span className="flex items-center gap-1.5 font-mono text-xs text-faint mr-2">
            <Filter className="size-3" /> Filter by:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-3.5 py-1 text-xs font-mono transition ${
              selectedCategory === 'all'
                ? 'bg-accent text-white shadow-sm'
                : 'border border-line bg-surface text-muted hover:text-fg'
            }`}
          >
            All Results ({results.length})
          </button>
          {categories.map((c) => {
            const count = results.filter((r) => r.category === c.slug).length
            if (count === 0) return null
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`rounded-full px-3.5 py-1 text-xs font-mono transition ${
                  selectedCategory === c.slug
                    ? 'bg-accent text-white shadow-sm'
                    : 'border border-line bg-surface text-muted hover:text-fg'
                }`}
              >
                {c.name} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Results Content */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : !q.trim() ? (
        <div className="rounded-2xl border border-line bg-surface/40 p-12 text-center text-muted">
          <Sparkles className="mx-auto size-8 text-accent mb-3" />
          <p className="text-base text-fg font-medium">Ready to search</p>
          <p className="mt-1 text-xs text-faint">Try searching for keywords like "ocean", "photonic", "inflation", or "Webb".</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface/40 p-12 text-center text-muted">
          <p className="text-lg text-fg font-medium">No results found for “{q}”</p>
          <p className="mt-2 text-sm text-faint">Check your spelling or try alternative keywords.</p>
        </div>
      ) : (
        <div>
          <p className="mb-6 font-mono text-xs text-faint">
            Found {filteredResults.length} matching stor{filteredResults.length === 1 ? 'y' : 'ies'} for “{q}”
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResults.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
