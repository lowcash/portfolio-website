/** Seeded random walk behind the hero chart: deterministic, so server HTML and tests always agree. */

export const HERO_SERIES_SEED = 174
export const HERO_SERIES_LENGTH = 160

export const CHART_WIDTH = 1200
export const CHART_HEIGHT = 240
export const CHART_PAD = 20

// Drift and volatility clustering (GARCH-like) were picked so seed 174 reads as a rising market, not as noise
const DRIFT = 0.0006
const BASE_SIGMA = 0.0034
const ALPHA = 0.1
const BETA = 0.8

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomWalk(seed: number, length: number): number[] {
  const random = mulberry32(seed)
  const gauss = () => Math.sqrt(-2 * Math.log(random() || 1e-9)) * Math.cos(2 * Math.PI * random())
  const omega = BASE_SIGMA * BASE_SIGMA * (1 - ALPHA - BETA)
  let variance = BASE_SIGMA * BASE_SIGMA
  let price = 1
  const values = [price]

  for (let index = 1; index < length; index++) {
    const step = DRIFT + Math.sqrt(variance) * gauss()
    price *= Math.exp(step)
    values.push(price)
    variance = omega + ALPHA * (step - DRIFT) ** 2 + BETA * variance
  }

  return values
}

type Tick = { label: string; topPercent: number }

export type ChartGeometry = {
  points: Array<[number, number]>
  min: number
  max: number
  ticks: Tick[]
  lastTopPercent: number
}

const round1 = (value: number) => Math.round(value * 10) / 10

/** Maps the series into the 1200x240 viewBox (y grows downwards, padded) and derives grid lines every 0.02. */
export function buildChart(values: readonly number[]): ChartGeometry {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const toY = (value: number) =>
    CHART_HEIGHT - CHART_PAD - ((value - min) / (max - min)) * (CHART_HEIGHT - 2 * CHART_PAD)
  const points = values.map((value, index): [number, number] => [
    round1((index / (values.length - 1)) * CHART_WIDTH),
    round1(toY(value)),
  ])

  const ticks: Tick[] = []
  for (let tick = Math.ceil(min * 50) / 50; tick <= max; tick = Math.round((tick + 0.02) * 100) / 100) {
    ticks.push({ label: tick.toFixed(2), topPercent: Math.round((toY(tick) / CHART_HEIGHT) * 10000) / 100 })
  }

  return {
    points,
    min,
    max,
    ticks,
    lastTopPercent: Math.round((points[points.length - 1][1] / CHART_HEIGHT) * 10000) / 100,
  }
}

export const toPointsAttribute = (points: ChartGeometry['points']) => points.map(([x, y]) => `${x},${y}`).join(' ')

export const toAreaPath = (points: ChartGeometry['points']) =>
  `M0,${CHART_HEIGHT} L${points.map(([x, y]) => `${x},${y}`).join(' L')} L${CHART_WIDTH},${CHART_HEIGHT} Z`
