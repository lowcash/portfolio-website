import { ChevronUp } from 'lucide-react'
import { FloatingRail } from './floating-rail'

interface ScrollToTopProps {
  currentSection: number
  onGoToFirst: () => void
}

export function ScrollToTop({ currentSection, onGoToFirst }: ScrollToTopProps) {
  const isVisible = currentSection > 0

  return (
    <FloatingRail variant='bottom-right'>
      <button
        onClick={onGoToFirst}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onGoToFirst()
          }
        }}
        className={`pointer-events-auto transition-all duration-300 cursor-pointer ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{
          marginBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label='Scroll to top of page'
        aria-hidden={!isVisible}
      >
        <div className='relative group'>
          <div
            className='absolute inset-0 pointer-events-none rounded-2xl animate-glow-shimmer -z-10 scroll-to-top-glow'
            aria-hidden='true'
          />

          <div className='bg-black/40 backdrop-blur-sm rounded-2xl p-4 transition-all duration-500 hover:scale-105 scroll-to-top-inner'>
            <ChevronUp className='w-6 h-6 scroll-to-top-icon' aria-hidden='true' />
          </div>
        </div>
      </button>
    </FloatingRail>
  )
}
