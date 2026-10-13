import { useCallback, useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { SearchDialog } from './SearchDialog'
import { BookmarkDrawer } from './BookmarkDrawer'

export function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const [searchOpen, setSearchOpen] = useState(false)
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // ⌘K / Ctrl+K and "/" open search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Navbar onOpenSearch={openSearch} />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[70vh]"
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
      <BookmarkDrawer />
    </>
  )
}
