import { useEffect, useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'
import { FacebookIcon, LinkedInIcon, XIcon } from '../ui/BrandIcons'

interface ShareButtonsProps {
  title: string
  url: string
  orientation?: 'row' | 'column'
}

const btn =
  'grid size-10 place-items-center rounded-full border border-line bg-surface text-muted backdrop-blur transition hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg hover:shadow-[0_0_24px_-6px_var(--glow)]'

export function ShareButtons({ title, url, orientation = 'row' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const enc = encodeURIComponent
  const targets = [
    { label: 'Share on X', href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`, Icon: XIcon },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      Icon: LinkedInIcon,
    },
    { label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, Icon: FacebookIcon },
  ]

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Clipboard can be blocked; fall back to selecting nothing rather than throwing.
    }
  }

  return (
    <div className={`flex gap-2 ${orientation === 'column' ? 'flex-col' : 'flex-row flex-wrap'}`}>
      {targets.map(({ label, href, Icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className={btn}>
          <Icon className="size-4" />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Copy link" title="Copy link" className={btn}>
        {copied ? <Check className="size-4 text-emerald-500" /> : <Link2 className="size-4" />}
      </button>
      {canNativeShare && (
        <button
          type="button"
          onClick={() => navigator.share({ title, url }).catch(() => {})}
          aria-label="More sharing options"
          title="More options"
          className={`${btn} sm:hidden`}
        >
          <Share2 className="size-4" />
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}
