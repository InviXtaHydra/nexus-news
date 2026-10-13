import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react'
import type { ArticleWithMeta } from '../types/news'
import { articles as mockArticles } from '../data/articles'
import { readingTime } from '../lib/format'

interface BookmarkContextValue {
  bookmarks: string[]
  isBookmarked: (id: string) => boolean
  toggleBookmark: (id: string) => void
  savedArticles: ArticleWithMeta[]
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null)
const STORAGE_KEY = 'nexus-bookmarks'

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : ['a01', 'a04']
    } catch {
      return ['a01', 'a04']
    }
  })

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
    } catch {
      // Storage unavailable
    }
  }, [bookmarks])

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks])

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const savedArticles = useMemo(() => {
    return mockArticles
      .filter((a) => bookmarks.includes(a.id))
      .map((a) => ({ ...a, readingTime: readingTime(a.content) }))
  }, [bookmarks])

  const value = useMemo(
    () => ({
      bookmarks,
      isBookmarked,
      toggleBookmark,
      savedArticles,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [bookmarks, isBookmarked, toggleBookmark, savedArticles, isDrawerOpen, openDrawer, closeDrawer]
  )

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBookmarks() {
  const ctx = useContext(BookmarkContext)
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider')
  return ctx
}
