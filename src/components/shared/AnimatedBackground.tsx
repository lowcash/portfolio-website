// style-boundary-ignore-file: orb parameters are passed as CSS custom properties consumed by the .orb rules in animations.css
import { type CSSProperties, useEffect, useRef } from 'react'

import { ANIMATION_CONFIG } from '@/lib/constants'
import { DEFAULT_COLOR_VARIATION, resolveOrbBaseColor, resolveOrbVariantColors } from '@/lib/orb-color'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

type OrbConfig = {
  className: string
  /** Desktop anchor, % of the viewport */
  top: number
  left: number
  /** Mobile anchor, % of the viewport (orbs spread across the canvas instead of clustering in the center) */
  mobileTop: number
  mobileLeft: number
  /** Seed for the deterministic position-variation offset */
  seed: number
  diameter: number
  opacity: number
  blur: number
  durationSeconds: number
  /** 0 = base color, 1..6 = hue-shifted variants (see ORB_HUE_OFFSETS) */
  colorSlot: number
}

// Orbs 7 and 8 are hidden on mobile via CSS to reduce rendering cost
const ORBS: readonly OrbConfig[] = [
  // Central main orb - biggest, primary color
  {
    className: 'orb-1',
    top: 50,
    left: 50,
    mobileTop: 24,
    mobileLeft: 26,
    seed: 0,
    diameter: 800,
    opacity: 0.14,
    blur: 120,
    durationSeconds: 45,
    colorSlot: 0,
  },
  // Secondary orbs - hue shifted variations
  {
    className: 'orb-2',
    top: 25,
    left: 25,
    mobileTop: 18,
    mobileLeft: 74,
    seed: 1,
    diameter: 600,
    opacity: 0.11,
    blur: 100,
    durationSeconds: 38,
    colorSlot: 1,
  },
  {
    className: 'orb-3',
    top: 75,
    left: 75,
    mobileTop: 46,
    mobileLeft: 16,
    seed: 2,
    diameter: 650,
    opacity: 0.12,
    blur: 110,
    durationSeconds: 42,
    colorSlot: 2,
  },
  // Tertiary accent orbs - smaller, more vibrant
  {
    className: 'orb-4',
    top: 33,
    left: 66,
    mobileTop: 44,
    mobileLeft: 82,
    seed: 3,
    diameter: 500,
    opacity: 0.1,
    blur: 90,
    durationSeconds: 40,
    colorSlot: 3,
  },
  {
    className: 'orb-5',
    top: 75,
    left: 33,
    mobileTop: 74,
    mobileLeft: 28,
    seed: 4,
    diameter: 550,
    opacity: 0.11,
    blur: 95,
    durationSeconds: 36,
    colorSlot: 4,
  },
  // Extreme hue shifts for maximum variation
  {
    className: 'orb-6',
    top: 66,
    left: 66,
    mobileTop: 72,
    mobileLeft: 72,
    seed: 5,
    diameter: 700,
    opacity: 0.12,
    blur: 115,
    durationSeconds: 44,
    colorSlot: 5,
  },
  {
    className: 'orb-7',
    top: 50,
    left: 50,
    mobileTop: 58,
    mobileLeft: 50,
    seed: 6,
    diameter: 600,
    opacity: 0.11,
    blur: 105,
    durationSeconds: 50,
    colorSlot: 6,
  },
  {
    className: 'orb-8',
    top: 66,
    left: 33,
    mobileTop: 32,
    mobileLeft: 54,
    seed: 7,
    diameter: 550,
    opacity: 0.1,
    blur: 100,
    durationSeconds: 46,
    colorSlot: 1,
  },
]

const TRACKED_STORAGE_KEYS = new Set(['color_variation'])

/** CSS custom property holding the color of an orb slot, written on :root while scrolling. */
const orbColorVar = (slot: number) => `--orb-c${slot}`

