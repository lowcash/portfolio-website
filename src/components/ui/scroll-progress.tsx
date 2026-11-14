import { useEffect, useRef } from 'react'

import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

const PROGRESS_HIDE_THRESHOLD = 0.003

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return subscribeToScrollMetrics((metrics) => {
      const bar = barRef.current
      if (!bar) {
        return
      }

      const progress = metrics.progress
      const progressPercent = Math.round(progress * 100)
      const isVisible = progress > PROGRESS_HIDE_THRESHOLD

      bar.style.transform = `scaleX(${progress})`
      bar.style.opacity = isVisible ? '1' : '0'
      bar.setAttribute('aria-valuenow', String(progressPercent))
    })
  }, [])

  return (
    <div
      ref={barRef}
      className='pointer-events-none fixed top-0 right-0 left-0 h-1'
      role='progressbar'
      aria-label='Page scroll progress'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      style={{
        background: 'rgb(var(--orb-r), var(--orb-g), var(--orb-b))',
        width: '100%',
        transformOrigin: 'left',
        zIndex: 'var(--z-progress)',
        transform: 'scaleX(0)',
        opacity: 0,
        transition: 'opacity 160ms ease-out',
      }}
    />
  )
}
