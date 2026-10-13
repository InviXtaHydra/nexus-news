import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import type { ArticleWithMeta } from '../../types/news'
import { formatTime } from '../../lib/format'
import { SmartImage } from '../ui/SmartImage'
import { CategoryBadge } from '../ui/CategoryBadge'

// three.js is only downloaded once the hero mounts, keeping the main bundle lean.
const HeroScene = lazy(() => import('../three/HeroScene'))

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero({ article }: { article: ArticleWithMeta }) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '-12%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])

  return (
    <section ref={ref} aria-labelledby="hero-title" className="container-page pt-24 sm:pt-28">
      <div className="relative isolate overflow-hidden rounded-[28px] border border-line shadow-[0_40px_120px_-40px_rgb(0_0_0/0.7)]">
        <motion.div style={{ y: imageY }} className="absolute inset-0 -z-20 scale-110">
          <SmartImage
            src={article.image.src}
            alt=""
            sizes="100vw"
            widths={[800, 1400, 2000]}
            priority
            className="size-full"
          />
        </motion.div>
        {/* Legibility gradients: always dark, regardless of theme, so white type stays readable. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#05070f] via-[#05070f]/85 to-[#05070f]/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#05070f] via-transparent to-[#05070f]/40" />

        <div className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        <motion.div
          style={{ y: contentY, opacity: fade }}
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          initial="hidden"
          animate="show"
          className="flex min-h-[560px] flex-col justify-end gap-6 p-6 text-white sm:min-h-[620px] sm:p-10 lg:min-h-[680px] lg:max-w-[62%] lg:p-14"
        >
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            {article.breaking && (
              <span className="eyebrow inline-flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1 text-white shadow-[0_0_30px_-4px_rgb(239_68_68/0.8)]">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                </span>
                Breaking
              </span>
            )}
            <CategoryBadge slug={article.category} asLink className="bg-white/10! text-white! ring-white/20!" />
            <span className="font-mono text-[11px] tracking-wider text-white/60 uppercase">
              Updated {formatTime(article.publishedAt)} GMT
            </span>
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={item}
            className="font-display text-[2.6rem] leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {article.title}
          </motion.h1>

          <motion.p variants={item} className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {article.summary}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
            <Link
              to={`/article/${article.slug}`}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#05070f] shadow-[0_10px_40px_-10px_rgb(59_130_246/0.9)] transition hover:shadow-[0_10px_50px_-6px_rgb(139_92_246/0.9)]"
            >
              Read Full Story
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <div className="flex items-center gap-4 font-mono text-[11px] tracking-wider text-white/60 uppercase">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden /> {article.readingTime} min read
              </span>
              {article.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden /> {article.location.name}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
