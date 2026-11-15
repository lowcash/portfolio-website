'use client'

import { useEffect, useState } from 'react'

import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

const FPS_WINDOW_MS = 500

/** Scroll percentage and measured frame rate. Only runs while the console is open. */
export function useConsoleStats(isOpen: boolean) {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [fps, setFps] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    return subscribeToScrollMetrics((metrics) => setScrollPercent(Math.round(metrics.progress * 100)))
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    let frames = 0
    let since = performance.now()
    let frameId = 0

    const loop = (now: number) => {
      frames++
      if (now - since >= FPS_WINDOW_MS) {
        setFps(Math.round((frames * 1000) / (now - since)))
        frames = 0
        since = now
      }
      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [isOpen])

  return { scrollPercent, fps }
}
