// style-boundary-ignore-file: dynamic orbR/orbG/orbB RGB values computed from React state — inline styles are unavoidable here
import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { Terminal, Trophy, X } from 'lucide-react'

import type { Achievement } from '@/components/ui/easter-eggs'

/**
 * Debug component - Easter egg for developers
 * Toggle with "D" key
 * Only available in development mode or when manually enabled
 */

// Achievement hints (how to unlock)
const ACHIEVEMENT_HINTS: Record<string, string> = {
  'triple-click': 'Triple-click the hero heading',
  'perfectly-balanced': 'Scroll to exactly 50% of the page',
  patience: 'Stay idle for 60 seconds',
  'rapid-clicker': 'Click 10 times in 2 seconds',
  'copy-cat': 'Copy some text from the page',
  konami: 'Enter the Konami Code',
  shake: 'Shake your device or move mouse rapidly',
  'marathon-runner': 'Scroll a total of 10,000 pixels',
  'speed-reader': 'Reach the bottom in under 2 minutes',
  'repeat-visitor': 'Visit the site 3+ times',
  'section-hopper': 'Visit at least 5 different sections',
  'world-tour': 'Visit every section on the page',
  'settings-tinkerer': 'Tweak orb settings 5 times',
  'nav-master': 'Use navigation controls 3 times',
  'round-trip': 'Use the scroll-to-top shortcut',
  'back-to-origin': 'Reach contact and return to hero',
}

interface DeveloperConsoleProps {
  onVisibilityChange?: (isVisible: boolean) => void
  isMobileMenuOpen?: boolean
}

