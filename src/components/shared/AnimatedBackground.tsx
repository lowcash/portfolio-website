// style-boundary-ignore-file: orb parameters are passed as CSS custom properties consumed by the .orb rules in animations.css
import { type CSSProperties, useEffect, useRef } from 'react'

import { ANIMATION_CONFIG } from '@/lib/constants'
import { DEFAULT_COLOR_VARIATION, adjustOrbColor, resolveOrbBaseColor, resolveOrbVariantColors } from '@/lib/orb-color'
import { startOrbEffects } from '@/lib/orb-effects'
import { getOrbSettings, hydrateOrbSettings, subscribeToOrbSettings } from '@/lib/orb-settings'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

type OrbConfig = {
  className: string
  /** Desktop anchor, % of the viewport */
  top: number
  left: number
  /** Mobile anchor, % of the viewport (orbs spread across the canvas instead of clustering in the center) */
  mobileTop: number
  mobileLeft: number
  diameter: number
  opacity: number
  blur: number
  durationSeconds: number
  /** Parallax travel (px at magnetism 50%) toward/away from the pointer; sign sets the direction */
  depth: number
  /** 0 = base color, 1..6 = hue-shifted variants (see ORB_HUE_OFFSETS) */
  colorSlot: number
}

// Cap at 4 orbs for paint/compositor cost; mobile CSS still hides 7–8 if reintroduced
const ORBS: readonly OrbConfig[] = [
  {
    className: 'orb-1',
    top: 50,
    left: 50,
    mobileTop: 24,
    mobileLeft: 26,
    diameter: 800,
    opacity: 0.14,
    blur: 120,
    durationSeconds: 45,
    depth: -30,
    colorSlot: 0,
  },
  {
    className: 'orb-2',
    top: 25,
    left: 25,
    mobileTop: 18,
    mobileLeft: 74,
    diameter: 600,
    opacity: 0.11,
    blur: 100,
    durationSeconds: 38,
    depth: 55,
    colorSlot: 1,
  },
  {
    className: 'orb-3',
    top: 75,
    left: 75,
    mobileTop: 46,
    mobileLeft: 16,
    diameter: 650,
    opacity: 0.12,
    blur: 110,
    durationSeconds: 42,
    depth: -75,
    colorSlot: 2,
  },
  {
    className: 'orb-4',
    top: 33,
    left: 66,
    mobileTop: 44,
    mobileLeft: 82,
    diameter: 500,
    opacity: 0.1,
    blur: 90,
    durationSeconds: 40,
    depth: 95,
    colorSlot: 3,
  },
]

/** CSS custom property holding the color of an orb slot, written on :root while scrolling. */
const orbColorVar = (slot: number) => `--orb-c${slot}`

// Fallbacks match scroll position 0, so the server-rendered first paint already has the right colors
const INITIAL_BASE_COLOR = resolveOrbBaseColor(0)
const INITIAL_SLOT_COLORS = [
  `rgb(${INITIAL_BASE_COLOR.r}, ${INITIAL_BASE_COLOR.g}, ${INITIAL_BASE_COLOR.b})`,
  ...resolveOrbVariantColors(INITIAL_BASE_COLOR, DEFAULT_COLOR_VARIATION),
]

function getOrbStyle(orb: OrbConfig): CSSProperties {
  return {
    '--orb-top': orb.top,
    '--orb-left': orb.left,
    '--orb-top-m': orb.mobileTop,
    '--orb-left-m': orb.mobileLeft,
    '--orb-diameter': orb.diameter,
    '--orb-alpha': orb.opacity,
    '--orb-blur-px': orb.blur,
    '--orb-duration': orb.durationSeconds,
    '--orb-depth': orb.depth,
    '--orb-color': `var(${orbColorVar(orb.colorSlot)}, ${INITIAL_SLOT_COLORS[orb.colorSlot]})`,
  } as CSSProperties
}

/**
 * Smoothly follows the page scroll position and writes the resulting colors straight to CSS custom properties.
 * Nothing here touches React state, so scrolling never re-renders the background.
 */
