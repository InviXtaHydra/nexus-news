import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center pt-28 pb-20 text-center">
      <div className="grid size-20 place-items-center rounded-3xl border border-line bg-surface text-accent">
        <Compass className="size-10" />
      </div>
      <h1 className="mt-6 font-display text-5xl sm:text-6xl text-fg tracking-tight">404</h1>
      <h2 className="mt-2 text-2xl font-display text-fg">Dispatch Not Found</h2>
      <p className="mt-3 max-w-md text-sm text-muted">
        The coordinates you requested do not point to an active dispatch or archive entry.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110"
      >
        <ArrowLeft className="size-4" />
        <span>Return to Headlines</span>
      </Link>
    </div>
  )
}
