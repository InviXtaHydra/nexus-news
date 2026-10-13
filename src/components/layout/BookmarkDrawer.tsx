import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, Clock, Trash2, X, ArrowRight, BookOpen } from 'lucide-react'
import { useBookmarks } from '../../context/BookmarkContext'
import { SmartImage } from '../ui/SmartImage'
import { CategoryBadge } from '../ui/CategoryBadge'
import { formatRelative } from '../../lib/format'

export function BookmarkDrawer() {
  const { isDrawerOpen, closeDrawer, savedArticles, toggleBookmark } = useBookmarks()

  useEffect(() => {
    if (!isDrawerOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isDrawerOpen, closeDrawer])

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-surface-strong/95 shadow-2xl backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Saved reading list"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent-fg">
                  <Bookmark className="size-4 fill-current" />
                </span>
                <div>
                  <h2 className="font-display text-2xl tracking-tight text-fg">Reading List</h2>
                  <p className="text-xs text-muted">
                    {savedArticles.length} article{savedArticles.length === 1 ? '' : 's'} saved offline
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-fg/5 hover:text-fg"
                aria-label="Close reading list"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {savedArticles.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid size-16 place-items-center rounded-2xl border border-dashed border-line text-faint">
                    <BookOpen className="size-8" />
                  </div>
                  <h3 className="mt-4 font-display text-xl text-fg">No stories saved yet</h3>
                  <p className="mt-1 max-w-xs text-sm text-muted">
                    Click the bookmark icon on any article card or story page to keep track of what you want to read next.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {savedArticles.map((article) => (
                    <li
                      key={article.id}
                      className="group relative flex gap-4 rounded-xl border border-line bg-surface p-3 transition hover:border-accent/40"
                    >
                      <SmartImage
                        src={article.image.src}
                        alt=""
                        sizes="96px"
                        widths={[200]}
                        className="aspect-[4/3] w-24 shrink-0 rounded-lg"
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <CategoryBadge slug={article.category} className="!px-2 !py-0.5 !text-[10px]" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleBookmark(article.id)
                              }}
                              className="text-faint transition hover:text-red-500"
                              title="Remove from saved"
                              aria-label={`Remove ${article.title} from reading list`}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                          <h4 className="mt-1 line-clamp-2 text-sm font-semibold text-fg">
                            <Link
                              to={`/article/${article.slug}`}
                              onClick={closeDrawer}
                              className="hover:text-accent-fg"
                            >
                              {article.title}
                            </Link>
                          </h4>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-faint">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {article.readingTime} min
                          </span>
                          <span>{formatRelative(article.publishedAt)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {savedArticles.length > 0 && (
              <div className="border-t border-line p-5">
                <Link
                  to={`/article/${savedArticles[0].slug}`}
                  onClick={closeDrawer}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-medium text-white shadow-lg shadow-accent/20 transition hover:brightness-110"
                >
                  <span>Start Reading First Story</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
