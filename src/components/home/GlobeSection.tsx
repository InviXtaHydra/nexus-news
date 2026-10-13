import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, ArrowRight, Compass, Sparkles } from 'lucide-react'
import type { ArticleWithMeta } from '../../types/news'
import NewsGlobe from '../three/NewsGlobe'
import { SectionHeading } from '../news/SectionHeading'
import { CategoryBadge } from '../ui/CategoryBadge'
import { SmartImage } from '../ui/SmartImage'
import { formatRelative } from '../../lib/format'

interface GlobeSectionProps {
  stories: ArticleWithMeta[]
}

export function GlobeSection({ stories }: GlobeSectionProps) {
  // Filter stories with valid locations
  const geoStories = stories.filter((s) => s.location)
  const [activeId, setActiveId] = useState<string | null>(geoStories[0]?.id ?? null)

  const activeStory = geoStories.find((s) => s.id === activeId) ?? geoStories[0]

  if (!geoStories.length) return null

  return (
    <section className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow="Real-Time 3D Radar"
        title="Global Dispatches"
        icon={Globe}
      />

      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface to-surface-strong/60 shadow-2xl backdrop-blur-xl">
        {/* Subtle background ambient grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgb(59_130_246/0.08),transparent_70%)]" />

        <div className="grid items-center lg:grid-cols-12 min-h-[580px]">
          {/* 3D Globe Visualizer */}
          <div className="relative h-[360px] sm:h-[480px] lg:h-[580px] lg:col-span-7 overflow-hidden flex items-center justify-center">
            <NewsGlobe
              stories={geoStories}
              activeId={activeId}
              onSelect={(id) => setActiveId(id)}
            />

            {/* Instruction tooltip badge */}
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 backdrop-blur-md">
              <Compass className="size-3.5 text-accent animate-spin [animation-duration:8s]" />
              <span className="font-mono text-[11px] text-muted">Click any beacon to locate reporting</span>
            </div>
          </div>

          {/* Active Dispatch Card & Location Selector */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5 border-t lg:border-t-0 lg:border-l border-line">
            <div className="space-y-6">
              {/* Location Chips Navigation */}
              <div>
                <p className="eyebrow mb-3 flex items-center gap-1.5 text-faint">
                  <Sparkles className="size-3 text-accent" />
                  Active Field Stations
                </p>
                <div className="flex flex-wrap gap-2">
                  {geoStories.map((story) => {
                    const isActive = story.id === activeId
                    return (
                      <button
                        key={story.id}
                        type="button"
                        onClick={() => setActiveId(story.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono transition ${
                          isActive
                            ? 'bg-accent text-white shadow-md shadow-accent/25 ring-2 ring-accent/30'
                            : 'border border-line bg-surface text-muted hover:border-fg/30 hover:text-fg'
                        }`}
                      >
                        <MapPin className="size-3" />
                        <span>{story.location?.name.split(',')[0]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Active Story Card */}
              <AnimatePresence mode="wait">
                {activeStory && (
                  <motion.div
                    key={activeStory.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4 rounded-2xl border border-line bg-surface-strong/70 p-5 shadow-lg"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                      <SmartImage
                        src={activeStory.image.src}
                        alt={activeStory.image.alt}
                        sizes="400px"
                        widths={[400, 800]}
                        className="size-full"
                      />
                      <CategoryBadge
                        slug={activeStory.category}
                        className="absolute top-3 left-3 bg-black/60! text-white!"
                      />
                      {activeStory.location && (
                        <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
                          {activeStory.location.lat.toFixed(1)}°, {activeStory.location.lng.toFixed(1)}°
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted mb-1 font-mono">
                        <MapPin className="size-3.5 text-accent-fg" />
                        <span className="font-semibold text-fg">{activeStory.location?.name}</span>
                        <span>•</span>
                        <span>{formatRelative(activeStory.publishedAt)}</span>
                      </div>

                      <h3 className="font-display text-2xl leading-snug tracking-tight text-fg">
                        <Link to={`/article/${activeStory.slug}`} className="hover:text-accent-fg transition">
                          {activeStory.title}
                        </Link>
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                        {activeStory.summary}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/article/${activeStory.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-accent-fg transition hover:gap-3"
                      >
                        <span>Read Field Dispatch</span>
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
