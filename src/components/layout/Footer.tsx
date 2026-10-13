import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Rss } from 'lucide-react'
import { categories } from '../../data/categories'
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from '../ui/BrandIcons'
import { Logo } from './Logo'

const SOCIALS = [
  { label: 'X (Twitter)', href: 'https://x.com', Icon: XIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTubeIcon },
]

const COMPANY = ['About us', 'Our journalists', 'Editorial standards', 'Careers', 'Contact']
const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const [subscribed, setSubscribed] = useState(false)

  function onSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer className="relative mt-32 border-t border-line">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        aria-hidden
      />
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Independent reporting for a connected world. Clear, careful journalism on the stories that shape tomorrow.
          </p>
          <ul className="flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Sections">
          <h2 className="eyebrow mb-4 text-faint">Sections</h2>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-muted transition hover:text-fg">
                Home
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`} className="text-muted transition hover:text-fg">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="eyebrow mb-4 text-faint">Company</h2>
          <ul className="space-y-2.5 text-sm">
            {COMPANY.map((item) => (
              <li key={item} className="text-muted">
                {item}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-4 text-faint">The Morning Nexus</h2>
          <p className="mb-4 text-sm text-muted">Five stories worth your time, in your inbox before 7am.</p>
          {subscribed ? (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              <Check className="size-4" aria-hidden /> You’re on the list. See you tomorrow.
            </p>
          ) : (
            <form onSubmit={onSubscribe} className="glass flex rounded-xl p-1 focus-within:ring-2 focus-within:ring-accent/50">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-faint"
              />
              <button
                type="submit"
                className="grid size-9 place-items-center rounded-lg bg-accent text-white transition hover:brightness-110"
                aria-label="Subscribe"
              >
                <ArrowRight className="size-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-faint sm:flex-row">
          <p>© {CURRENT_YEAR} Nexus News Media. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span className="inline-flex items-center gap-1">
              <Rss className="size-3" aria-hidden /> RSS
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