// Fallbacks match scroll position 0, so the server-rendered first paint already has the right colors
const INITIAL_BASE_COLOR = resolveOrbBaseColor(0)
const INITIAL_SLOT_COLORS = [
  `rgb(${INITIAL_BASE_COLOR.r}, ${INITIAL_BASE_COLOR.g}, ${INITIAL_BASE_COLOR.b})`,
  ...resolveOrbVariantColors(INITIAL_BASE_COLOR, DEFAULT_COLOR_VARIATION),
]

/** Deterministic pseudo-random offset in [0, 1) so orb placement is stable between renders. */
function seededFraction(seed: number, multiplier: number) {
  const value = Math.sin(seed * multiplier) * 43758.5453
  return value - Math.floor(value)
}

function getOrbStyle(orb: OrbConfig): CSSProperties {
  return {
    '--orb-top': orb.top,
    '--orb-left': orb.left,
    '--orb-top-m': orb.mobileTop,
    '--orb-left-m': orb.mobileLeft,
    '--orb-rand-y': seededFraction(orb.seed, 12.9898),
    '--orb-rand-x': seededFraction(orb.seed, 78.233),
    '--orb-diameter': orb.diameter,
    '--orb-alpha': orb.opacity,
    '--orb-blur-px': orb.blur,
    '--orb-duration': orb.durationSeconds,
    '--orb-color': `var(${orbColorVar(orb.colorSlot)}, ${INITIAL_SLOT_COLORS[orb.colorSlot]})`,
  } as CSSProperties
}

function readColorVariationFromCss() {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--color-variation'))
  return Number.isNaN(value) ? DEFAULT_COLOR_VARIATION : value
}

/**
 * Smoothly follows the page scroll position and writes the resulting colors straight to CSS custom properties.
 * Nothing here touches React state, so scrolling never re-renders the background.
 */
function useScrollDrivenOrbColors() {
  const colorVariationRef = useRef(DEFAULT_COLOR_VARIATION)
  const currentPercentRef = useRef(0)

  useEffect(() => {
    const root = document.documentElement
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lastValues = new Map<string, string>()

    const setVar = (name: string, value: string) => {
      if (lastValues.get(name) === value) {
        return
      }

      lastValues.set(name, value)
      root.style.setProperty(name, value)
    }

    const apply = (percent: number) => {
      currentPercentRef.current = percent

      const base = resolveOrbBaseColor(percent)
      const rounded = Math.round(percent * 20) / 20

      setVar('--scroll-progress', String(rounded / 100))
      setVar('--scroll-percent', String(rounded))
      setVar('--orb-r', String(base.r))
      setVar('--orb-g', String(base.g))
      setVar('--orb-b', String(base.b))
      setVar(orbColorVar(0), `rgb(${base.r}, ${base.g}, ${base.b})`)

      resolveOrbVariantColors(base, colorVariationRef.current).forEach((color, index) => {
        setVar(orbColorVar(index + 1), color)
      })
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

    // Color variation is a developer-console setting: re-tint immediately when it changes
    const syncColorVariation = () => {
      colorVariationRef.current = readColorVariationFromCss()
      apply(currentPercentRef.current)
    }

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || TRACKED_STORAGE_KEYS.has(event.key)) {
        syncColorVariation()
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

    syncColorVariation()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('orb-settings-change', syncColorVariation)
    window.addEventListener('storage', handleStorage)

    return () => {
      unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('orb-settings-change', syncColorVariation)
      window.removeEventListener('storage', handleStorage)

      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])
}

export function AnimatedBackground() {
  useScrollDrivenOrbColors()

  return (
    <div className='pointer-events-none fixed inset-0 z-0' style={{ backgroundColor: '#030712' }}>
      {ORBS.map((orb) => (
        <div key={orb.className} className={`orb ${orb.className}`} style={getOrbStyle(orb)} />
      ))}

      {/* Subtle overlay for depth – reduced to keep orbs visible */}
      <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-gray-950/20 via-transparent to-gray-950/20 md:from-gray-950/40 md:to-gray-950/40' />

      {/* Vignette – lighter on mobile (see .orb-vignette) */}
      <div className='orb-vignette pointer-events-none absolute inset-0' />
    </div>
  )
}
