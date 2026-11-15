import { describe, expect, it } from 'vitest'

import {
  CHART_HEIGHT,
  HERO_SERIES_LENGTH,
  HERO_SERIES_SEED,
  buildChart,
  randomWalk,
  toAreaPath,
  toPointsAttribute,
} from './series'

describe('randomWalk', () => {
  it('is deterministic and starts at 1', () => {
    const first = randomWalk(HERO_SERIES_SEED, HERO_SERIES_LENGTH)
    expect(first).toHaveLength(HERO_SERIES_LENGTH)
    expect(first[0]).toBe(1)
    expect(randomWalk(HERO_SERIES_SEED, HERO_SERIES_LENGTH)).toEqual(first)
  })

  it('differs for another seed', () => {
    expect(randomWalk(1, 20)).not.toEqual(randomWalk(2, 20))
  })
})

describe('buildChart', () => {
  const chart = buildChart(randomWalk(HERO_SERIES_SEED, HERO_SERIES_LENGTH))

  it('keeps every point inside the padded viewBox', () => {
    for (const [, y] of chart.points) {
      expect(y).toBeGreaterThanOrEqual(20)
      expect(y).toBeLessThanOrEqual(CHART_HEIGHT - 20)
    }
  })

  it('produces grid lines inside the series range, in percent of the chart height', () => {
    expect(chart.ticks.length).toBeGreaterThan(0)
    for (const tick of chart.ticks) {
      expect(Number(tick.label)).toBeGreaterThanOrEqual(chart.min - 1e-9)
      expect(Number(tick.label)).toBeLessThanOrEqual(chart.max + 1e-9)
      expect(tick.topPercent).toBeGreaterThan(0)
      expect(tick.topPercent).toBeLessThan(100)
    }
  })

  it('serialises to SVG attributes', () => {
    expect(toPointsAttribute(chart.points).split(' ')).toHaveLength(HERO_SERIES_LENGTH)
    expect(toAreaPath(chart.points).startsWith('M0,240 L')).toBe(true)
    expect(toAreaPath(chart.points).endsWith('Z')).toBe(true)
  })
})
