import { useEffect, useState } from 'react'

/**
 * Flips to true once the browser is idle (or after `timeoutMs` at the latest).
 * Used to defer non-critical client features so they never compete with first paint and hydration.
 */
export function useIdleReady(timeoutMs = 1500) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const markReady = () => setIsReady(true)

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(markReady, { timeout: timeoutMs })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = window.setTimeout(markReady, 200)
    return () => window.clearTimeout(timeoutId)
  }, [timeoutMs])

  return isReady
}
