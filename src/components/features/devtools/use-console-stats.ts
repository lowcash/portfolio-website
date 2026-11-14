'use client'

import { useEffect, useRef, useState } from 'react'

import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

const FPS_STATE_INTERVAL_MS = 250

export type ConsoleStats = {
  scrollPercent: number
  orbR: number
  orbG: number
  orbB: number
  fps: number
}

function readOrbRgb(): { r: number; g: number; b: number } {
  const root = getComputedStyle(document.documentElement)
  return {
    r: parseInt(root.getPropertyValue('--orb-r')) || 0,
    g: parseInt(root.getPropertyValue('--orb-g')) || 0,
    b: parseInt(root.getPropertyValue('--orb-b')) || 0,
  }
}

/** Scroll % + orb RGB via scroll-metrics when visible; FPS updates state ~4x/sec. */
export function useConsoleStats(isVisible: boolean): ConsoleStats {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [orbR, setOrbR] = useState(0)
  const [orbG, setOrbG] = useState(0)
  const [orbB, setOrbB] = useState(0)
  const [fps, setFps] = useState(60)
  const fpsRef = useRef(60)

  useEffect(() => {
    if (!isVisible) {
      return
    }

    return subscribeToScrollMetrics((metrics) => {
      setScrollPercent(metrics.progress * 100)
      const rgb = readOrbRgb()
      setOrbR(rgb.r)
      setOrbG(rgb.g)
      setOrbB(rgb.b)
    })
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) {
      return
    }

    const frameWindow = 30
    const emaAlpha = 2 / (frameWindow + 1)
    let lastFrameTime = performance.now()
    let smoothedFps = 60
    let frameId = 0
    let lastStateUpdate = 0

    const tick = (now: number) => {
      const delta = now - lastFrameTime
      if (delta > 0) {
        const instantFps = 1000 / delta
        smoothedFps = smoothedFps * (1 - emaAlpha) + instantFps * emaAlpha
        fpsRef.current = Math.round(smoothedFps)

        if (now - lastStateUpdate >= FPS_STATE_INTERVAL_MS) {
          lastStateUpdate = now
          setFps(fpsRef.current)
        }
      }
      lastFrameTime = now
      frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [isVisible])

  return { scrollPercent, orbR, orbG, orbB, fps }
}
