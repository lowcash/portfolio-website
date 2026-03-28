import { useEffect, useRef, useState } from 'react'

const PROGRESS_HIDE_THRESHOLD = 0.003

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = maxScroll > 0 ? scrollTop / maxScroll : 0

      setProgress(Math.min(1, Math.max(0, nextProgress)))
      frameRef.current = null
    }

    const handleScrollOrResize = () => {
      if (frameRef.current !== null) {
        return
      }

      frameRef.current = requestAnimationFrame(updateProgress)
    }

    handleScrollOrResize()

    window.addEventListener('scroll', handleScrollOrResize, { passive: true })
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize)
      window.removeEventListener('resize', handleScrollOrResize)

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
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
