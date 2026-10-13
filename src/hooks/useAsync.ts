import { useEffect, useState } from 'react'

type AsyncState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: undefined; error: Error }

/**
 * Runs `fn` whenever `key` changes. Results from stale requests are
 * discarded so fast navigation never shows the wrong article.
 */
export function useAsync<T>(fn: () => Promise<T>, key: string): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T> & { key: string }>({
    status: 'loading',
    data: undefined,
    error: undefined,
    key,
  })

  useEffect(() => {
    let active = true
    fn().then(
      (data) => active && setState({ status: 'success', data, error: undefined, key }),
      (error: Error) => active && setState({ status: 'error', data: undefined, error, key }),
    )
    return () => {
      active = false
    }
    // `fn` is intentionally keyed by `key` so callers can pass inline closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (state.key !== key) return { status: 'loading', data: undefined, error: undefined }
  return state
}
