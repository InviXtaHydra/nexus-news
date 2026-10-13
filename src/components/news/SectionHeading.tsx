import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  icon?: LucideIcon
  action?: ReactNode
  id?: string
}

export function SectionHeading({ eyebrow, title, icon: Icon, action, id }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 border-b border-line pb-5">
      <div>
        <p className="eyebrow mb-2 flex items-center gap-2 text-accent-fg">
          {Icon && <Icon className="size-3.5" aria-hidden />}
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-4xl tracking-tight sm:text-5xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
