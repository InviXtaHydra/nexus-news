import { Link } from 'react-router-dom'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="Nexus News home">
      <span className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 shadow-[0_0_24px_-4px_var(--glow)] transition-transform duration-500 group-hover:rotate-[8deg]">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
          <path d="M9 23V9l14 14V9" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[15px] font-bold tracking-[0.2em] whitespace-nowrap">
        NEXUS <span className="text-gradient">NEWS</span>
      </span>
    </Link>
  )
}
