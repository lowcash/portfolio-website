'use client'

import { useEffect, useRef } from 'react'

import { CHART_HEIGHT, CHART_PAD, CHART_WIDTH } from '@/lib/series'

/**
 * Hero crosshair: fine pointers only. A hairline playhead passes behind the name and snaps a marker to the series
 * with a readout. Transform writes only, rAF-throttled, pointer-events none.
 */
export function HeroCrosshair() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const hero = document.getElementById('hero')
    const chart = document.getElementById('chart')
    const series = document.getElementById('series')

    if (
      !root ||
      !hero ||
      !chart ||
      !series ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return
    }

    const [line, dot, read] = Array.from(root.children) as HTMLElement[]
    const pts = (series.getAttribute('points') ?? '')
      .trim()
      .split(/\s+/)
      .map((pair) => pair.split(',').map(Number))
    const min = Number(series.dataset.min)
    const max = Number(series.dataset.max)
    const pad = Number(series.dataset.pad ?? CHART_PAD)

    let box: DOMRect | null = null
    let chartBox: DOMRect | null = null
    let pointerX = 0
    let queued = false

    const measure = () => {
      box = hero.getBoundingClientRect()
      chartBox = chart.getBoundingClientRect()
    }

    const draw = () => {
      queued = false
      if (!box || !chartBox) return

      const width = box.width
      const index = Math.min(pts.length - 1, Math.max(0, Math.round((pointerX / width) * (pts.length - 1))))
      const x = (pts[index][0] / CHART_WIDTH) * width
      const y = chartBox.top - box.top + (pts[index][1] / CHART_HEIGHT) * chartBox.height
      const value = min + ((CHART_HEIGHT - pad - pts[index][1]) / (CHART_HEIGHT - 2 * pad)) * (max - min)
      const flip = x > width - 190

      line.style.transform = `translate3d(${x}px,0,0)`
      dot.style.transform = `translate3d(${x}px,${y}px,0)`
      read.textContent = `t+${String(index).padStart(3, '0')}  ${value.toFixed(4)}`
      read.style.transform = `translate3d(${flip ? x - read.offsetWidth - 10 : x + 10}px,${chartBox.top - box.top - 4}px,0)`
    }

    const onEnter = () => {
      measure()
      root.classList.add('on')
    }
    const onLeave = () => root.classList.remove('on')
    const onMove = (event: PointerEvent) => {
      if (!box) measure()
      pointerX = event.clientX - (box?.left ?? 0)
      if (!queued) {
        queued = true
        requestAnimationFrame(draw)
      }
    }
    const invalidate = () => {
      box = null
    }

    hero.addEventListener('pointerenter', onEnter)
    hero.addEventListener('pointerleave', onLeave)
    hero.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', invalidate, { passive: true })
    window.addEventListener('scroll', invalidate, { passive: true })

    return () => {
      hero.removeEventListener('pointerenter', onEnter)
      hero.removeEventListener('pointerleave', onLeave)
      hero.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', invalidate)
      window.removeEventListener('scroll', invalidate)
    }
  }, [])

  return (
    <div className='xh' ref={rootRef} aria-hidden='true'>
      <span className='xh-v' />
      <span className='xh-dot' />
      <span className='xh-read mono' />
    </div>
  )
}
