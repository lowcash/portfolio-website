import {
  HERO_SERIES_LENGTH,
  HERO_SERIES_SEED,
  buildChart,
  randomWalk,
  toAreaPath,
  toPointsAttribute,
} from '@/lib/series'

const chart = buildChart(randomWalk(HERO_SERIES_SEED, HERO_SERIES_LENGTH))
const points = toPointsAttribute(chart.points)
const area = toAreaPath(chart.points)

/** The hero's time series: static SVG in the server HTML (seeded, so it never changes between renders). */
export function HeroChart() {
  return (
    <div className='chart' id='chart' aria-hidden='true'>
      <svg viewBox='0 0 1200 240' preserveAspectRatio='none' focusable='false'>
        <defs>
          <linearGradient id='area-fill' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopOpacity='0.16' />
            <stop offset='1' stopOpacity='0' />
          </linearGradient>
        </defs>
        <path className='area' d={area} />
        <polyline
          className='series'
          id='series'
          data-min={chart.min}
          data-max={chart.max}
          data-pad='20'
          points={points}
        />
      </svg>
      {chart.ticks.map((tick) => (
        <span key={tick.label} className='gl' style={{ top: `${tick.topPercent}%` }}>
          <span className='mono'>{tick.label}</span>
        </span>
      ))}
      <span className='last' style={{ top: `${chart.lastTopPercent}%` }} />
      <p className='fig mono'>
        fig. 0 — a random walk, seed {HERO_SERIES_SEED}, n = {HERO_SERIES_LENGTH}
      </p>
    </div>
  )
}
