import { ChevronUp } from 'lucide-react'

import { FloatingRail } from './floating-rail'

interface ScrollToTopProps {
  currentSection: number
  onGoToFirst: () => void
}

export function ScrollToTop({ currentSection, onGoToFirst }: ScrollToTopProps) {
  const isVisible = currentSection > 0
  const railVariant = 'bottom-right'

  return (
    <FloatingRail variant={railVariant} interactive={isVisible}>
      <button
        onClick={onGoToFirst}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onGoToFirst()
          }
        }}
        className={`pointer-events-auto cursor-pointer transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'
        }`}
        aria-label='Scroll to top of page'
        tabIndex={isVisible ? 0 : -1}
      >
        <div className='group relative'>
          <div
            className='animate-glow-shimmer scroll-to-top-glow pointer-events-none absolute inset-0 -z-10 rounded-2xl'
            aria-hidden='true'
          />

          <div className='scroll-to-top-inner rounded-2xl bg-black/40 p-4 backdrop-blur-sm transition-all duration-500 hover:scale-105'>
            <ChevronUp className='scroll-to-top-icon h-6 w-6' aria-hidden='true' />
          </div>
        </div>
      </button>
    </FloatingRail>
  )
}
