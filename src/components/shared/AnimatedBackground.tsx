// style-boundary-ignore-file: orb animation uses JS-computed inline styles (size, position, filter, duration) – cannot be expressed as static Tailwind classes
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

import { ANIMATION_CONFIG } from '@/lib/constants'
import { DEFAULT_COLOR_VARIATION, resolveOrbBaseColor, resolveOrbVariantColors } from '@/lib/orb-color'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

type OrbSettings = {
  orbBrightness: number
  animationSpeed: number
  colorVariation: number
  orbSize: number
  orbBlur: number
  orbOpacity: number
  positionVariation: number
}

type OrbConfig = {
  className: string
  baseTop: number
  baseLeft: number
  seed: number
  size: number
  opacity: number
  blur: number
  durationSeconds: number
  /** 0 = base color, 1..6 = hue-shifted variants (see ORB_HUE_OFFSETS) */
  colorSlot: number
  desktopOnly?: boolean
}

const ORBS: readonly OrbConfig[] = [
  // Central main orb - biggest, primary color
  {
    className: 'orb-1',
    baseTop: 50,
    baseLeft: 50,
    seed: 0,
    size: 800,
    opacity: 0.14,
    blur: 120,
    durationSeconds: 45,
    colorSlot: 0,
  },
  // Secondary orbs - hue shifted variations
  {
    className: 'orb-2',
    baseTop: 25,
    baseLeft: 25,
    seed: 1,
    size: 600,
    opacity: 0.11,
    blur: 100,
    durationSeconds: 38,
    colorSlot: 1,
  },
  {
    className: 'orb-3',
    baseTop: 75,
    baseLeft: 75,
    seed: 2,
    size: 650,
    opacity: 0.12,
    blur: 110,
    durationSeconds: 42,
    colorSlot: 2,
  },
  // Tertiary accent orbs - smaller, more vibrant
  {
    className: 'orb-4',
    baseTop: 33,
    baseLeft: 66,
    seed: 3,
    size: 500,
    opacity: 0.1,
    blur: 90,
    durationSeconds: 40,
    colorSlot: 3,
  },
  {
    className: 'orb-5',
    baseTop: 75,
    baseLeft: 33,
    seed: 4,
    size: 550,
    opacity: 0.11,
    blur: 95,
    durationSeconds: 36,
    colorSlot: 4,
  },
  // Extreme hue shifts for maximum variation
  {
    className: 'orb-6',
    baseTop: 66,
    baseLeft: 66,
    seed: 5,
    size: 700,
    opacity: 0.12,
    blur: 115,
    durationSeconds: 44,
    colorSlot: 5,
  },
  // Additional accent orbs stay desktop-only to reduce mobile rendering cost
  {
    className: 'orb-7',
    baseTop: 50,
    baseLeft: 50,
    seed: 6,
    size: 600,
    opacity: 0.11,
    blur: 105,
    durationSeconds: 50,
    colorSlot: 6,
    desktopOnly: true,
  },
  {
    className: 'orb-8',
    baseTop: 66,
    baseLeft: 33,
    seed: 7,
    size: 550,
    opacity: 0.1,
    blur: 100,
    durationSeconds: 46,
    colorSlot: 1,
    desktopOnly: true,
  },
]

const MOBILE_POSITIONS = [
  { top: 24, left: 26 },
  { top: 18, left: 74 },
  { top: 46, left: 16 },
  { top: 44, left: 82 },
  { top: 74, left: 28 },
  { top: 72, left: 72 },
  { top: 58, left: 50 },
  { top: 32, left: 54 },
] as const

const DEFAULT_SETTINGS: OrbSettings = {
  orbBrightness: 0.5, // Hidden, controlled by opacity
  animationSpeed: 3.0,
  colorVariation: DEFAULT_COLOR_VARIATION,
  orbSize: 1.2,
  orbBlur: 1.0,
  orbOpacity: 0.85, // Subtle default – text stays readable
  positionVariation: 1.0, // 100% = default positions
}

