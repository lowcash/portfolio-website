// style-boundary-ignore-file: dynamic orbR/orbG/orbB RGB values computed from React state – inline styles are unavoidable here
'use client'

import type { Achievement } from '@/components/features/easter-eggs/achievements'

import { ACHIEVEMENT_HINTS } from './achievement-hints'
import type { TooltipAlign } from './resolve-tooltip-alignment'

type AchievementTooltipProps = {
  achievement: Achievement
  align: TooltipAlign
  isMobile: boolean
  orbR: number
  orbG: number
  orbB: number
}

export function AchievementTooltip({ achievement, align, isMobile, orbR, orbG, orbB }: AchievementTooltipProps) {
  const alignClassName = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
  const arrowClassName = align === 'left' ? 'left-6' : align === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2'

  const hint =
    achievement.id === 'shake'
      ? isMobile
        ? 'Scroll rapidly to shuffle colors'
        : 'Move mouse rapidly to shuffle colors'
      : ACHIEVEMENT_HINTS[achievement.id] || 'Keep exploring...'

  return (
    <div
      role='tooltip'
      className={`pointer-events-none absolute bottom-full z-50 mb-2 w-[220px] animate-[fadeIn_0.2s_ease-out] ${alignClassName}`}
    >
      <div
        className='rounded-lg border-2 bg-gray-900 p-2 shadow-2xl'
        style={{
          borderColor: achievement.unlocked ? `rgb(${orbR}, ${orbG}, ${orbB})` : 'rgb(107, 114, 128)',
          boxShadow: achievement.unlocked
            ? `0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.4)`
            : '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className='mb-1 flex items-start gap-2'>
          <span className='text-lg'>{achievement.icon}</span>
          <div className='flex-1'>
            <div className={`text-[12px] font-semibold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
              {achievement.unlocked ? achievement.name : '???'}
            </div>
          </div>
        </div>
        <div className='mt-1 text-[11px] text-gray-400'>
          {achievement.unlocked ? achievement.description : hint}
        </div>
      </div>
      <div
        className={`absolute top-full h-0 w-0 ${arrowClassName}`}
        style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${achievement.unlocked ? `rgb(${orbR}, ${orbG}, ${orbB})` : 'rgb(107, 114, 128)'}`,
        }}
      />
    </div>
  )
}
