import { describe, expect, it } from 'vitest'

import { ORB_COLORS } from '@/lib/section-config'

import { adjustOrbColor, resolveOrbBaseColor, resolveOrbVariantColors, shiftHue } from './orb-color'

describe('resolveOrbBaseColor', () => {
  it('returns the hero color at the top and the contact color at the bottom', () => {
    expect(resolveOrbBaseColor(0)).toEqual(ORB_COLORS[0])
    expect(resolveOrbBaseColor(100)).toEqual(ORB_COLORS[3])
  })

  it('returns the section color exactly on a breakpoint', () => {
    expect(resolveOrbBaseColor(100 / 3)).toEqual(ORB_COLORS[1])
  })

  it('interpolates halfway between two sections', () => {
    const mid = resolveOrbBaseColor(100 / 6)
    expect(mid.r).toBe(Math.round((ORB_COLORS[0].r + ORB_COLORS[1].r) / 2))
  })
})

describe('shiftHue', () => {
  it('keeps the hue when delta is zero but still boosts saturation', () => {
    expect(shiftHue({ r: 236, g: 72, b: 153 }, 0)).toMatch(/^rgb\(\d+, \d+, \d+\)$/)
  })

  it('is periodic over 360 degrees', () => {
    const base = { r: 99, g: 102, b: 241 }
    expect(shiftHue(base, 360)).toBe(shiftHue(base, 0))
  })

  it('maps greys to grey', () => {
    const [r, g, b] = shiftHue({ r: 128, g: 128, b: 128 }, 90).match(/\d+/g)!.map(Number)
    expect(r).toBe(g)
    expect(g).toBe(b)
  })
})

describe('resolveOrbVariantColors', () => {
  it('returns six variants', () => {
    expect(resolveOrbVariantColors(ORB_COLORS[0], 0.4)).toHaveLength(6)
  })
})

describe('adjustOrbColor', () => {
  const pink = { r: 236, g: 72, b: 153 }

  it('is the identity at hue 0 and saturation 1', () => {
    expect(adjustOrbColor(pink, 0, 1)).toBe(pink)
  })

  it('removes all color at saturation 0', () => {
    const { r, g, b } = adjustOrbColor(pink, 0, 0)
    expect(r).toBe(g)
    expect(g).toBe(b)
  })

  it('rotates a full circle back to (almost) the same color', () => {
    const rotated = adjustOrbColor(pink, 360, 1)
    expect(Math.abs(rotated.r - pink.r)).toBeLessThanOrEqual(1)
    expect(Math.abs(rotated.g - pink.g)).toBeLessThanOrEqual(1)
    expect(Math.abs(rotated.b - pink.b)).toBeLessThanOrEqual(1)
  })

  it('moves pink toward orange when rotating forward', () => {
    const warm = adjustOrbColor(pink, 40, 1)
    expect(warm.b).toBeLessThan(pink.b)
    expect(warm.g).toBeGreaterThan(pink.g)
  })
})
