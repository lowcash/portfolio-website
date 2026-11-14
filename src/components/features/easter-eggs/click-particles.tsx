'use client'

import type { ClickParticle } from './triggers/click-triggers'

type ClickParticlesProps = {
  particles: ClickParticle[]
}

/** Rapid-click particle overlays spawned by the click-master achievement trigger. */
export function ClickParticles({ particles }: ClickParticlesProps) {
  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className='pointer-events-none fixed'
          style={{
            zIndex: 90,
            left: particle.x,
            top: particle.y,
            animation: 'confettiFall 2.5s ease-in forwards',
          }}
        >
          <div
            className='h-4 w-4 rounded-full'
            style={{ backgroundColor: '#a855f7', animation: 'confettiBounce 2.5s ease-in forwards' }}
          />
        </div>
      ))}
    </>
  )
}
