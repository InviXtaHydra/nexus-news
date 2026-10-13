import { useState, type FormEvent } from 'react'
import confetti from 'canvas-confetti'
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export function NewsletterCard() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return

    setSubmitted(true)

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#8b5cf6', '#60a5fa', '#a78bfa', '#ffffff'],
    })
  }

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="glow-border relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-surface to-surface-strong p-8 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-xl">
        {/* Glow backdrop blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-accent-2/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-mono text-xs text-accent-fg">
            <Zap className="size-3.5 fill-current" />
            <span>DAILY INTELLIGENCE BRIEFING</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-fg">
            Stay ahead of the <span className="text-gradient">curve</span>.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-muted">
            Join 140,000+ researchers, engineers, and founders receiving our daily editorial breakdown of breakthroughs and world affairs.
          </p>

          <div className="mt-8">
            {submitted ? (
              <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="size-6 shrink-0" />
                <div className="text-left text-sm">
                  <div className="font-semibold text-fg">You’re now subscribed!</div>
                  <div className="text-xs text-muted">Check your inbox for your confirmation and tomorrow’s brief.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-faint" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address…"
                    className="w-full rounded-2xl border border-line bg-surface-strong/90 py-3.5 pr-4 pl-12 text-sm text-fg outline-none transition placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-2 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:brightness-110 active:scale-95"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-faint">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-accent" />
              Strict zero-spam policy
            </span>
            <span>•</span>
            <span>One email at 07:00 UTC</span>
            <span>•</span>
            <span>Unsubscribe in 1 click</span>
          </div>
        </div>
      </div>
    </section>
  )
}
