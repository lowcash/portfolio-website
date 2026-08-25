// style-boundary-ignore-file: orb animation uses JS-computed inline styles (size, position, filter, duration) – cannot be expressed as static Tailwind classes
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { ANIMATION_CONFIG, SECTION_COUNT } from '@/lib/constants'
import { ORB_COLORS } from '@/lib/section-config'

type OrbSettings = {
  orbBrightness: number
  animationSpeed: number
  colorVariation: number
  orbSize: number
  orbBlur: number
  orbOpacity: number
  positionVariation: number
}

/**
 * Generate color breakpoints dynamically based on section count
 * Each section gets equal percentage space across the scroll range
 */
const generateColorBreakpoints = () => {
  const percentPerSection = 100 / (SECTION_COUNT - 1)

  return ORB_COLORS.map((color, index) => ({
    percent: index * percentPerSection,
    ...color,
  }))
}

const COLOR_BREAKPOINTS = generateColorBreakpoints()
const TARGET_SCROLL_EPSILON = 0.05

/**
 * Linear interpolation helper
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Convert RGB to HSL, shift hue AND boost saturation for visible color differences
 */
function shiftHue(r: number, g: number, b: number, hueDelta: number): string {
  // Normalize RGB to 0-1
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  let l = (max + min) / 2
  let s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  if (delta !== 0) {
    if (max === rNorm) {
      h = 60 * (((gNorm - bNorm) / delta) % 6)
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / delta + 2)
    } else {
      h = 60 * ((rNorm - gNorm) / delta + 4)
    }
  }

  // Shift hue
  h = (h + hueDelta) % 360
  if (h < 0) h += 360

  // BOOST SATURATION for visible differences (multiply by 1.8, cap at 1.0)
  s = Math.min(1.0, s * 1.8)

  // BOOST LIGHTNESS slightly to make colors more vibrant
  l = Math.min(0.65, l * 1.15)

  // Convert back to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let rOut = 0,
    gOut = 0,
    bOut = 0

  if (h < 60) {
    rOut = c
    gOut = x
    bOut = 0
  } else if (h < 120) {
    rOut = x
    gOut = c
    bOut = 0
  } else if (h < 180) {
    rOut = 0
    gOut = c
    bOut = x
  } else if (h < 240) {
    rOut = 0
    gOut = x
    bOut = c
  } else if (h < 300) {
    rOut = x
    gOut = 0
    bOut = c
  } else {
    rOut = c
    gOut = 0
    bOut = x
  }

  const rFinal = Math.round((rOut + m) * 255)
  const gFinal = Math.round((gOut + m) * 255)
  const bFinal = Math.round((bOut + m) * 255)

  return `rgb(${rFinal}, ${gFinal}, ${bFinal})`
}