const TRACKED_STORAGE_KEYS = new Set([
  'orb_brightness',
  'animation_speed',
  'color_variation',
  'orb_size',
  'orb_blur',
  'orb_opacity',
  'position_variation',
])

/** CSS custom property holding the color of an orb slot. Fallbacks match scroll position 0 so first paint is correct. */
const orbColorVar = (slot: number) => `--orb-c${slot}`

const INITIAL_BASE_COLOR = resolveOrbBaseColor(0)
const INITIAL_SLOT_COLORS = [
  `rgb(${INITIAL_BASE_COLOR.r}, ${INITIAL_BASE_COLOR.g}, ${INITIAL_BASE_COLOR.b})`,
  ...resolveOrbVariantColors(INITIAL_BASE_COLOR, DEFAULT_COLOR_VARIATION),
]

function orbBackground(slot: number) {
  return `radial-gradient(circle, var(${orbColorVar(slot)}, ${INITIAL_SLOT_COLORS[slot]}) 0%, transparent 70%)`
}

function readSettingsFromCss(): OrbSettings {
  const rootStyles = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: number) => parseFloat(rootStyles.getPropertyValue(name) || String(fallback))

  return {
    orbBrightness: read('--orb-brightness', DEFAULT_SETTINGS.orbBrightness),
    animationSpeed: read('--animation-speed', DEFAULT_SETTINGS.animationSpeed),
    colorVariation: read('--color-variation', DEFAULT_SETTINGS.colorVariation),
    orbSize: read('--orb-size', DEFAULT_SETTINGS.orbSize),
    orbBlur: read('--orb-blur', DEFAULT_SETTINGS.orbBlur),
    orbOpacity: read('--orb-opacity', DEFAULT_SETTINGS.orbOpacity),
    positionVariation: read('--position-variation', DEFAULT_SETTINGS.positionVariation),
  }
}

/** Deterministic pseudo-random offset in [0, 1) so orb placement is stable between renders. */
function seededFraction(seed: number, multiplier: number) {
  const value = Math.sin(seed * multiplier) * 43758.5453
  return value - Math.floor(value)
}

function useIsMobile() {
  // Start false (SSR-safe), update before paint on the client
  const [isMobile, setIsMobile] = useState(false)

  useLayoutEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return isMobile
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return prefersReducedMotion
}

let settingsSnapshot = DEFAULT_SETTINGS

function subscribeToOrbSettings(onChange: () => void) {
  const handleSettingsEvent = (event: Event) => {
    const { detail } = event as CustomEvent<OrbSettings>
    if (detail) {
      settingsSnapshot = detail
      onChange()
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || TRACKED_STORAGE_KEYS.has(event.key)) {
      settingsSnapshot = readSettingsFromCss()
      onChange()
    }
  }

  settingsSnapshot = readSettingsFromCss()
  window.addEventListener('orb-settings-change', handleSettingsEvent)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener('orb-settings-change', handleSettingsEvent)
    window.removeEventListener('storage', handleStorage)
  }
}

/** Orb settings live in CSS custom properties (written by the developer console); mirror them into React. */
function useOrbSettings() {
  return useSyncExternalStore(
    subscribeToOrbSettings,
    () => settingsSnapshot,
    () => DEFAULT_SETTINGS,
  )
}

/**
 * Smoothly follows the page scroll position and writes the resulting colors straight to CSS custom properties.
 * Nothing here touches React state, so scrolling never re-renders the background.
 */
function useScrollDrivenOrbColors(colorVariation: number, prefersReducedMotion: boolean) {
  const colorVariationRef = useRef(colorVariation)
  const currentPercentRef = useRef(0)
  const applyRef = useRef<(percent: number) => void>(() => {})

  useEffect(() => {
    colorVariationRef.current = colorVariation
    applyRef.current(currentPercentRef.current)
  }, [colorVariation])

  useEffect(() => {
    const root = document.documentElement
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

    applyRef.current = apply

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

      if (prefersReducedMotion) {
        apply(target)
        return
      }

      schedule()
    })

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && Math.abs(target - currentPercentRef.current) > 0) {
        schedule()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [prefersReducedMotion])
}

