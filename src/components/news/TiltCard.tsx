import { useRef, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useIsLowPowerDevice } from '../../hooks/useMediaQuery'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Maximum rotation in degrees. Kept small so it reads as depth, not a gimmick. */
  maxTilt?: number
}

const spring = { stiffness: 260, damping: 24, mass: 0.6 }

/**
 * Wraps a card with a pointer-driven 3D tilt, a hover lift and a glow
 * border that follows the cursor. Falls back to a plain lift on touch
 * devices and to nothing at all under reduced motion.
 */
export function TiltCard({ children, className = '', maxTilt = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const lowPower = useIsLowPowerDevice()
  const tiltEnabled = !reduceMotion && !lowPower

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring)

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    // Glow position is set directly on the element to avoid React renders.
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    if (tiltEnabled) {
      px.set(x)
      py.set(y)
    }
  }

  function handleLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={tiltEnabled ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={`glow-border group rounded-2xl will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}
