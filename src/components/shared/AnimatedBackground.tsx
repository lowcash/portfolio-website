import { useEffect } from 'react'

import { startOrbEffects } from '@/lib/orb-effects'
import { hydrateOrbSettings } from '@/lib/orb-settings'

/**
 * Three lights (radial gradients, transform and opacity only) and one static grain tile. The composition per section
 * is CSS (`html[data-scene]`), so nothing here re-renders while scrolling and the server HTML already is the final
 * hero layout. The pointer physics (orb-effects.ts) drive the same three elements through `translate`.
 */
export function AnimatedBackground() {
  useEffect(() => {
    hydrateOrbSettings()

    return startOrbEffects()
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
      <div className='grain' aria-hidden='true' />
    </>
  )
}
