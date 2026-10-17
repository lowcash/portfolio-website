import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number // vw percentage
  duration: number
  size: number
  color: string
  symbol: string
}

const SPARKLE_SYMBOLS = ['\u2726', '\u2727', '\u22c6', '\u25c6'] as const
const SPARKLE_COLORS = ['#fbbf24', '#f59e0b', '#fde68a'] as const

const spawnSparkle = (): Sparkle => ({
  id: Date.now() + Math.random(),
  x: 5 + Math.random() * 90,
  duration: 7 + Math.random() * 5,
  size: 14 + Math.random() * 18,
  color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
  symbol: SPARKLE_SYMBOLS[Math.floor(Math.random() * SPARKLE_SYMBOLS.length)],
})

/** Golden frame, glows and rising sparkles shown once every achievement is unlocked. */
export function EnlightenedAtmosphere({ active }: { active: boolean }) {
  // Sync premium state to document root so global styles can react to it
  useEffect(() => {
    if (active) {
      document.documentElement.setAttribute('data-enlightened', 'true')
    } else {
      document.documentElement.removeAttribute('data-enlightened')
    }
  }, [active])

  return active ? <EnlightenedLayers /> : null
}

// Mounted only while enlightened, so the sparkle state resets by unmounting instead of by an effect
function EnlightenedLayers() {
  const [sparkles, setSparkles] = useState<Sparkle[]>(() => Array.from({ length: 14 }, spawnSparkle))

  // Replenish floating sparkles
  useEffect(() => {
    const interval = setInterval(() => setSparkles((prev) => [...prev.slice(-18), spawnSparkle()]), 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Floating gold sparkles – ambient atmosphere when enlightened */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className='pointer-events-none fixed'
          aria-hidden='true'
          style={{
            left: `${s.x}%`,
            bottom: 0,
            zIndex: 3,
            fontSize: `${s.size}px`,
            color: s.color,
            opacity: 0,
            animation: `sparkleRise ${s.duration}s ease-out forwards`,
          }}
        >
          {s.symbol}
        </div>
      ))}

      {/* Premium golden vignette frame – visible once all achievements are unlocked */}
      <>
        {/* Golden sweeping hairline – animated gleam at very top of viewport */}
        <div
          className='pointer-events-none fixed inset-x-0 top-0'
          aria-hidden='true'
          style={{
            zIndex: 4,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, #fbbf24 30%, #fde68a 50%, #fbbf24 70%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'goldenBeam 3s ease-in-out infinite alternate',
          }}
        />

        {/* Top gold glow */}
        <div
          className='pointer-events-none fixed inset-x-0 top-0'
          aria-hidden='true'
          style={{
            zIndex: 1,
            height: '35vh',
            background: 'linear-gradient(to bottom, rgba(251,191,36,0.13) 0%, transparent 100%)',
            animation: 'enlightenedPulse 5s ease-in-out infinite',
          }}
        />
        {/* Bottom gold glow */}
        <div
          className='pointer-events-none fixed inset-x-0 bottom-0'
          aria-hidden='true'
          style={{
            zIndex: 1,
            height: '30vh',
            background: 'linear-gradient(to top, rgba(251,191,36,0.10) 0%, transparent 100%)',
            animation: 'enlightenedPulse 5s ease-in-out infinite 2.5s',
          }}
        />
        {/* Left gold glow */}
        <div
          className='pointer-events-none fixed inset-y-0 left-0'
          aria-hidden='true'
          style={{
            zIndex: 1,
            width: '20vw',
            background: 'linear-gradient(to right, rgba(251,191,36,0.07) 0%, transparent 100%)',
            animation: 'enlightenedSidePulse 7s ease-in-out infinite',
          }}
        />
        {/* Right gold glow */}
        <div
          className='pointer-events-none fixed inset-y-0 right-0'
          aria-hidden='true'
          style={{
            zIndex: 1,
            width: '20vw',
            background: 'linear-gradient(to left, rgba(251,191,36,0.07) 0%, transparent 100%)',
            animation: 'enlightenedSidePulse 7s ease-in-out infinite 3.5s',
          }}
        />
        {/* Inset frame shadow */}
        <div
          className='pointer-events-none fixed inset-0'
          aria-hidden='true'
          style={{
            zIndex: 1,
            boxShadow: 'inset 0 0 80px rgba(251,191,36,0.08), inset 0 0 160px rgba(251,191,36,0.04)',
          }}
        />
      </>
    </>
  )
}