export function DeveloperConsole({ onVisibilityChange, isMobileMenuOpen = false }: DeveloperConsoleProps = {}) {
  const canUseStorage = typeof window !== 'undefined'
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [orbR, setOrbR] = useState(0)
  const [orbG, setOrbG] = useState(0)
  const [orbB, setOrbB] = useState(0)
  const [fps, setFps] = useState(60)

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (!canUseStorage) return []
    const saved = localStorage.getItem('achievements')
    return saved ? JSON.parse(saved) : []
  })

  // Tooltip state — includes fixed viewport position for desktop (escapes overflow:auto clipping)
  const [tooltip, setTooltip] = useState<{
    achievement: Achievement
    show: boolean
    fixedX?: number
    fixedY?: number
    showBelow?: boolean
    alignLeft?: boolean
    alignRight?: boolean
  } | null>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const achievementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Debounce ref for settings dispatch — counts per drag-session, not per pixel change
  const settingsDispatchTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Panel ref for click outside detection
  const panelRef = useRef<HTMLDivElement>(null)

  // Persistent position - TOP LEFT with padding (desktop default)
  const [position, setPosition] = useState(() => {
    if (!canUseStorage || typeof window === 'undefined') return { x: 20, y: 20 } // Top-left with 20px padding
    const saved = localStorage.getItem('debug_position')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Validate position is within viewport (not off-screen)
      const isValidX = parsed.x >= -200 && parsed.x < window.innerWidth
      const isValidY = parsed.y >= -200 && parsed.y < window.innerHeight
      if (isValidX && isValidY) {
        return parsed
      }
    }
    // Default or invalid position
    return { x: 20, y: 20 }
  })

  // Scale is session-only — not persisted, always opens at readable default
  const [scale, setScale] = useState(1.0)

  // Easter egg settings
  const [orbBrightness, setOrbBrightness] = useState(() => {
    if (!canUseStorage) return 0.5
    return parseFloat(localStorage.getItem('orb_brightness') || '0.5')
  })
  const [animationSpeed, setAnimationSpeed] = useState(() => {
    if (!canUseStorage) return 3.0
    return parseFloat(localStorage.getItem('animation_speed') || '3.0')
  })
  const [colorVariation, setColorVariation] = useState(() => {
    if (!canUseStorage) return 40
    return parseFloat(localStorage.getItem('color_variation') || '40')
  })
  const [orbSize, setOrbSize] = useState(() => {
    if (!canUseStorage) return 1.2
    return parseFloat(localStorage.getItem('orb_size') || '1.2')
  })
  const [orbBlur, setOrbBlur] = useState(() => {
    if (!canUseStorage) return 1.0
    return parseFloat(localStorage.getItem('orb_blur') || '1.0')
  })
  const [orbOpacity, setOrbOpacity] = useState(() => {
    if (!canUseStorage) return 2.0
    return parseFloat(localStorage.getItem('orb_opacity') || '2.0') // 200% default
  })
  const [positionVariation, setPositionVariation] = useState(() => {
    if (!canUseStorage) return 1.0
    return parseFloat(localStorage.getItem('position_variation') || '1.0')
  })

  const toggleVisibility = useEffectEvent(() => {
    const nextValue = !isVisible

    setIsVisible(nextValue)

    if (nextValue) {
      localStorage.setItem('dev_console_opened', 'true')
      window.dispatchEvent(new CustomEvent('dev-console-opened'))
      console.log('%c🎮 Achievement system activated!', 'color: #10b981; font-size: 12px; font-weight: bold;')
    }
  })

  // Apply settings to CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    const settingsPayload = {
      orbBrightness,
      animationSpeed,
      colorVariation: colorVariation / 100,
      orbSize,
      orbBlur,
      orbOpacity,
      positionVariation,
    }

    root.style.setProperty('--orb-brightness', String(orbBrightness))
    root.style.setProperty('--animation-speed', String(animationSpeed))
    root.style.setProperty('--color-variation', String(colorVariation / 100)) // normalize to 0-1
    root.style.setProperty('--orb-size', String(orbSize))
    root.style.setProperty('--orb-blur', String(orbBlur))
    root.style.setProperty('--orb-opacity', String(orbOpacity))
    root.style.setProperty('--position-variation', String(positionVariation))
    localStorage.setItem('orb_brightness', String(orbBrightness))
    localStorage.setItem('animation_speed', String(animationSpeed))
    localStorage.setItem('color_variation', String(colorVariation))
    localStorage.setItem('orb_size', String(orbSize))
    localStorage.setItem('orb_blur', String(orbBlur))
    localStorage.setItem('orb_opacity', String(orbOpacity))
    localStorage.setItem('position_variation', String(positionVariation))
    if (settingsDispatchTimerRef.current) clearTimeout(settingsDispatchTimerRef.current)
    settingsDispatchTimerRef.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('orb-settings-change', { detail: settingsPayload }))
    }, 400)
  }, [orbBrightness, animationSpeed, colorVariation, orbSize, orbBlur, orbOpacity, positionVariation])

  // Toggle visibility with "D" key
  useEffect(() => {
    // Show console hint on first load
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

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        toggleVisibility()
      }
    }

    // Mobile: 4-finger tap to toggle
    let touchCount = 0
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 4) {
        touchCount++
        if (touchCount === 1) {
          toggleVisibility()
          // Reset after 500ms
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

  // Track scroll and orb colors
  useEffect(() => {
    if (!isVisible) {
      return
    }

    let lastTime = performance.now()
    let frameCount = 0

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const maxScroll = docHeight - winHeight

      const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      setScrollPercent(percent)

      // Get computed orb colors from CSS variables
      const root = getComputedStyle(document.documentElement)
      setOrbR(parseInt(root.getPropertyValue('--orb-r')) || 0)
      setOrbG(parseInt(root.getPropertyValue('--orb-g')) || 0)
      setOrbB(parseInt(root.getPropertyValue('--orb-b')) || 0)

      // Calculate FPS
      frameCount++
      const currentTime = performance.now()
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    const fpsInterval = setInterval(() => {
      handleScroll() // Update FPS regularly
    }, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(fpsInterval)
    }
  }, [isVisible])

  // Listen for achievement updates
  useEffect(() => {
    const handleAchievementsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent
      setAchievements(customEvent.detail.achievements)
    }

    window.addEventListener('achievements-updated', handleAchievementsUpdate)

    // Load initial achievements
    const saved = localStorage.getItem('achievements')
    if (saved) {
      setAchievements(JSON.parse(saved))
    }

    return () => {
      window.removeEventListener('achievements-updated', handleAchievementsUpdate)
    }
  }, [])

  // Click outside to close
  useEffect(() => {
    if (!isVisible) return

    // REMOVED - no longer close on click outside
    // User must click the X button to close
  }, [isVisible])

  // Drag & drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
      // Get button positions to avoid drag conflicts
      const isMobile = window.innerWidth < 768
      const hamburgerRect = { top: 24, right: 24, width: 56, height: 56 } // top-6 right-6 + button size
      const scrollToTopRect = { bottom: 32, right: 32, width: 56, height: 56 } // bottom-8 right-8 + button size

      // Check if click is in "forbidden zones"
      const clickX = e.clientX
      const clickY = e.clientY
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight

      // Hamburger zone (top-right on mobile, but we still check on desktop for consistency)
      const inHamburgerZone =
        isMobile &&
        clickX > winWidth - hamburgerRect.right - hamburgerRect.width &&
        clickX < winWidth - hamburgerRect.right + hamburgerRect.width &&
        clickY > hamburgerRect.top - hamburgerRect.height &&
        clickY < hamburgerRect.top + hamburgerRect.height

      // Scroll-to-top zone (bottom-right)
      const inScrollToTopZone =
        clickX > winWidth - scrollToTopRect.right - scrollToTopRect.width &&
        clickX < winWidth - scrollToTopRect.right + scrollToTopRect.width &&
        clickY > winHeight - scrollToTopRect.bottom - scrollToTopRect.height &&
        clickY < winHeight - scrollToTopRect.bottom + scrollToTopRect.height

      // Don't start drag if in forbidden zones
      if (inHamburgerZone || inScrollToTopZone) {
        return
      }

      setIsDragging(true)
      setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  useEffect(() => {
    if (!isDragging) return

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth 60fps dragging
      requestAnimationFrame(() => {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Update position immediately with no threshold
        setPosition({ x: newX, y: newY })
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      // Restore text selection
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, dragOffset])

  // Save position on drag end
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('debug_position', JSON.stringify(position))
    }
  }, [isDragging, position])

  // Save scale on resize end
  useEffect(() => {
    localStorage.setItem('debug_scale', String(scale))
  }, [scale])

  // Notify parent about visibility change
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible)
    }
  }, [isVisible, onVisibilityChange])

  // Mobile: Auto-close tooltip on scroll
  useEffect(() => {
    const checkMobile = window.innerWidth < 768
    if (!checkMobile || !tooltip) return

    const handleScroll = () => {
      // Clear tooltip timeout and hide tooltip
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
      setTooltip(null)
    }

    // Listen to scroll on the console content div (mobile fullscreen modal)
    const consoleContent = document.querySelector('.overflow-y-auto.overscroll-contain')
    if (consoleContent) {
      consoleContent.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        consoleContent.removeEventListener('scroll', handleScroll)
      }
    }
  }, [tooltip])

  // Check if mobile (before render)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const isTriggerSuppressed = isMobile && isMobileMenuOpen
  const triggerInsetInline =
    process.env.NODE_ENV === 'development'
      ? 'max(0.875rem, calc(env(safe-area-inset-left) + 0.625rem))'
      : 'max(0.25rem, env(safe-area-inset-left))'
  const triggerInsetBlock =
    process.env.NODE_ENV === 'development'
      ? 'max(0.875rem, calc(env(safe-area-inset-bottom) + 0.625rem))'
      : 'max(0.25rem, env(safe-area-inset-bottom))'

  if (!isVisible) {
    return (
      <button
        type='button'
        className='fixed cursor-pointer border-none bg-transparent'
        onClick={() => {
          setIsVisible(true)
          // Mark dev console as opened (enables achievement system)
          localStorage.setItem('dev_console_opened', 'true')
          window.dispatchEvent(new CustomEvent('dev-console-opened'))
          console.log('%c🎮 Achievement system activated!', 'color: #10b981; font-size: 12px; font-weight: bold;')
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          setIsVisible(true)
          localStorage.setItem('dev_console_opened', 'true')
          window.dispatchEvent(new CustomEvent('dev-console-opened'))
          console.log('%c🎮 Achievement system activated!', 'color: #10b981; font-size: 12px; font-weight: bold;')
        }}
        title="Tap to open dev console (or press 'D' on desktop)"
        aria-label='Toggle debug console'
        style={{
          left: triggerInsetInline,
          bottom: triggerInsetBlock,
          zIndex: isTriggerSuppressed ? 40 : 120,
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

  return (
    <>
      {/* Mobile: Fullscreen panel */}
      {isMobile && (
        <div
          className='pointer-events-auto fixed inset-0'
          role='region'
          aria-label='Developer debug console'
          style={{
            zIndex: 130,
            background: 'rgba(3, 7, 18, 0.94)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className='flex h-full flex-col'>
            {/* Header */}
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
                onClick={() => setIsVisible(false)}
                className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/6 text-white transition-colors hover:bg-white/12'
                style={{ width: '3rem', height: '3rem', lineHeight: 1 }}
                aria-label='Close console'
              >
                <X className='h-7 w-7 text-white' aria-hidden='true' strokeWidth={2.5} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div
              className='flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4'
              style={{
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              }}
            >
              {renderConsoleContent()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Draggable panel */}
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
            transform: `scale(${scale})`,
          }}
        >
          {/* Cyber/retro styled panel */}
          <div
            className='relative overflow-visible rounded-lg border-2 backdrop-blur-xl'
            style={{
              borderColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              boxShadow: `0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.3), inset 0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.05)`,
              background: 'rgba(3, 7, 18, 0.9)',
            }}
          >
            {/* Header */}
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
                <span className='text-[8px] text-gray-500'>(drag to move)</span>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/12'
                style={{ width: '2.75rem', height: '2.75rem', lineHeight: 1 }}
                aria-label='Close console'
              >
                <X className='h-6 w-6 text-white' aria-hidden='true' strokeWidth={2.5} />
              </button>
            </div>

            {/* Content */}
            <div
              data-testid='devtools-panel-content'
              className='devtools-scroll-area space-y-2 overflow-y-auto p-4'
              style={{ minWidth: '420px', maxWidth: 'min(860px, 92vw)', maxHeight: `${Math.round(86 / scale)}vh` }}
            >
              {renderConsoleContent()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop fixed-position tooltip — outside overflow:auto container to prevent clipping */}
      {!isMobile && tooltip && tooltip.fixedX !== undefined && tooltip.fixedY !== undefined && (
        <div
          className='pointer-events-none'
          style={{
            position: 'fixed',
            zIndex: 9999,
            left: `${tooltip.fixedX}px`,
            top: `${tooltip.fixedY}px`,
            width: '220px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            className='relative rounded-lg border-2 bg-gray-900 p-2 shadow-2xl'
            style={{
              borderColor: tooltip.achievement.unlocked ? `rgb(${orbR}, ${orbG}, ${orbB})` : 'rgb(107, 114, 128)',
              boxShadow: tooltip.achievement.unlocked
                ? `0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.4)`
                : '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className='mb-1 flex items-start gap-2'>
              <span className='text-lg'>{tooltip.achievement.icon}</span>
              <div className='flex-1'>
                <div
                  className={`text-[10px] font-semibold ${
                    tooltip.achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                >
                  {tooltip.achievement.unlocked ? tooltip.achievement.name : '???'}
                </div>
              </div>
            </div>
            <div className='mt-1 text-[9px] text-gray-400'>
              {tooltip.achievement.unlocked
                ? tooltip.achievement.description
                : ACHIEVEMENT_HINTS[tooltip.achievement.id] || 'Keep exploring...'}
            </div>
            {/* Arrow */}
            {tooltip.showBelow ? (
              <div
                className={`absolute bottom-full h-0 w-0 ${
                  tooltip.alignLeft ? 'left-6' : tooltip.alignRight ? 'right-6' : 'left-1/2 -translate-x-1/2'
                }`}
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: `6px solid ${tooltip.achievement.unlocked ? `rgb(${orbR}, ${orbG}, ${orbB})` : 'rgb(107, 114, 128)'}`,
                }}
              />
            ) : (
              <div
                className={`absolute top-full h-0 w-0 ${
                  tooltip.alignLeft ? 'left-6' : tooltip.alignRight ? 'right-6' : 'left-1/2 -translate-x-1/2'
                }`}
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `6px solid ${tooltip.achievement.unlocked ? `rgb(${orbR}, ${orbG}, ${orbB})` : 'rgb(107, 114, 128)'}`,
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  )

  // Helper function to render console content (shared between mobile and desktop)
  function renderConsoleContent() {
    return (
      <>
        {/* Scroll Progress */}
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>SCROLL:</span>
          <div className='flex items-center gap-2'>
            <div className='h-1.5 w-24 overflow-hidden rounded-full bg-gray-800'>
              <div
                className='h-full rounded-full transition-all'
                style={{
                  width: `${scrollPercent}%`,
                  background: `linear-gradient(90deg, rgb(${orbR}, ${orbG}, ${orbB}), rgba(${orbR}, ${orbG}, ${orbB}, 0.6))`,
                }}
              />
            </div>
            <span className='w-12 text-right text-white tabular-nums'>{scrollPercent.toFixed(1)}%</span>
          </div>
        </div>

        {/* RGB Values */}
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>ORB_RGB:</span>
          <div className='flex gap-2 text-white tabular-nums'>
            <span style={{ color: `rgb(255, ${orbG}, ${orbB})` }}>{orbR.toString().padStart(3, '0')}</span>
            <span style={{ color: `rgb(${orbR}, 255, ${orbB})` }}>{orbG.toString().padStart(3, '0')}</span>
            <span style={{ color: `rgb(${orbR}, ${orbG}, 255)` }}>{orbB.toString().padStart(3, '0')}</span>
          </div>
        </div>

        {/* Color Preview */}
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>COLOR:</span>
          <div
            className='h-6 w-32 rounded border-2 border-gray-700'
            style={{
              background: `rgb(${orbR}, ${orbG}, ${orbB})`,
              boxShadow: `0 0 10px rgba(${orbR}, ${orbG}, ${orbB}, 0.5)`,
            }}
          />
        </div>

        {/* FPS */}
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>FPS:</span>
          <span
            className='text-white tabular-nums'
            style={{ color: fps < 30 ? '#ef4444' : fps < 50 ? '#f59e0b' : '#10b981' }}
          >
            {fps}
          </span>
        </div>

        {/* DIVIDER */}
        <div
          className='my-3 border-t-2 border-gray-800'
          style={{ borderColor: `rgba(${orbR}, ${orbG}, ${orbB}, 0.3)` }}
        />

        {/* CONTROLS SECTION */}
        <div className='space-y-3'>
          <div className='text-xs tracking-wider text-gray-500 uppercase'>⚙️ Controls</div>

          {/* Animation Speed Slider */}
          <div>
            <div className='mb-1 flex items-center justify-between'>
              <span className='text-[10px] text-gray-400'>ANIMATION SPEED:</span>
              <span className='text-[10px] text-white tabular-nums'>{animationSpeed.toFixed(1)}x</span>
            </div>
            <input
              type='range'
              min='0.1'
              max='10.0'
              step='0.1'
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              }}
            />
          </div>

          {/* Color Variation Slider */}
          <div>
            <div className='mb-1 flex items-center justify-between'>
              <span className='text-[10px] text-gray-400'>COLOR VARIATION:</span>
              <span className='text-[10px] text-white tabular-nums'>{colorVariation.toFixed(0)}%</span>
            </div>
            <input
              type='range'
              min='0'
              max='500'
              step='10'
              value={colorVariation}
              onChange={(e) => setColorVariation(parseFloat(e.target.value))}
              className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              }}
            />
          </div>

          {/* Position Variation Slider */}
          <div>
            <div className='mb-1 flex items-center justify-between'>
              <span className='text-[10px] text-gray-400'>POSITION SPREAD:</span>
              <span className='text-[10px] text-white tabular-nums'>{(positionVariation * 100).toFixed(0)}%</span>
            </div>
            <input
              type='range'
              min='0.0'
              max='3.0'
              step='0.1'
              value={positionVariation}
              onChange={(e) => setPositionVariation(parseFloat(e.target.value))}
              className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              }}
            />
          </div>

          {/* Orb Size Slider */}
          <div>
            <div className='mb-1 flex items-center justify-between'>
              <span className='text-[10px] text-gray-400'>ORB SIZE:</span>
              <span className='text-[10px] text-white tabular-nums'>{orbSize.toFixed(1)}x</span>
            </div>
            <input
              type='range'
              min='0.1'
              max='5.0'
              step='0.1'
              value={orbSize}
              onChange={(e) => setOrbSize(parseFloat(e.target.value))}
              className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              }}
            />
          </div>

          {/* Orb Blur Slider */}
          {!isMobile && (
            <div>
              <div className='mb-1 flex items-center justify-between'>
                <span className='text-[10px] text-gray-400'>ORB BLUR:</span>
                <span className='text-[10px] text-white tabular-nums'>{orbBlur.toFixed(1)}x</span>
              </div>
              <input
                type='range'
                min='0.1'
                max='5.0'
                step='0.1'
                value={orbBlur}
                onChange={(e) => setOrbBlur(parseFloat(e.target.value))}
                className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
                style={{
                  accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
                }}
              />
            </div>
          )}

          {/* Orb Opacity Slider */}
          <div>
            <div className='mb-1 flex items-center justify-between'>
              <span className='text-[10px] text-gray-400'>ORB OPACITY:</span>
              <span className='text-[10px] text-white tabular-nums'>{(orbOpacity * 100).toFixed(0)}%</span>
            </div>
            <input
              type='range'
              min='0.0'
              max='3.0'
              step='0.1'
              value={orbOpacity}
              onChange={(e) => setOrbOpacity(parseFloat(e.target.value))}
              className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              }}
            />
          </div>

          {/* Scale Slider - RESIZABLE CONSOLE */}
          {!isMobile && (
            <div>
              <div className='mb-1 flex items-center justify-between'>
                <span className='text-[10px] text-gray-400'>CONSOLE SCALE:</span>
                <span className='text-[10px] text-white tabular-nums'>{((scale / 0.8) * 100).toFixed(0)}%</span>
              </div>
              <input
                type='range'
                min='0.4'
                max='1.2'
                step='0.05'
                value={scale}
                onChange={(e) => {
                  const newScale = parseFloat(e.target.value)
                  setScale(newScale)
                  localStorage.setItem('debug_scale', String(newScale))
                }}
                className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
                style={{
                  accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
                }}
              />
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={() => {
              const defaults = {
                brightness: 0.5,
                speed: 3.0,
                variation: 40,
                size: 1.2,
                blur: 1.0,
                opacity: 2.0, // 200% default
                position: 1.0,
              }

              setOrbBrightness(defaults.brightness)
              setAnimationSpeed(defaults.speed)
              setColorVariation(defaults.variation)
              setOrbSize(defaults.size)
              setOrbBlur(defaults.blur)
              setOrbOpacity(defaults.opacity)
              setPositionVariation(defaults.position)

              // Force immediate localStorage update
              localStorage.setItem('orb_brightness', String(defaults.brightness))
              localStorage.setItem('animation_speed', String(defaults.speed))
              localStorage.setItem('color_variation', String(defaults.variation))
              localStorage.setItem('orb_size', String(defaults.size))
              localStorage.setItem('orb_blur', String(defaults.blur))
              localStorage.setItem('orb_opacity', String(defaults.opacity))
              localStorage.setItem('position_variation', String(defaults.position))
            }}
            className='w-full cursor-pointer rounded border border-gray-700 px-3 py-1.5 text-[10px] text-gray-400 transition-all hover:border-gray-500 hover:text-white'
          >
            RESET TO DEFAULT
          </button>

          {/* Reset Achievements Button - DEV ONLY */}
          <button
            onClick={() => {
              if (confirm('⚠️ Reset all achievements? This cannot be undone!')) {
                // Clear localStorage
                localStorage.removeItem('achievements')

                // Clear local state
                setAchievements([])

                // Dispatch event to notify EasterEggs component
                window.dispatchEvent(new CustomEvent('achievements-reset'))

                // Show confirmation message
                console.log(
                  '%c🔄 Achievements reset! All achievements cleared.',
                  'color: #ef4444; font-size: 14px; font-weight: bold;',
                )
              }
            }}
            className='w-full cursor-pointer rounded border border-red-700 px-3 py-1.5 text-[10px] text-red-400 transition-all hover:border-red-500 hover:text-red-300'
          >
            RESET ACHIEVEMENTS
          </button>
        </div>

        {/* DIVIDER */}
        <div
          className='my-3 border-t-2 border-gray-800'
          style={{ borderColor: `rgba(${orbR}, ${orbG}, ${orbB}, 0.3)` }}
        />

        {/* ACHIEVEMENTS SECTION */}
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Trophy className='h-3 w-3 text-yellow-400' />
            <span className='text-xs tracking-wider text-gray-500 uppercase'>Achievements</span>
            <span className='text-[10px] text-gray-600'>
              {achievements.filter((a) => a.unlocked).length}/{achievements.length}
            </span>
          </div>

          {achievements.length > 0 ? (
            <div className='grid grid-cols-4 gap-1.5'>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className='relative' // Add relative for positioning tooltip
                  ref={(el) => {
                    achievementRefs.current[achievement.id] = el
                  }}
                >
                  <div
                    className={`flex aspect-square cursor-pointer items-center justify-center rounded border-2 text-2xl transition-all ${
                      achievement.unlocked
                        ? 'border-yellow-400/50 bg-yellow-400/10'
                        : 'border-gray-700 bg-gray-800/30 opacity-30 grayscale'
                    } ${!isMobile && achievement.id === 'enlightenment' && achievement.unlocked ? 'ring-1 ring-yellow-400/40 ring-offset-1 ring-offset-black' : ''}`}
                    title={
                      !isMobile && achievement.id === 'enlightenment' && achievement.unlocked
                        ? '✨ Click to celebrate!'
                        : undefined
                    }
                    onMouseEnter={() => {
                      if (isMobile) return
                      const el = achievementRefs.current[achievement.id]
                      if (!el) return
                      const rect = el.getBoundingClientRect()
                      const tooltipHeight = 120
                      const tooltipWidth = 220
                      const showBelow = rect.top < tooltipHeight + 20
                      const itemCenterX = rect.left + rect.width / 2
                      const alignLeft = itemCenterX < tooltipWidth / 2
                      const alignRight = window.innerWidth - itemCenterX < tooltipWidth / 2
                      const fixedX = alignLeft
                        ? rect.left
                        : alignRight
                          ? rect.right - tooltipWidth
                          : itemCenterX - tooltipWidth / 2
                      const fixedY = showBelow ? rect.bottom + 8 : rect.top - tooltipHeight - 8
                      setTooltip({ achievement, show: true, fixedX, fixedY, showBelow, alignLeft, alignRight })
                    }}
                    onMouseLeave={() => {
                      // Desktop: hide tooltip on mouse leave
                      if (!isMobile) {
                        if (tooltipTimeoutRef.current) {
                          clearTimeout(tooltipTimeoutRef.current)
                        }
                        setTooltip(null)
                      }
                    }}
                    onClick={(e) => {
                      // Mobile: click to toggle tooltip
                      // Prevent default to avoid ghost clicks
                      if (isMobile) {
                        e.stopPropagation()

                        if (tooltip?.achievement.id === achievement.id) {
                          setTooltip(null)
                        } else {
                          setTooltip({ achievement, show: true })
                          // Auto-hide after 3 seconds on mobile
                          if (tooltipTimeoutRef.current) {
                            clearTimeout(tooltipTimeoutRef.current)
                          }
                          tooltipTimeoutRef.current = setTimeout(() => {
                            setTooltip(null)
                          }, 3000)
                        }
                        // Also fire confetti on mobile for enlightenment
                        if (achievement.id === 'enlightenment' && achievement.unlocked) {
                          window.dispatchEvent(new CustomEvent('enlightenment-clicked'))
                        }
                      } else if (achievement.id === 'enlightenment' && achievement.unlocked) {
                        window.dispatchEvent(new CustomEvent('enlightenment-clicked'))
                      }
                    }}
                  >
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>

                  {/* Mobile-only absolute tooltip — desktop uses fixed positioning at component root */}
                  {isMobile &&
                    tooltip?.achievement.id === achievement.id &&
                    (() => {
                      const itemEl = achievementRefs.current[achievement.id]
                      let showBelow = false
                      let alignLeft = false
                      let alignRight = false

                      if (itemEl) {
                        const rect = itemEl.getBoundingClientRect()
                        const tooltipHeight = 120
                        const tooltipWidth = 220
                        showBelow = rect.top < tooltipHeight + 20
                        const itemCenterX = rect.left + rect.width / 2
                        if (itemCenterX < tooltipWidth / 2) alignLeft = true
                        else if (window.innerWidth - itemCenterX < tooltipWidth / 2) alignRight = true
                      }

                      return (
                        <div
                          className={`pointer-events-none absolute z-9999 ${
                            showBelow ? 'top-full mt-2' : '-top-2 -translate-y-full'
                          } ${alignLeft ? 'left-0' : alignRight ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                          style={{ animation: 'fadeIn 0.2s ease-out' }}
                        >
                          <div
                            className='max-w-60 min-w-50 rounded-lg border-2 bg-gray-900 p-2 shadow-2xl'
                            style={{
                              borderColor: tooltip.achievement.unlocked
                                ? `rgb(${orbR}, ${orbG}, ${orbB})`
                                : 'rgb(107, 114, 128)',
                              boxShadow: tooltip.achievement.unlocked
                                ? `0 0 20px rgba(${orbR}, ${orbG}, ${orbB}, 0.4)`
                                : '0 4px 6px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <div className='mb-1 flex items-start gap-2'>
                              <span className='text-lg'>{tooltip.achievement.icon}</span>
                              <div className='flex-1'>
                                <div
                                  className={`text-[10px] font-semibold ${
                                    tooltip.achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                                  }`}
                                >
                                  {tooltip.achievement.unlocked ? tooltip.achievement.name : '???'}
                                </div>
                              </div>
                            </div>
                            <div className='mt-1 text-[9px] text-gray-400'>
                              {tooltip.achievement.unlocked
                                ? tooltip.achievement.description
                                : ACHIEVEMENT_HINTS[tooltip.achievement.id] || 'Keep exploring...'}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                </div>
              ))}
            </div>
          ) : (
            <div className='py-2 text-center text-[10px] text-gray-600'>No achievements yet. Keep exploring!</div>
          )}
        </div>

        {/* Hint */}
        <div className='border-t border-gray-800 pt-2 text-center text-[9px] text-gray-500'>
          <div className='hidden md:block'>Press 'D' to toggle</div>
        </div>
      </>
    )
  }
}
