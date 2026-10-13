import { memo, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { sizedImage } from '../../lib/format'

interface SmartImageProps {
  src: string
  alt: string
  sizes: string
  widths?: number[]
  className?: string
  imgClassName?: string
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean
}

/** Responsive, lazily loaded image with a shimmer placeholder and graceful failure. */
export const SmartImage = memo(function SmartImage({
  src,
  alt,
  sizes,
  widths = [400, 800, 1200],
  className = '',
  imgClassName = '',
  priority = false,
}: SmartImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div className={`relative overflow-hidden bg-bg-2 ${className}`}>
      {state === 'loading' && <div className="shimmer absolute inset-0" aria-hidden />}
      {state === 'error' ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/20 to-accent-2/20 text-faint">
          <ImageOff className="size-6" aria-hidden />
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          src={sizedImage(src, widths[widths.length - 1])}
          srcSet={widths.map((w) => `${sizedImage(src, w)} ${w}w`).join(', ')}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={`size-full object-cover transition-opacity duration-700 ${
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  )
})
