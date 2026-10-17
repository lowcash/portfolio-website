import { SECTION_COUNT } from '@/lib/constants'
import { ORB_COLORS } from '@/lib/section-config'

type Rgb = { r: number; g: number; b: number }

/** Hue offsets (degrees at colorVariation = 1) for orb color slots 1..6. Slot 0 is the base color. */
export const ORB_HUE_OFFSETS = [-90, 90, -60, 60, -120, 120] as const

export const DEFAULT_COLOR_VARIATION = 0.4

const PERCENT_PER_SEGMENT = 100 / (SECTION_COUNT - 1)

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Interpolated base orb color for a scroll position (0-100) across the section color breakpoints. */
export function resolveOrbBaseColor(scrollPercent: number): Rgb {
  const segmentIndex = Math.min(SECTION_COUNT - 2, Math.floor(scrollPercent / PERCENT_PER_SEGMENT))
  const segmentStart = segmentIndex * PERCENT_PER_SEGMENT
  const progress = Math.min(1, Math.max(0, (scrollPercent - segmentStart) / PERCENT_PER_SEGMENT))
  const from = ORB_COLORS[segmentIndex]
  const to = ORB_COLORS[segmentIndex + 1]

  return {
    r: Math.round(lerp(from.r, to.r, progress)),
    g: Math.round(lerp(from.g, to.g, progress)),
    b: Math.round(lerp(from.b, to.b, progress)),
  }
}

/** Shift hue, boost saturation (x1.8) and lightness (x1.15, capped) so orb variations read as distinct colors. */
export function shiftHue({ r, g, b }: Rgb, hueDelta: number): string {
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

  h = (h + hueDelta) % 360
  if (h < 0) h += 360

  s = Math.min(1, s * 1.8)
  l = Math.min(0.65, l * 1.15)

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let rOut = 0
  let gOut = 0
  let bOut = 0

  if (h < 60) {
    rOut = c
    gOut = x
  } else if (h < 120) {
    rOut = x
    gOut = c
  } else if (h < 180) {
    gOut = c
    bOut = x
  } else if (h < 240) {
    gOut = x
    bOut = c
  } else if (h < 300) {
    rOut = x
    bOut = c
  } else {
    rOut = c
    bOut = x
  }

  return `rgb(${Math.round((rOut + m) * 255)}, ${Math.round((gOut + m) * 255)}, ${Math.round((bOut + m) * 255)})`
}

/** Six hue-shifted variants of the base color for orb slots 1..6. */
export function resolveOrbVariantColors(base: Rgb, colorVariation: number): string[] {
  return ORB_HUE_OFFSETS.map((offset) => shiftHue(base, offset * colorVariation))
}
