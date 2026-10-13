import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Globe2, MapPin } from 'lucide-react'
import type { ArticleWithMeta } from '../../types/news'
import { SectionHeading } from '../news/SectionHeading'
import { CategoryBadge } from '../ui/CategoryBadge'
import { Reveal } from '../ui/Reveal'

const NewsGlobe = lazy(() => import('../three/NewsGlobe'))

const GlobeFallback = () => (
  <div className="grid size-full place-items-center" aria-hidden>
    <div className="size-64 rounded-full bg-[radial-gradient(circle_at_35%_30%,#1e3a8a,#0b1430_60%)] opacity-60 shadow-[0_0_80px_-10px_var(--glow)]" />
  </div>
)

export function WorldPulse({ stories }: { stories: ArticleWithMeta[] }) {
  const [activeId, setActiveId] = useState<string | null>(stories[0]?.id ?? null)
  const active = stories.find((s) => s.id === activeId)

  return (
    <section aria-labelledby="pulse-title" className="container-page mt-28">
      <SectionHeading id="pulse-title" eyebrow="Where the news is" title="World pulse" icon={Globe2} />

      <Reveal className="glass relative grid overflow-hidden rounded-3xl lg:grid-cols-[1.1fr_1fr]">
        <div
          className="pointer-events-none absolute -top-40 -left-40 size-[480px] rounded-full bg-accent/20 blur-[120px]"
          aria-hidden
        />
        <div className="relative h-[340px] sm:h-[440px] lg:h-[540px]">
          <Suspense fallback={<GlobeFallback />}>
            <NewsGlobe stories={stories} activeId={activeId} onSelect={setActiveId} />
          </Suspense>
          <p className="eyebrow absolute bottom-4 left-5 text-faint">Tap a marker to explore</p>
        </div>

        <div className="relative flex flex-col border-t border-line p-5 sm:p-8 lg:border-t-0 lg:border-l">
          <ul className="grid gap-1" aria-label="Stories by location">
            {stories.map((s) => {
              const selected = s.id === activeId
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selected ? 'bg-accent/10 text-fg' : 'text-muted hover:bg-fg/5 hover:text-fg'
                    }`}
                  >
                    <MapPin className={`size-3.5 shrink-0 ${selected ? 'text-accent-fg' : 'text-faint'}`} aria-hidden />
                    <span className="w-36 shrink-0 truncate font-mono text-[11px] tracking-wide uppercase">
                      {s.location!.name}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 min-h-[150px] lg:mt-auto" aria-live="polite">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-line bg-bg/40 p-5"
                >
                  <CategoryBadge slug={active.category} className="mb-3" />
                  <h3 className="font-display text-2xl leading-tight">{active.title}</h3>
                  <Link
                    to={`/article/${active.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-fg hover:underline"
                  >
                    Read story <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