export function AnimatedBackground() {
  const [targetScrollPercent, setTargetScrollPercent] = useState(0)
  const [smoothScrollPercent, setSmoothScrollPercent] = useState(0)
  const smoothScrollPercentRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const lastCssValuesRef = useRef<{
    scrollProgress: string
    scrollPercent: string
    orbR: string
    orbG: string
    orbB: string
  } | null>(null)

  // Easter egg settings from CSS custom properties
  const [orbBrightness, setOrbBrightness] = useState(0.5) // Hidden, controlled by opacity
  const [animationSpeed, setAnimationSpeed] = useState(3.0)
  const [colorVariation, setColorVariation] = useState(0.4) // 40%
  const [orbSize, setOrbSize] = useState(1.2)
  const [orbBlur, setOrbBlur] = useState(1.0)
  const [orbOpacity, setOrbOpacity] = useState(0.85) // Subtle default – text stays readable
  const [positionVariation, setPositionVariation] = useState(1.0) // 100% = default positions

  // Track window width for responsive vignette – start false (SSR-safe), update on client mount
  const [isMobile, setIsMobile] = useState(false)

  // Update isMobile on resize – useLayoutEffect runs synchronously before paint (client-only)
  useLayoutEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  // Read settings from CSS custom properties
  useEffect(() => {
    const applySettings = (settings: OrbSettings) => {
      const {
        orbBrightness: brightness,
        animationSpeed: speed,
        colorVariation: variation,
        orbSize: size,
        orbBlur: blur,
        orbOpacity: opacity,
        positionVariation: posVar,
      } = settings

      setOrbBrightness(brightness)
      setAnimationSpeed(speed)
      setColorVariation(variation)
      setOrbSize(size)
      setOrbBlur(blur)
      setOrbOpacity(opacity)
      setPositionVariation(posVar)
    }

    const readSettingsFromCss = (): OrbSettings => {
      const rootStyles = getComputedStyle(document.documentElement)

      return {
        orbBrightness: parseFloat(rootStyles.getPropertyValue('--orb-brightness') || '0.5'),
        animationSpeed: parseFloat(rootStyles.getPropertyValue('--animation-speed') || '3.0'),
        colorVariation: parseFloat(rootStyles.getPropertyValue('--color-variation') || '0.4'),
        orbSize: parseFloat(rootStyles.getPropertyValue('--orb-size') || '1.2'),
        orbBlur: parseFloat(rootStyles.getPropertyValue('--orb-blur') || '1.0'),
        orbOpacity: parseFloat(rootStyles.getPropertyValue('--orb-opacity') || '0.85'),
        positionVariation: parseFloat(rootStyles.getPropertyValue('--position-variation') || '1.0'),
      }
    }

    const handleSettingsEvent = (event: Event) => {
      const customEvent = event as CustomEvent<OrbSettings>
      if (customEvent.detail) {
        applySettings(customEvent.detail)
      }
    }

    const handleStorage = (event: StorageEvent) => {
      const trackedKeys = new Set([
        'orb_brightness',
        'animation_speed',
        'color_variation',
        'orb_size',
        'orb_blur',
        'orb_opacity',
        'position_variation',
      ])

      if (!event.key || trackedKeys.has(event.key)) {
        applySettings(readSettingsFromCss())
      }
    }

    applySettings(readSettingsFromCss())
    window.addEventListener('orb-settings-change', handleSettingsEvent as EventListener)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('orb-settings-change', handleSettingsEvent as EventListener)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // RAW SCROLL TRACKING - set target (SKIP when mobile menu is open to prevent progress bar jumping to 0)
  useEffect(() => {
    const handleScroll = () => {
      // Check if mobile menu is open by checking if body has position: fixed
      const body = document.body
      const isMenuOpen = body.style.position === 'fixed'

      // SKIP scroll tracking when menu is open - prevents progress bar from jumping to 0
      if (isMenuOpen) {
        return
      }

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const maxScroll = docHeight - winHeight

      const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      const nextTarget = Math.min(100, Math.max(0, percent))

      setTargetScrollPercent((previous) => {
        if (Math.abs(nextTarget - previous) < TARGET_SCROLL_EPSILON) {
          return previous
        }
        return nextTarget
      })
    }

    handleScroll() // Initial
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // SMOOTH INTERPOLATION - RAF loop
  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const animate = () => {
      if (document.visibilityState !== 'visible') {
        rafRef.current = null
        return
      }

      let shouldContinue = false

      setSmoothScrollPercent((prev) => {
        const diff = targetScrollPercent - prev

        // Pokud je rozdíl malý, snap to target
        if (Math.abs(diff) < ANIMATION_CONFIG.SMOOTH_SCROLL_SNAP_THRESHOLD) {
          smoothScrollPercentRef.current = targetScrollPercent
          return targetScrollPercent
        }

        const nextValue = prev + diff * ANIMATION_CONFIG.SMOOTH_SCROLL_EASING
        smoothScrollPercentRef.current = nextValue
        shouldContinue = true
        return nextValue
      })

      if (shouldContinue) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        rafRef.current = null
      }
    }

    const handleVisibilityChange = () => {
      const diff = Math.abs(targetScrollPercent - smoothScrollPercentRef.current)
      if (document.visibilityState === 'visible' && rafRef.current === null && diff > 0) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = null
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [prefersReducedMotion, targetScrollPercent])

  // Calculate segment (0 to SECTION_COUNT-2)
  const effectiveScrollPercent = prefersReducedMotion ? targetScrollPercent : smoothScrollPercent
  const percentPerSegment = 100 / (SECTION_COUNT - 1)
  const segmentIndex = Math.min(SECTION_COUNT - 2, Math.floor(effectiveScrollPercent / percentPerSegment))

  // Local progress within current segment (0-1)
  const segmentStart = segmentIndex * percentPerSegment
  const segmentProgress = Math.min(1, Math.max(0, (effectiveScrollPercent - segmentStart) / percentPerSegment))

  // Barvy pro aktuální segment
  const colorFrom = COLOR_BREAKPOINTS[segmentIndex]
  const colorTo = COLOR_BREAKPOINTS[segmentIndex + 1]

  // INTERPOLOVAT v JavaScriptu
  const interpolatedR = Math.round(lerp(colorFrom.r, colorTo.r, segmentProgress))
  const interpolatedG = Math.round(lerp(colorFrom.g, colorTo.g, segmentProgress))
  const interpolatedB = Math.round(lerp(colorFrom.b, colorTo.b, segmentProgress))

  // Nastavit CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    const roundedPercent = Math.round(effectiveScrollPercent * 20) / 20
    const progressValue = String(roundedPercent / 100)
    const percentValue = String(roundedPercent)
    const rValue = String(interpolatedR)
    const gValue = String(interpolatedG)
    const bValue = String(interpolatedB)
    const previous = lastCssValuesRef.current
    const nextValues = {
      scrollProgress: progressValue,
      scrollPercent: percentValue,
      orbR: rValue,
      orbG: gValue,
      orbB: bValue,
    }

    if (previous?.scrollProgress !== nextValues.scrollProgress) {
      root.style.setProperty('--scroll-progress', nextValues.scrollProgress)
    }
    if (previous?.scrollPercent !== nextValues.scrollPercent) {
      root.style.setProperty('--scroll-percent', nextValues.scrollPercent)
    }
    if (previous?.orbR !== nextValues.orbR) {
      root.style.setProperty('--orb-r', nextValues.orbR)
    }
    if (previous?.orbG !== nextValues.orbG) {
      root.style.setProperty('--orb-g', nextValues.orbG)
    }
    if (previous?.orbB !== nextValues.orbB) {
      root.style.setProperty('--orb-b', nextValues.orbB)
    }

    lastCssValuesRef.current = nextValues
  }, [effectiveScrollPercent, interpolatedR, interpolatedG, interpolatedB])

  const orbColor = `rgb(${interpolatedR}, ${interpolatedG}, ${interpolatedB})`

  // Create color variations for different orbs (hue shifts with controllable intensity)
  // MASSIVE SHIFTS for CLEARLY VISIBLE differences: ±90°, ±60°, ±120°
  const orbColor1 = shiftHue(interpolatedR, interpolatedG, interpolatedB, -90 * colorVariation) // COOL - completely different hue
  const orbColor2 = shiftHue(interpolatedR, interpolatedG, interpolatedB, 90 * colorVariation) // WARM - completely different hue
  const orbColor3 = shiftHue(interpolatedR, interpolatedG, interpolatedB, -60 * colorVariation)
  const orbColor4 = shiftHue(interpolatedR, interpolatedG, interpolatedB, 60 * colorVariation)
  const orbColor5 = shiftHue(interpolatedR, interpolatedG, interpolatedB, -120 * colorVariation) // EXTREME cool
  const orbColor6 = shiftHue(interpolatedR, interpolatedG, interpolatedB, 120 * colorVariation) // EXTREME warm

  // Fixed minimal vignette style (no longer controllable)
  const vignetteStyle = isMobile
    ? 'radial-gradient(circle at center, transparent 0%, transparent 44%, rgba(3, 7, 18, 0.1) 70%, rgba(3, 7, 18, 0.2) 100%)'
    : 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(3, 7, 18, 0.2) 70%, rgba(3, 7, 18, 0.5) 100%)'

  // Position variation - randomize positions based on slider
  const maxVariation = isMobile ? 8 : 30 // Mobile: subtle spread, Desktop: ±30%
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
    // On mobile, spread orbs across the full canvas to avoid center clustering.
    let adjustedTop, adjustedLeft

    if (isMobile) {
      const mobilePositions = [
        { top: 24, left: 26 },
        { top: 18, left: 74 },
        { top: 46, left: 16 },
        { top: 44, left: 82 },
        { top: 74, left: 28 },
        { top: 72, left: 72 },
        { top: 58, left: 50 },
        { top: 32, left: 54 },
      ] as const
      const preset = mobilePositions[seed % mobilePositions.length]
      adjustedTop = preset.top
      adjustedLeft = preset.left
    } else {
      // Desktop: use original positions
      adjustedTop = baseTop
      adjustedLeft = baseLeft
    }

    // Simple pseudo-random based on seed (deterministic)
    const random1 = Math.sin(seed * 12.9898) * 43758.5453
    const random2 = Math.sin(seed * 78.233) * 43758.5453
    const offsetTop = (random1 - Math.floor(random1)) * posVariation
    const offsetLeft = (random2 - Math.floor(random2)) * posVariation

    // Apply offsets
    const finalTop = adjustedTop + offsetTop
    const finalLeft = adjustedLeft + offsetLeft

    return {
      top: `${finalTop}%`,
      left: `${finalLeft}%`,
      // Center orbs around their position using transform
      transform: 'translate(-50%, -50%)',
    }
  }

  return (
    <div className='pointer-events-none fixed inset-0 z-0' style={{ backgroundColor: '#030712' }}>
      {/* ============ ANIMATED ORBS ============ */}
      {/* Central main orb - největší, primární barva */}
      <div
        className='orb-1 absolute'
        style={{
          ...getPosition(50, 50, 0),
          width: `${800 * orbSize * mobileSizeMultiplier}px`,
          height: `${800 * orbSize * mobileSizeMultiplier}px`,
          background: `radial-gradient(circle, ${orbColor} 0%, transparent 70%)`,
          opacity: 0.14 * orbOpacity * mobileOpacityMultiplier,
          ...getOrbMotionStyle(120, 45),
        }}
      />

      {/* Secondary orbs - hue shifted variations */}
      <div
        className='orb-2 absolute'
        style={{
          ...getPosition(25, 25, 1),
          width: `${600 * orbSize * mobileSizeMultiplier}px`,
          height: `${600 * orbSize * mobileSizeMultiplier}px`,
          background: `radial-gradient(circle, ${orbColor1} 0%, transparent 70%)`,
          opacity: 0.11 * orbOpacity * mobileOpacityMultiplier,
          ...getOrbMotionStyle(100, 38),
        }}
      />

      <div
        className='orb-3 absolute'
        style={{
          ...getPosition(75, 75, 2),
          width: `${650 * orbSize * mobileSizeMultiplier}px`,
          height: `${650 * orbSize * mobileSizeMultiplier}px`,
          background: `radial-gradient(circle, ${orbColor2} 0%, transparent 70%)`,
          opacity: 0.12 * orbOpacity * mobileOpacityMultiplier,
          ...getOrbMotionStyle(110, 42),
        }}
      />

      {/* Tertiary accent orbs - smaller, more vibrant */}
      <div
        className='orb-4 absolute'
        style={{
          ...getPosition(33, 66, 3),
          width: `${500 * orbSize * mobileSizeMultiplier}px`,
          height: `${500 * orbSize * mobileSizeMultiplier}px`,
          background: `radial-gradient(circle, ${orbColor3} 0%, transparent 70%)`,
          opacity: 0.1 * orbOpacity * mobileOpacityMultiplier,
          ...getOrbMotionStyle(90, 40),
        }}
      />

      <div
        className='orb-5 absolute'
        style={{
          ...getPosition(75, 33, 4),
          width: `${550 * orbSize * mobileSizeMultiplier}px`,
          height: `${550 * orbSize * mobileSizeMultiplier}px`,
          background: `radial-gradient(circle, ${orbColor4} 0%, transparent 70%)`,
          opacity: 0.11 * orbOpacity * mobileOpacityMultiplier,
          ...getOrbMotionStyle(95, 36),
        }}
      />

      {/* Extreme hue shifts for maximum variation */}
      <div
        className='orb-6 absolute'
        style={{
          ...getPosition(66, 66, 5),
          width: `${700 * orbSize * mobileSizeMultiplier}px`,
          height: `${700 * orbSize * mobileSizeMultiplier}px`,
          background: `radial-gradient(circle, ${orbColor5} 0%, transparent 70%)`,
          opacity: 0.12 * orbOpacity * mobileOpacityMultiplier,
          ...getOrbMotionStyle(115, 44),
        }}
      />

      {/* Additional accent orbs stay desktop-only to reduce mobile rendering cost */}
      {!isMobile && (
        <>
          <div
            className='orb-7 absolute'
            style={{
              ...getPosition(50, 50, 6),
              width: `${600 * orbSize * mobileSizeMultiplier}px`,
              height: `${600 * orbSize * mobileSizeMultiplier}px`,
              background: `radial-gradient(circle, ${orbColor6} 0%, transparent 70%)`,
              opacity: 0.11 * orbOpacity * mobileOpacityMultiplier,
              ...getOrbMotionStyle(105, 50),
            }}
          />

          <div
            className='orb-8 absolute'
            style={{
              ...getPosition(66, 33, 7),
              width: `${550 * orbSize * mobileSizeMultiplier}px`,
              height: `${550 * orbSize * mobileSizeMultiplier}px`,
              background: `radial-gradient(circle, ${orbColor1} 0%, transparent 70%)`,
              opacity: 0.1 * orbOpacity * mobileOpacityMultiplier,
              ...getOrbMotionStyle(100, 46),
            }}
          />
        </>
      )}

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