function useScrollDrivenOrbColors() {
  const currentPercentRef = useRef(0)

  useEffect(() => {
    const root = document.documentElement
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lastValues = new Map<string, string>()
    const pending = new Map<string, string>()

    const queueVar = (name: string, value: string) => {
      if (lastValues.get(name) === value) {
        return
      }
      pending.set(name, value)
    }

    const flushVars = () => {
      if (pending.size === 0) {
        return
      }

      for (const [name, value] of pending) {
        lastValues.set(name, value)
        root.style.setProperty(name, value)
      }
      pending.clear()
    }

    const apply = (percent: number) => {
      currentPercentRef.current = percent

      const { colorVariation, hue, saturation } = getOrbSettings()
      const base = adjustOrbColor(resolveOrbBaseColor(percent), hue, saturation)
      const rounded = Math.round(percent * 20) / 20

      queueVar('--scroll-progress', String(rounded / 100))
      queueVar('--scroll-percent', String(rounded))
      queueVar('--orb-r', String(base.r))
      queueVar('--orb-g', String(base.g))
      queueVar('--orb-b', String(base.b))
      queueVar(orbColorVar(0), `rgb(${base.r}, ${base.g}, ${base.b})`)

      resolveOrbVariantColors(base, colorVariation / 100).forEach((color, index) => {
        queueVar(orbColorVar(index + 1), color)
      })

      flushVars()
    }

    let target = currentPercentRef.current
    let frameId: number | null = null

    const tick = () => {
      frameId = null

      if (document.visibilityState !== 'visible') {
        return
      }

      const diff = target - currentPercentRef.current

      if (Math.abs(diff) < ANIMATION_CONFIG.SMOOTH_SCROLL_SNAP_THRESHOLD) {
        apply(target)
        return
      }

      apply(currentPercentRef.current + diff * ANIMATION_CONFIG.SMOOTH_SCROLL_EASING)
      frameId = requestAnimationFrame(tick)
    }

    const schedule = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(tick)
      }
    }

    const unsubscribe = subscribeToScrollMetrics((metrics) => {
      // Mobile menu locks the body with position: fixed, which reports scrollY 0 – ignore to avoid a jump to the top color
      if (document.body.style.position === 'fixed') {
        return
      }

      target = Math.min(100, Math.max(0, metrics.progress * 100))

      if (reducedMotionQuery.matches) {
        apply(target)
        return
      }

      schedule()
    })

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && target !== currentPercentRef.current) {
        schedule()
      }
    }

    // Palette settings (hue, saturation, color variation) re-tint immediately
    const unsubscribeSettings = subscribeToOrbSettings(() => apply(currentPercentRef.current))

    hydrateOrbSettings()
    apply(currentPercentRef.current)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      unsubscribe()
      unsubscribeSettings()
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])
}

export function AnimatedBackground() {
  const rippleLayerRef = useRef<HTMLDivElement>(null)

  useScrollDrivenOrbColors()

  useEffect(() => {
    const rippleLayer = rippleLayerRef.current

    return rippleLayer ? startOrbEffects(rippleLayer) : undefined
  }, [])

  return (
    <div className='pointer-events-none fixed inset-0 z-0' style={{ backgroundColor: '#030712' }}>
      {ORBS.map((orb) => (
        <div key={orb.className} className={`orb ${orb.className}`} style={getOrbStyle(orb)} />
      ))}

      {/* Click ripples are appended here by orb-effects */}
      <div ref={rippleLayerRef} className='pointer-events-none absolute inset-0 overflow-hidden' />

      {/* Subtle overlay for depth – reduced to keep orbs visible */}
      <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-gray-950/20 via-transparent to-gray-950/20 md:from-gray-950/40 md:to-gray-950/40' />

      {/* Vignette – lighter on mobile (see .orb-vignette) */}
      <div className='orb-vignette pointer-events-none absolute inset-0' />
    </div>
  )
}
