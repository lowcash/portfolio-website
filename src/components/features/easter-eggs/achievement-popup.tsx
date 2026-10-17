import { Trophy } from 'lucide-react'

import type { Achievement } from './achievements'

type AchievementPopupProps = {
  achievement: Achievement | null
  isHiding: boolean
  onEnlightenmentClick: () => void
}

/** Slide-in card shown when an achievement unlocks. Above all overlays including the dev console (z:130). */
export function AchievementPopup({ achievement, isHiding, onEnlightenmentClick }: AchievementPopupProps) {
  if (!achievement) {
    return null
  }

  const renderAchievementCard = (width: string, marginRight?: string) => {
    return (
      <div
        onClick={onEnlightenmentClick}
        role='alert'
        aria-live='polite'
        className={`pointer-events-auto rounded-xl border border-purple-500/50 p-4 shadow-2xl transition-all ${achievement.id === 'enlightenment' ? 'cursor-pointer hover:shadow-[0_0_60px_rgba(251,191,36,0.4)]' : ''}`}
        style={{
          width,
          marginRight,
          animation: isHiding ? 'slideOutRight 0.5s ease-in forwards' : 'slideInRight 0.5s ease-out forwards',
          borderColor: 'rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.6)',
          boxShadow:
            '0 0 45px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.35), 0 0 90px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.18)',
          backdropFilter: 'blur(16px)',
          background: 'rgba(10, 10, 20, 0.42)',
        }}
      >
        <div className='flex items-start gap-3'>
          <div className={`text-3xl ${achievement.id === 'enlightenment' ? 'animate-pulse' : ''}`}>
            {achievement.icon}
          </div>
          <div className='flex-1'>
            <div className='mb-1 flex items-center gap-2'>
              <Trophy className='h-4 w-4 text-yellow-400' />
              <span className='text-sm font-semibold text-yellow-400'>Achievement Unlocked!</span>
            </div>
            <h3 className='font-semibold text-white'>{achievement.name}</h3>
            <p className='mt-1 text-sm text-gray-300'>{achievement.description}</p>
            {achievement.id === 'enlightenment' && (
              <p className='mt-2 text-xs text-[#fbbf24]'>✨ Click for celebration!</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        data-testid='achievement-popup-layer'
        className='pointer-events-none fixed inset-x-0 z-9999 hidden lg:block'
        style={{ bottom: 'calc(50% + 12.5rem)' }}
      >
        <div className='mx-auto flex max-w-6xl justify-end pr-2 pl-6'>
          {renderAchievementCard('min(20rem, calc(100vw - 8rem))', '5.75rem')}
        </div>
      </div>

      <div
        data-testid='achievement-popup-layer-mobile'
        className='pointer-events-none fixed right-4 left-4 z-9999 flex justify-end lg:hidden'
        style={{ top: 'calc(5.5rem + env(safe-area-inset-top))' }}
      >
        {renderAchievementCard('min(20rem, calc(100vw - 2rem))')}
      </div>
    </>
  )
}
