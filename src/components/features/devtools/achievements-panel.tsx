// style-boundary-ignore-file: dynamic orbR/orbG/orbB RGB values computed from React state – inline styles are unavoidable here
'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

import { Trophy } from 'lucide-react'

import type { Achievement } from '@/components/features/easter-eggs/achievements'

import { AchievementTooltip } from './achievement-tooltip'
import { resolveTooltipAlignment, type TooltipAlign } from './resolve-tooltip-alignment'

type AchievementsPanelProps = {
  achievements: Achievement[]
  isMobile: boolean
  orbR: number
  orbG: number
  orbB: number
  panelSurfaceRef?: RefObject<HTMLDivElement | null>
}

function achievementAriaLabel(achievement: Achievement): string {
  if (achievement.unlocked) {
    return `Unlocked: ${achievement.name}. ${achievement.description}`
  }
  return `Locked achievement: ${achievement.name}`
}

export function AchievementsPanel({
  achievements,
  isMobile,
  orbR,
  orbG,
  orbB,
  panelSurfaceRef,
}: AchievementsPanelProps) {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null)
  const [activeTooltipAlign, setActiveTooltipAlign] = useState<TooltipAlign>('center')
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const checkMobile = window.innerWidth < 768
    if (!checkMobile || !activeTooltipId) return

    const handleScroll = () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
      setActiveTooltipId(null)
    }

    const consoleContent = document.querySelector('.devtools-mobile-scroll')
    if (consoleContent) {
      consoleContent.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        consoleContent.removeEventListener('scroll', handleScroll)
      }
    }
  }, [activeTooltipId])

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current)
    }
  }, [])

  const showTooltipForTile = (achievementId: string, tileElement: HTMLElement, autoHide: boolean) => {
    const boundary = panelSurfaceRef?.current
    setActiveTooltipAlign(resolveTooltipAlignment(tileElement, boundary))
    setActiveTooltipId(achievementId)

    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }

    if (autoHide) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setActiveTooltipId(null)
      }, 3000)
    }
  }

  const hideTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    setActiveTooltipId(null)
  }

  return (
    <>
      <div
        className='my-3 border-t-2 border-gray-800'
        style={{ borderColor: `rgba(${orbR}, ${orbG}, ${orbB}, 0.3)` }}
      />

      <div className='space-y-2 overflow-visible'>
        <div className='flex items-center gap-2'>
          <Trophy className='h-3 w-3 text-yellow-400' />
          <span className='text-sm tracking-wider text-gray-400 uppercase'>Achievements</span>
          <span className='text-[11px] text-gray-400'>
            {achievements.filter((a) => a.unlocked).length}/{achievements.length}
          </span>
        </div>

        {achievements.length > 0 ? (
          <div className='grid grid-cols-4 gap-1.5 overflow-visible pt-2'>
            {achievements.map((achievement) => (
              <div key={achievement.id} className='relative overflow-visible'>
                <button
                  type='button'
                  className={`flex aspect-square w-full cursor-pointer items-center justify-center rounded border-2 transition-all ${
                    achievement.unlocked
                      ? 'border-yellow-400/50 bg-yellow-400/10'
                      : 'border-gray-700 bg-gray-800/30 opacity-30 grayscale'
                  } ${!isMobile && achievement.id === 'enlightenment' && achievement.unlocked ? 'ring-1 ring-yellow-400/40 ring-offset-1 ring-offset-black' : ''}`}
                  style={{ fontSize: isMobile ? 'clamp(1.5rem, 6.5vw, 2.75rem)' : '1.875rem' }}
                  aria-label={achievementAriaLabel(achievement)}
                  title={
                    !isMobile && achievement.id === 'enlightenment' && achievement.unlocked
                      ? '✨ Click to celebrate!'
                      : undefined
                  }
                  onMouseEnter={(event) => {
                    if (!isMobile) {
                      showTooltipForTile(achievement.id, event.currentTarget, false)
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      hideTooltip()
                    }
                  }}
                  onFocus={(event) => {
                    showTooltipForTile(achievement.id, event.currentTarget, false)
                  }}
                  onBlur={() => {
                    hideTooltip()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()

                    if (isMobile) {
                      if (activeTooltipId === achievement.id) {
                        hideTooltip()
                      } else {
                        showTooltipForTile(achievement.id, e.currentTarget, true)
                      }

                      if (achievement.id === 'enlightenment' && achievement.unlocked) {
                        window.dispatchEvent(new CustomEvent('enlightenment-clicked'))
                      }
                    } else if (achievement.id === 'enlightenment' && achievement.unlocked) {
                      window.dispatchEvent(new CustomEvent('enlightenment-clicked'))
                    }
                  }}
                >
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </button>

                {activeTooltipId === achievement.id ? (
                  <AchievementTooltip
                    achievement={achievement}
                    align={activeTooltipAlign}
                    isMobile={isMobile}
                    orbR={orbR}
                    orbG={orbG}
                    orbB={orbB}
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className='py-2 text-center text-[11px] text-gray-400'>No achievements yet. Keep exploring!</div>
        )}
      </div>

      <div className='border-t border-gray-800 pt-2 text-center text-[11px] text-gray-400'>
        <div className='hidden md:block'>Press &apos;D&apos; to toggle</div>
      </div>
    </>
  )
}
