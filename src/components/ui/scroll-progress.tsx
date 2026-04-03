import { useEffect, useState } from 'react'

import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

const PROGRESS_HIDE_THRESHOLD = 0.003

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return subscribeToScrollMetrics((metrics) => {
      setProgress(metrics.progress)
    })
  }, [])

  const progressPercent = Math.round(progress * 100)
  const isVisible = progress > PROGRESS_HIDE_THRESHOLD

  return (
    <div
      className='pointer-events-none fixed top-0 right-0 left-0 h-1'
      role='progressbar'
      aria-label='Page scroll progress'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercent}
      style={{
        background: 'rgb(var(--orb-r), var(--orb-g), var(--orb-b))',
        width: '100%',
        transformOrigin: 'left',
        zIndex: 70,
        transform: `scaleX(${progress})`,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 160ms ease-out',
        willChange: 'transform, opacity, background-color',
      }}
    />
  )
}
