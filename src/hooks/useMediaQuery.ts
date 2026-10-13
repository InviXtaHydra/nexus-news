import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Touch-first or small screens get lighter 3D and no tilt. */
export const useIsLowPowerDevice = () =>
  useMediaQuery('(max-width: 767px), (hover: none), (pointer: coarse)')
