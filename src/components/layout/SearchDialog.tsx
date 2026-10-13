import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CornerDownLeft, LoaderCircle, Search, X } from 'lucide-react'
import { searchArticles } from '../../services/newsService'
import type { ArticleWithMeta } from '../../types/news'
import { CategoryBadge } from '../ui/CategoryBadge'
import { SmartImage } from '../ui/SmartImage'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

const SUGGESTIONS = ['Climate', 'AI', 'Space', 'Markets', 'Film']
const MAX_RESULTS = 6

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ArticleWithMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Debounced live search.
  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    let active = true
    const timer = setTimeout(() => {
      searchArticles(q).then((r) => {
        if (!active) return
        setResults(r)
        setActiveIndex(0)
        setLoading(false)
      })
    }, 160)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
      setQuery('')
    }
  }, [open])

  const visible = results.slice(0, MAX_RESULTS)

  function go(path: string) {
    onClose()
    navigate(path)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, visible.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = visible[activeIndex]
      if (pick && !e.metaKey && !e.ctrlKey) go(`/article/${pick.slug}`)
      else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search articles"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface-strong/95 shadow-[0_40px_120px_-30px_var(--glow)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              {loading ? (
                <LoaderCircle className="size-5 shrink-0 animate-spin text-accent-fg" aria-hidden />
              ) : (
                <Search className="size-5 shrink-0 text-faint" aria-hidden />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search headlines, topics, places…"
                className="h-16 w-full bg-transparent text-lg text-fg outline-none placeholder:text-faint"
                role="combobox"
                aria-expanded={visible.length > 0}
                aria-controls={listId}
                aria-activedescendant={visible[activeIndex] ? `${listId}-${activeIndex}` : undefined}
                aria-autocomplete="list"
              />
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-faint transition hover:bg-fg/5 hover:text-fg"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!query.trim() ? (
                <div className="p-4">
                  <p className="eyebrow mb-3 text-faint">Popular topics</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="rounded-full border border-line px-3.5 py-1.5 text-sm text-muted transition hover:border-accent/50 hover:text-fg"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : !loading && visible.length === 0 ? (
                <p className="p-8 text-center text-muted">
                  No stories match <span className="text-fg">“{query}”</span>.
                </p>
              ) : (
                <ul id={listId} role="listbox" aria-label="Results">
                  {visible.map((a, i) => (
                    <li
                      key={a.id}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === activeIndex}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => go(`/article/${a.slug}`)}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-colors ${
                        i === activeIndex ? 'bg-accent/10' : ''
                      }`}
                    >
                      <SmartImage
                        src={a.image.src}
                        alt=""
                        sizes="80px"
                        widths={[160]}
                        className="aspect-[4/3] w-16 shrink-0 rounded-lg"
                      />
                      <div className="min-w-0 flex-1">
                        <CategoryBadge slug={a.category} className="mb-1 !px-2 !py-0.5" />
                        <p className="truncate font-medium text-fg">{a.title}</p>
                      </div>
                      {i === activeIndex && <CornerDownLeft className="size-4 shrink-0 text-faint" aria-hidden />}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {query.trim() && results.length > 0 && (
              <button
                type="button"
                onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                className="flex w-full items-center justify-between border-t border-line px-5 py-3.5 text-sm text-muted transition hover:bg-fg/5 hover:text-fg"
              >
                <span>
                  See all {results.length} result{results.length === 1 ? '' : 's'} for “{query.trim()}”
                </span>
                <ArrowRight className="size-4" aria-hidden />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
