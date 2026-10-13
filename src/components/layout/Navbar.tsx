import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Bookmark, Menu, Search, X } from 'lucide-react'
import { categories } from '../../data/categories'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useBookmarks } from '../../context/BookmarkContext'

const NAV_LINKS = [{ to: '/', label: 'Home' }, ...categories.map((c) => ({ to: `/category/${c.slug}`, label: c.name }))]

interface NavbarProps {
  onOpenSearch: () => void
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const { bookmarks, openDrawer } = useBookmarks()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <a
        href="#main"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 transition-all duration-500 sm:px-5 ${
          scrolled || menuOpen ? 'glass h-14 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)]' : 'h-16 border border-transparent'
        }`}
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative isolate block rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-fg' : 'text-muted hover:text-fg'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-fg/[0.07] ring-1 ring-line"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSearch}
            className="group flex h-10 items-center gap-2 rounded-full px-3 text-muted transition hover:bg-fg/5 hover:text-fg"
            aria-label="Search articles"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <Search className="size-[18px]" />
            <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint xl:inline">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={openDrawer}
            className="relative grid size-10 place-items-center rounded-full text-muted transition hover:bg-fg/5 hover:text-fg"
            aria-label={`Open reading list (${bookmarks.length} saved)`}
          >
            <Bookmark className="size-[18px]" />
            {bookmarks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow-sm">
                {bookmarks.length}
              </span>
            )}
          </button>

          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-fg/5 hover:text-fg lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-3 shadow-2xl lg:hidden"
          >
            <ul className="grid gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                        isActive ? 'bg-accent/10 text-accent-fg' : 'text-fg hover:bg-fg/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
