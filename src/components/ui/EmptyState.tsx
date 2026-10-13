import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface EmptyStateProps {
  eyebrow: string
  title: string
  children?: ReactNode
}

export function EmptyState({ eyebrow, title, children }: EmptyStateProps) {
  return (
    <div className="container-page flex flex-col items-center pt-40 pb-16 text-center">
      <p className="eyebrow mb-4 text-accent-fg">{eyebrow}</p>
      <h1 className="max-w-2xl font-display text-5xl tracking-tight sm:text-6xl">{title}</h1>
      {children && <div className="mt-5 max-w-md text-muted">{children}</div>}
      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition hover:border-accent/50"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to the front page
      </Link>
    </div>
  )
}
