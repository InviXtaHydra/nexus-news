const WORDS_PER_MINUTE = 220

export function readingTime(paragraphs: string[]): number {
  const words = paragraphs.join(' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const longDateFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeFmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })

export const formatDate = (iso: string) => dateFmt.format(new Date(iso))
export const formatLongDate = (iso: string | Date) => longDateFmt.format(new Date(iso))
export const formatTime = (iso: string) => timeFmt.format(new Date(iso))

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** "3 hours ago" for recent items, a calendar date after a week. */
export function formatRelative(iso: string, now = Date.now()): string {
  const diffMin = Math.round((new Date(iso).getTime() - now) / 60000)
  const abs = Math.abs(diffMin)
  if (abs < 60) return rtf.format(diffMin, 'minute')
  if (abs < 60 * 24) return rtf.format(Math.round(diffMin / 60), 'hour')
  if (abs < 60 * 24 * 7) return rtf.format(Math.round(diffMin / 1440), 'day')
  return formatDate(iso)
}

/** Request an appropriately sized variant from the image CDN. */
export function sizedImage(src: string, width: number): string {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  return url.toString()
}

export function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
