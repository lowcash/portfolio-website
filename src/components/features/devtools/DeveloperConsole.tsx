// style-boundary-ignore-file: dynamic orbR/orbG/orbB RGB values computed from React state – inline styles are unavoidable here
'use client'

import { useEffect, useRef, useState } from 'react'

import { Terminal, X } from 'lucide-react'

import type { Achievement } from '@/components/features/easter-eggs/achievements'

import { AchievementsPanel } from './achievements-panel'
import { closeConsole, openConsole } from './console-actions'
import { ConsoleStatsControls } from './console-stats-controls'
import { useConsoleDrag } from './use-console-drag'
import { useConsoleStats } from './use-console-stats'

/**
 * Debug component - Easter egg for developers
 * Toggle with "D" key
 * Only available in development mode or when manually enabled
 */

interface DeveloperConsoleProps {
  onVisibilityChange?: (isVisible: boolean) => void
  isMobileMenuOpen?: boolean
}

function loadAchievementsFromStorage(canUseStorage: boolean): Achievement[] {
  if (!canUseStorage) return []
  try {
    const saved = localStorage.getItem('achievements')
    return saved ? (JSON.parse(saved) as Achievement[]) : []
  } catch {
    return []
  }
}

export function DeveloperConsole({ onVisibilityChange, isMobileMenuOpen = false }: DeveloperConsoleProps = {}) {
  const canUseStorage = typeof window !== 'undefined'
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isBelowLgViewport, setIsBelowLgViewport] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isVisibleRef = useRef(false)
  const [scale, setScale] = useState(1.0)
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievementsFromStorage(canUseStorage))

  const { scrollPercent, orbR, orbG, orbB, fps } = useConsoleStats(isVisible)
  const { position, isDragging, panelRef, panelSurfaceRef, handleMouseDown } = useConsoleDrag({
    canUseStorage,
    isVisible,
    isMobileViewport,
    scale,
  })

  useEffect(() => {
    isVisibleRef.current = isVisible
  }, [isVisible])

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)')
    const belowLgMediaQuery = window.matchMedia('(max-width: 1023px)')

    const syncViewportFlags = () => {
      setIsMobileViewport(mobileMediaQuery.matches)
      setIsBelowLgViewport(belowLgMediaQuery.matches)
    }

    syncViewportFlags()
    mobileMediaQuery.addEventListener('change', syncViewportFlags)
    belowLgMediaQuery.addEventListener('change', syncViewportFlags)

    return () => {
      mobileMediaQuery.removeEventListener('change', syncViewportFlags)
      belowLgMediaQuery.removeEventListener('change', syncViewportFlags)
    }
  }, [])

  useEffect(() => {
    const hasSeenHint = sessionStorage.getItem('debug_hint_shown')
    if (!hasSeenHint) {
      console.log('%c🎮 Easter Egg Found!', 'color: #ec4899; font-size: 16px; font-weight: bold;')
      console.log('%cPress "D" to toggle Developer Console', 'color: #a855f7; font-size: 12px;')
      console.log(
        '%c→ Live scroll tracking\n→ RGB color values\n→ FPS monitoring\n→ Orb brightness control\n→ Vignette style switcher',
        'color: #8b5cf6; font-size: 11px;',
      )
      sessionStorage.setItem('debug_hint_shown', 'true')
    }
  }, [])

  useEffect(() => {
    const handleToggle = () => {
      const nextValue = !isVisibleRef.current
      setIsVisible(nextValue)
      if (nextValue) {
        openConsole()
      } else {
        closeConsole()
      }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        handleToggle()
      }
    }

    let touchCount = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 4) {
        touchCount++
        if (touchCount === 1) {
          handleToggle()
          setTimeout(() => {
            touchCount = 0
          }, 500)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  // Subscribe to achievement updates only (initial state loaded in useState)
  useEffect(() => {
    const handleAchievementsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ achievements: Achievement[] }>
      setAchievements(customEvent.detail.achievements)
    }

    window.addEventListener('achievements-updated', handleAchievementsUpdate)
    return () => {
      window.removeEventListener('achievements-updated', handleAchievementsUpdate)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('debug_scale', String(scale))
  }, [scale])

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible)
    }
  }, [isVisible, onVisibilityChange])

  const isMobile = isMobileViewport
  const isTriggerSuppressed = isBelowLgViewport && isMobileMenuOpen
  const triggerInsetInline =
    process.env.NODE_ENV === 'development'
      ? 'max(0.875rem, calc(env(safe-area-inset-left) + 0.625rem))'
      : 'max(0.25rem, env(safe-area-inset-left))'
  const triggerInsetBlock =
    process.env.NODE_ENV === 'development'
      ? 'max(0.875rem, calc(env(safe-area-inset-bottom) + 0.625rem))'
      : 'max(0.25rem, env(safe-area-inset-bottom))'

  const handleOpen = () => {
    setIsVisible(true)
    openConsole()
  }

  const handleClose = () => {
    setIsVisible(false)
    closeConsole()
  }

  const handleResetAchievements = () => {
    localStorage.removeItem('achievements')
    setAchievements([])
    window.dispatchEvent(new CustomEvent('achievements-reset'))
    console.log(
      '%c🔄 Achievements reset! All achievements cleared.',
      'color: #ef4444; font-size: 14px; font-weight: bold;',
    )
  }

  const handleScaleChange = (newScale: number) => {
    setScale(newScale)
    localStorage.setItem('debug_scale', String(newScale))
  }

  if (!isVisible) {
    return (
      <button
        type='button'
        className='fixed cursor-pointer border-none bg-transparent'
        onClick={handleOpen}
        onTouchEnd={(e) => {
          e.preventDefault()
          handleOpen()
        }}
        title="Tap to open dev console (or press 'D' on desktop)"
        aria-label='Toggle debug console'
        style={{
          left: triggerInsetInline,
          bottom: triggerInsetBlock,
          zIndex: isBelowLgViewport ? 40 : 120,
          pointerEvents: isTriggerSuppressed ? 'none' : 'auto',
          opacity: isTriggerSuppressed ? 0 : 1,
          transition: 'opacity 120ms ease-out',
          padding: '0.375rem',
          border: 'none',
          background: 'transparent',
          color: 'rgba(148, 163, 184, 0.38)',
        }}
      >
        <Terminal className='h-5 w-5' aria-hidden='true' />
      </button>
    )
  }

  const statsAndAchievements = (
    <>
      <ConsoleStatsControls
        scrollPercent={scrollPercent}
        orbR={orbR}
        orbG={orbG}
        orbB={orbB}
        fps={fps}
        isMobile={isMobile}
        scale={scale}
        onScaleChange={handleScaleChange}
        onResetAchievements={handleResetAchievements}
      />
      <AchievementsPanel
        achievements={achievements}
        isMobile={isMobile}
        orbR={orbR}
        orbG={orbG}
        orbB={orbB}
        panelSurfaceRef={panelSurfaceRef}
      />
    </>
  )

  return (
    <>
      {isMobile && (
        <div
          className='pointer-events-auto fixed inset-0 flex flex-col font-mono'
          role='region'
          aria-label='Developer debug console'
          style={{
            zIndex: 130,
            background: 'rgba(3, 7, 18, 0.94)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            className='flex shrink-0 items-center justify-between border-b-2 px-4 py-3'
            style={{
              borderColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              background: `rgba(${orbR}, ${orbG}, ${orbB}, 0.15)`,
            }}
          >
            <div className='flex items-center gap-2'>
              <Terminal className='h-5 w-5' style={{ color: `rgb(${orbR}, ${orbG}, ${orbB})` }} />
              <span className='text-white'>DEV.CONSOLE</span>
            </div>
            <button
              type='button'
              onClick={handleClose}
              className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/6 text-white transition-colors hover:bg-white/12'
              style={{ width: '3rem', height: '3rem', lineHeight: 1 }}
              aria-label='Close console'
            >
              <X className='h-7 w-7 text-white' aria-hidden='true' strokeWidth={2.5} />
            </button>
          </div>

          <div className='devtools-mobile-scroll min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-6'>
            {statsAndAchievements}
          </div>
        </div>
      )}

      {!isMobile && (
        <div
          ref={panelRef}
          className='fixed font-mono text-xs transition-all'
          role='region'
          aria-label='Developer debug console'
          style={{
            zIndex: 70,
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <div
            ref={panelSurfaceRef}
            className='relative overflow-visible rounded-lg border-2 backdrop-blur-xl'
            style={{
              borderColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              boxShadow: `0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.3), inset 0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.05)`,
              background: 'rgba(3, 7, 18, 0.9)',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <div
              className='flex items-center justify-between border-b-2 px-4 py-2'
              onMouseDown={handleMouseDown}
              style={{
                borderColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
                background: `rgba(${orbR}, ${orbG}, ${orbB}, 0.1)`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              <div className='flex items-center gap-2'>
                <Terminal className='h-4 w-4' style={{ color: `rgb(${orbR}, ${orbG}, ${orbB})` }} />
                <span className='text-white'>DEV.CONSOLE</span>
                <span className='text-[11px] text-gray-400'>(drag to move)</span>
              </div>
              <button
                type='button'
                onClick={handleClose}
                className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/12'
                style={{ width: '2.75rem', height: '2.75rem', lineHeight: 1 }}
                aria-label='Close console'
              >
                <X className='h-6 w-6 text-white' aria-hidden='true' strokeWidth={2.5} />
              </button>
            </div>

            <div
              data-testid='devtools-panel-content'
              className='devtools-scroll-area max-h-[85vh] space-y-6 overflow-y-auto p-6'
              style={{ minWidth: '420px', maxWidth: 'min(860px, 92vw)' }}
            >
              {statsAndAchievements}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
