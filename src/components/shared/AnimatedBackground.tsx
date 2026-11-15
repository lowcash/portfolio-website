import { useEffect, useRef } from 'react'

import { startOrbEffects } from '@/lib/orb-effects'
import { hydrateOrbSettings } from '@/lib/orb-settings'

/**
 * Three lights (radial gradients, transform and opacity only) and one static grain tile. The composition per section
 * is CSS (`html[data-scene]`), so nothing here re-renders while scrolling and the server HTML already is the final
 * hero layout. The opt-in effects (magnetism, burst, ripples) drive the same three elements.
 */
export function AnimatedBackground() {
  const rippleLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    hydrateOrbSettings()
    const rippleLayer = rippleLayerRef.current

    return rippleLayer ? startOrbEffects(rippleLayer) : undefined
  }, [])

  return (
    <>
      <div className='orbs' aria-hidden='true'>
        <div className='orb orb-a'>
          <i />
        </div>
        <div className='orb orb-b'>
          <i />
        </div>
        <div className='orb orb-c'>
          <i />
        </div>
      </div>
      <div className='ripples chrome' ref={rippleLayerRef} aria-hidden='true' />
      <div className='grain' aria-hidden='true' />
    </>
  )
}
