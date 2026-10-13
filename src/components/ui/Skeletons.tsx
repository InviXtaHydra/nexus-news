import type { ReactNode } from 'react'

const Bar = ({ className }: { className: string }) => <div className={`shimmer rounded-md ${className}`} />

export function CardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-2xl" aria-hidden>
      <div className="shimmer aspect-[16/10]" />
      <div className="space-y-3 p-5">
        <Bar className="h-4 w-20" />
        <Bar className="h-6 w-full" />
        <Bar className="h-6 w-3/4" />
        <Bar className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex gap-5 py-6" aria-hidden>
      <div className="shimmer aspect-[4/3] w-28 shrink-0 rounded-xl sm:w-44" />
      <div className="flex-1 space-y-3">
        <Bar className="h-4 w-24" />
        <Bar className="h-5 w-full" />
        <Bar className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="container-page pt-28" aria-hidden>
      <div className="shimmer h-[560px] rounded-3xl" />
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="container-page max-w-3xl space-y-5 pt-32" aria-hidden>
      <Bar className="h-5 w-28" />
      <Bar className="h-12 w-full" />
      <Bar className="h-12 w-2/3" />
      <Bar className="h-4 w-1/3" />
      <div className="shimmer mt-8 aspect-[16/9] rounded-3xl" />
    </div>
  )
}

/** Accessible live-region wrapper used while sections load. */
export function LoadingRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