export function AnimatedBackground() {
  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()
  const settings = useOrbSettings()
  const { orbBrightness, animationSpeed, orbSize, orbBlur, orbOpacity, positionVariation } = settings

  useScrollDrivenOrbColors(settings.colorVariation, prefersReducedMotion)

  // Fixed minimal vignette style (no longer controllable)
  const vignetteStyle = isMobile
    ? 'radial-gradient(circle at center, transparent 0%, transparent 44%, rgba(3, 7, 18, 0.1) 70%, rgba(3, 7, 18, 0.2) 100%)'
    : 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(3, 7, 18, 0.2) 70%, rgba(3, 7, 18, 0.5) 100%)'

  // Position variation - Mobile: subtle spread, Desktop: ±30%
  const maxVariation = isMobile ? 8 : 30
  const posVariation = (positionVariation - 1) * maxVariation

  // On mobile, scale down orb sizes to fit viewport
  const mobileSizeMultiplier = isMobile ? 0.4 : 1.0
  const mobileOpacityMultiplier = isMobile ? 0.8 : 1

  const getOrbMotionStyle = (blurValue: number, durationSeconds: number) => {
    if (prefersReducedMotion) {
      return {
        animation: 'none',
        filter: 'none',
        willChange: 'auto',
      }
    }

    const effectiveBlur = isMobile ? blurValue * orbBlur * 0.62 : blurValue * orbBlur
    const effectiveBrightness = isMobile ? Math.max(0.72, Math.min(0.95, orbBrightness * 1.2)) : orbBrightness

    return {
      filter: `blur(${effectiveBlur}px) brightness(${effectiveBrightness})`,
      animationDuration: `${durationSeconds / animationSpeed}s`,
      willChange: 'transform',
    }
  }

  const getPosition = (baseTop: number, baseLeft: number, seed: number) => {
    // On mobile, spread orbs across the full canvas to avoid center clustering
    const anchor = isMobile ? MOBILE_POSITIONS[seed % MOBILE_POSITIONS.length] : { top: baseTop, left: baseLeft }

    return {
      top: `${anchor.top + seededFraction(seed, 12.9898) * posVariation}%`,
      left: `${anchor.left + seededFraction(seed, 78.233) * posVariation}%`,
      // Center orbs around their position using transform
      transform: 'translate(-50%, -50%)',
    }
  }

  return (
    <div className='pointer-events-none fixed inset-0 z-0' style={{ backgroundColor: '#030712' }}>
      {ORBS.filter((orb) => !(orb.desktopOnly && isMobile)).map((orb) => {
        const sizePx = orb.size * orbSize * mobileSizeMultiplier

        return (
          <div
            key={orb.className}
            className={`${orb.className} absolute`}
            style={{
              ...getPosition(orb.baseTop, orb.baseLeft, orb.seed),
              width: `${sizePx}px`,
              height: `${sizePx}px`,
              background: orbBackground(orb.colorSlot),
              opacity: orb.opacity * orbOpacity * mobileOpacityMultiplier,
              ...getOrbMotionStyle(orb.blur, orb.durationSeconds),
            }}
          />
        )
      })}

      {/* Subtle overlay for depth – reduced to keep orbs visible */}
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-b ${
          isMobile
            ? 'from-gray-950/20 via-transparent to-gray-950/20'
            : 'from-gray-950/40 via-transparent to-gray-950/40'
        }`}
      />

      {/* VIGNETTE EFFECT - controllable via easter egg */}
      <div
        className='pointer-events-none absolute inset-0 transition-all duration-500'
        style={{
          background: vignetteStyle,
        }}
      />
    </div>
  )
}
