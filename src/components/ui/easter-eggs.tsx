import { useEffect, useRef, useState } from 'react'

import confetti from 'canvas-confetti'
import { Trophy } from 'lucide-react'

/**
 * Easter Eggs System with Achievements
 *
 * Achievements:
 * 1. Triple-click logo → "Speed Clicker"
 * 2. Scroll to exactly 50% → "Perfectly Balanced"
 * 3. Idle 60 seconds → "Patience is a Virtue"
 * 4. Rapid 10 clicks → "Click Master"
 * 5. Copy text → "Copy Cat"
 * 6. Shake device → "Shake It Off"
 * 7. Scroll 10,000px → "Marathon Runner"
 * 8. Reach bottom <2min → "Speed Reader"
 * 9. Visit 3+ times → "Repeat Visitor"
 * 10. Visit 5 sections → "Section Hopper"
 * 11. Visit all sections → "World Tour"
 * 12. Tweak orb settings 5x → "Settings Tinkerer"
 * 13. Use navigation controls 3x → "Nav Master"
 * 14. Use scroll-to-top shortcut → "Round Trip"
 * 15. Reach contact and return hero → "Back to Origin"
 * 16. Unlocked all 15 → "Enlightenment" (auto-unlock)
 *
 * Open Dev Console (tap terminal icon bottom-left or press D on desktop) to see all achievements!
 */

/** Module-level holder for the canvas-bound confetti function — set after canvas mounts */
let _canvasFire: ((opts: confetti.Options) => Promise<null> | null) | null = null

/** Realistic dual-cannon + top-shower casino confetti burst via canvas-confetti */
function fireCasinoConfetti() {
  const fire = (opts: confetti.Options) => (_canvasFire ? _canvasFire(opts) : confetti(opts))
  const COLORS = ['#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#e5e7eb']

  // Cannon burst — both sides simultaneously
  fire({
    particleCount: 140,
    angle: 60,
    spread: 70,
    startVelocity: 60,
    decay: 0.92,
    gravity: 1.1,
    ticks: 350,
    origin: { x: 0, y: 0.78 },
    colors: COLORS,
  })
  fire({
    particleCount: 140,
    angle: 120,
    spread: 70,
    startVelocity: 60,
    decay: 0.92,
    gravity: 1.1,
    ticks: 350,
    origin: { x: 1, y: 0.78 },
    colors: COLORS,
  })

  // Top shower
  setTimeout(() => {
    fire({
      particleCount: 100,
      spread: 150,
      startVelocity: 30,
      decay: 0.9,
      gravity: 0.7,
      ticks: 400,
      origin: { x: 0.5, y: 0 },
      colors: COLORS,
      scalar: 1.2,
    })
  }, 220)

  // Gold second wave
  setTimeout(() => {
    fire({
      particleCount: 90,
      angle: 60,
      spread: 60,
      startVelocity: 50,
      origin: { x: 0, y: 0.88 },
      colors: ['#fbbf24', '#f59e0b'],
      ticks: 300,
    })
    fire({
      particleCount: 90,
      angle: 120,
      spread: 60,
      startVelocity: 50,
      origin: { x: 1, y: 0.88 },
      colors: ['#fbbf24', '#f59e0b'],
      ticks: 300,
    })
  }, 500)

  // Final shimmer
  setTimeout(() => {
    fire({
      particleCount: 60,
      spread: 180,
      startVelocity: 20,
      decay: 0.88,
      gravity: 0.5,
      ticks: 350,
      origin: { x: Math.random(), y: 0.2 },
      colors: COLORS,
      scalar: 0.9,
    })
  }, 900)
}

interface Sparkle {
  id: number
  x: number // vw percentage
  duration: number
  size: number
  color: string
  symbol: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'triple-click',
    name: 'Speed Clicker',
    description: 'Triple-clicked the logo',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'perfectly-balanced',
    name: 'Perfectly Balanced',
    description: 'Scrolled to exactly 50% of the page',
    icon: '⚖️',
    unlocked: false,
  },
  {
    id: 'patience',
    name: 'Patience is a Virtue',
    description: 'Stayed idle for 60 seconds',
    icon: '💤',
    unlocked: false,
  },
  {
    id: 'rapid-clicker',
    name: 'Click Master',
    description: 'Clicked 10 times in 2 seconds',
    icon: '🖱️',
    unlocked: false,
  },
  {
    id: 'copy-cat',
    name: 'Copy Cat',
    description: 'Copied some text',
    icon: '📋',
    unlocked: false,
  },
  {
    id: 'shake',
    name: 'Shake It Off',
    description: 'Shook your device or moved mouse rapidly',
    icon: '📱',
    unlocked: false,
  },
  {
    id: 'marathon-runner',
    name: 'Marathon Runner',
    description: 'Scrolled a total of 10,000 pixels',
    icon: '🏃',
    unlocked: false,
  },
  {
    id: 'speed-reader',
    name: 'Speed Reader',
    description: 'Reached the bottom in under 2 minutes',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'repeat-visitor',
    name: 'Repeat Visitor',
    description: 'Visited the site 3+ times',
    icon: '🔄',
    unlocked: false,
  },
  {
    id: 'section-hopper',
    name: 'Section Hopper',
    description: 'Visited 5 different sections',
    icon: '🧭',
    unlocked: false,
  },
  {
    id: 'world-tour',
    name: 'World Tour',
    description: 'Visited every section on the page',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'settings-tinkerer',
    name: 'Settings Tinkerer',
    description: 'Tweaked orb settings 5 times',
    icon: '🎛️',
    unlocked: false,
  },
  {
    id: 'nav-master',
    name: 'Nav Master',
    description: 'Used navigation controls 3 times',
    icon: '🛰️',
    unlocked: false,
  },
  {
    id: 'round-trip',
    name: 'Round Trip',
    description: 'Used the scroll-to-top shortcut',
    icon: '🔝',
    unlocked: false,
  },
  {
    id: 'back-to-origin',
    name: 'Back to Origin',
    description: 'Reached contact and returned to hero',
    icon: '🏠',
    unlocked: false,
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment',
    description: 'Unlocked all 15 other achievements',
    icon: '✨',
    unlocked: false,
  },
]

export function EasterEggs() {
  const canUseStorage = typeof window !== 'undefined'
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (!canUseStorage) {
      return ACHIEVEMENTS
    }
    try {
      const saved = localStorage.getItem('achievements')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge with default achievements to ensure all achievements exist
        return ACHIEVEMENTS.map((defaultAch) => {
          const savedAch = parsed.find((a: Achievement) => a.id === defaultAch.id)
          return savedAch ? { ...defaultAch, ...savedAch } : defaultAch
        })
      }
    } catch (e) {
      console.error('Failed to load achievements:', e)
      localStorage.removeItem('achievements')
    }
    return ACHIEVEMENTS
  })

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [isHidingAchievement, setIsHidingAchievement] = useState(false)
  const achievementTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const achievementHidingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [idleCursor, setIdleCursor] = useState(false)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; type?: string; color?: string; drift?: number }>
  >([])
  const [achievementsEnabled, setAchievementsEnabled] = useState(() => {
    if (!canUseStorage) {
      return false
    }

    return localStorage.getItem('dev_console_opened') === 'true'
  })

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const clickTimesRef = useRef<number[]>([])
  const userHasInteractedRef = useRef(false) // Track if user has actually interacted
  const visitedSectionsRef = useRef(new Set<string>())
  const navClicksRef = useRef(0)
  const orbSettingsChangesRef = useRef(0)
  const hasReachedContactRef = useRef(false)
  // Sync achievementsEnabled into a ref so unlockAchievement can read the latest value
  // without being listed as a dependency in event-listener effects
  const achievementsEnabledRef = useRef(achievementsEnabled)
  achievementsEnabledRef.current = achievementsEnabled

  useEffect(() => {
    if (!canUseStorage) {
      return
    }

    const activateAchievements = () => {
      setAchievementsEnabled(true)
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'dev_console_opened' && event.newValue === 'true') {
        setAchievementsEnabled(true)
      }
    }

    window.addEventListener('dev-console-opened', activateAchievements)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('dev-console-opened', activateAchievements)
      window.removeEventListener('storage', handleStorage)
    }
  }, [canUseStorage])

  // Unlock achievement helper — called via ref so effects don't need it in their deps arrays.
  // The ref is always up-to-date (assigned every render below), so event listeners
  // remain registered across re-renders without triggering re-registration.
  const unlockAchievementRef = useRef<(id: string) => void>(() => {})
  const unlockAchievement = (id: string) => {
    if (!canUseStorage || !achievementsEnabledRef.current) {
      return
    }

    setAchievements((prev) => {
      const achievement = prev.find((a) => a.id === id)
      if (!achievement || achievement.unlocked) {
        return prev
      }

      const updated = prev.map((a) => (a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a))

      // Show achievement popup
      const unlockedAchievement = updated.find((a) => a.id === id)
      if (unlockedAchievement) {
        // Clear any pending timers
        if (achievementTimeoutRef.current) clearTimeout(achievementTimeoutRef.current)
        if (achievementHidingTimeoutRef.current) clearTimeout(achievementHidingTimeoutRef.current)

        // Show popup immediately
        setShowAchievement(unlockedAchievement)
        setIsHidingAchievement(false)

        // Trigger exit animation after 4 seconds (visible time)
        achievementTimeoutRef.current = setTimeout(() => {
          setIsHidingAchievement(true)

          // Remove from DOM after exit animation completes (0.5s)
          achievementHidingTimeoutRef.current = setTimeout(() => {
            setShowAchievement(null)
            setIsHidingAchievement(false)
          }, 500)
        }, 4000)

        // Console message
        console.log(`%c🏆 Achievement Unlocked!`, 'color: #fbbf24; font-size: 16px; font-weight: bold;')
        console.log(`%c${unlockedAchievement.icon} ${unlockedAchievement.name}`, 'color: #a855f7; font-size: 14px;')
        console.log(`%c${unlockedAchievement.description}`, 'color: #9ca3af; font-size: 12px;')
      }

      return updated
    })
  }
  unlockAchievementRef.current = unlockAchievement

  // SHOW ACHIEVEMENT LIST ON PAGE LOAD (only after dev console opened)
  useEffect(() => {
    if (achievementsEnabled) {
      // Show achievement list in console
      console.log(
        '%c🏆 ACHIEVEMENT SYSTEM',
        'color: #fbbf24; font-size: 18px; font-weight: bold; text-decoration: underline;',
      )
      console.log(
        '%c16 achievements available! Press D to open Dev Console and track your progress.',
        'color: #a855f7; font-size: 12px;',
      )
      console.log('') // Empty line

      ACHIEVEMENTS.forEach((achievement, _index) => {
        const unlocked = achievements.find((a) => a.id === achievement.id)?.unlocked
        console.log(
          `%c${unlocked ? '✅' : '🔒'} ${achievement.icon} ${achievement.name}`,
          `color: ${unlocked ? '#10b981' : '#6b7280'}; font-size: 11px; ${unlocked ? 'font-weight: bold;' : ''}`,
        )
        console.log(`   %c${achievement.description}`, `color: #9ca3af; font-size: 10px; font-style: italic;`)
      })

      console.log('') // Empty line
      console.log(
        '%c💡 Hint: Explore the page to discover how to unlock each achievement!',
        'color: #6b7280; font-size: 10px; font-style: italic;',
      )
    }
  }, [achievements, achievementsEnabled])

  // Save achievements to localStorage
  useEffect(() => {
    if (!canUseStorage) {
      return
    }
    localStorage.setItem('achievements', JSON.stringify(achievements))

    // Check if all 15 base achievements are unlocked and auto-unlock Enlightenment
    const baseAchievements = achievements.filter((a) => a.id !== 'enlightenment')
    const enlightenmentAch = achievements.find((a) => a.id === 'enlightenment')
    const allBaseUnlocked = baseAchievements.length === 15 && baseAchievements.every((a) => a.unlocked)

    if (allBaseUnlocked && enlightenmentAch && !enlightenmentAch.unlocked) {
      // Trigger Enlightenment unlock with mega celebration
      setTimeout(() => {
        unlockAchievementRef.current('enlightenment')
        fireCasinoConfetti()

        console.log(
          '%c🌟 ENLIGHTENMENT UNLOCKED! 🌟',
          'color: #fbbf24; font-size: 24px; font-weight: bold; text-shadow: 0 0 20px #fbbf24;',
        )
        console.log(
          '%cYou have discovered the hidden path. You are now one with the code.',
          'color: #a855f7; font-size: 14px; font-style: italic;',
        )
      }, 100)
    }

    // Broadcast to DeveloperConsole component
    window.dispatchEvent(
      new CustomEvent('achievements-updated', {
        detail: { achievements },
      }),
    )
  }, [achievements, canUseStorage])

  // Listen for achievements reset event
  useEffect(() => {
    const handleReset = () => {
      setAchievements(ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined })))
      localStorage.setItem('achievements', JSON.stringify(ACHIEVEMENTS))
    }

    window.addEventListener('achievements-reset', handleReset)

    return () => {
      window.removeEventListener('achievements-reset', handleReset)
    }
  }, [])

  // 1. TRIPLE-CLICK ON LOGO
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    let clickCount = 0
    let clickTimer: NodeJS.Timeout

    const handleLogoClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if clicked on hero heading (contains "Lukáš Machala")
      if (target.closest('h1') && target.textContent?.includes('Lukáš Machala')) {
        clickCount++

        if (clickCount === 3) {
          unlockAchievementRef.current('triple-click')
          clickCount = 0
        }

        clearTimeout(clickTimer)
        clickTimer = setTimeout(() => {
          clickCount = 0
        }, 500) // Reset after 500ms
      }
    }

    document.addEventListener('click', handleLogoClick)
    return () => {
      document.removeEventListener('click', handleLogoClick)
      clearTimeout(clickTimer)
    }
  }, [achievementsEnabled])

  // 2. PERFECTLY BALANCED (50% scroll)
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    let checkTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(checkTimeout)

      checkTimeout = setTimeout(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const winHeight = window.innerHeight
        const maxScroll = docHeight - winHeight
        const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0

        // Keep this forgiving to avoid flaky precision around section/layout rounding.
        if (Math.abs(percent - 50) < 2.5) {
          unlockAchievementRef.current('perfectly-balanced')

          // Special console message with explanation
          console.log('%c⚖ PERFECTLY BALANCED!', 'color: #10b981; font-size: 16px; font-weight: bold;')
          console.log('%cYou scrolled to exactly 50% of the page!', 'color: #a855f7; font-size: 12px;')
          console.log(
            '%cHow did you balance it so perfectly? 🤔',
            'color: #6b7280; font-size: 11px; font-style: italic;',
          )
        }
      }, 200) // Debounce for 200ms
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(checkTimeout)
    }
  }, [achievementsEnabled])

  // 3. PATIENCE IS A VIRTUE (idle for 60 seconds)
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    const markUserInteraction = () => {
      if (!userHasInteractedRef.current) {
        userHasInteractedRef.current = true
        console.log('%c👋 User interaction detected, idle timer started', 'color: #6b7280; font-size: 10px;')
      }
    }

    const resetIdleTimer = () => {
      setIdleCursor(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      // Only start timer if user has interacted
      if (userHasInteractedRef.current) {
        idleTimerRef.current = setTimeout(() => {
          setIdleCursor(true)
          unlockAchievementRef.current('patience')

          // Whisper message in console
          console.log(
            "%c💤 Still here? You've been idle for 60 seconds...",
            'color: #6b7280; font-size: 12px; font-style: italic;',
          )
        }, 60000) // 60 seconds
      }
    }

    const interactionEvents = ['mousedown', 'keypress', 'touchstart', 'click']
    const idleEvents = ['mousemove', 'scroll']

    // Mark interaction
    interactionEvents.forEach((event) => window.addEventListener(event, markUserInteraction, { once: false }))

    // Reset timer on any activity
    ;[...interactionEvents, ...idleEvents].forEach((event) => window.addEventListener(event, resetIdleTimer))

    return () => {
      interactionEvents.forEach((event) => window.removeEventListener(event, markUserInteraction))
      ;[...interactionEvents, ...idleEvents].forEach((event) => window.removeEventListener(event, resetIdleTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [achievementsEnabled])

  // Apply idle cursor
  useEffect(() => {
    if (idleCursor) {
      document.body.style.cursor =
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ctext x='0' y='24' font-size='24'%3E💤%3C/text%3E%3C/svg%3E\"), auto"
    } else {
      document.body.style.cursor = ''
    }

    return () => {
      document.body.style.cursor = ''
    }
  }, [idleCursor])

  // 4. RAPID CLICKER (10 clicks in 2 seconds)
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    const handleClick = (e: MouseEvent) => {
      const now = Date.now()
      clickTimesRef.current.push(now)

      // Remove clicks older than 2 seconds
      clickTimesRef.current = clickTimesRef.current.filter((time) => now - time < 2000)

      if (clickTimesRef.current.length >= 10) {
        unlockAchievementRef.current('rapid-clicker')

        // Create particle effect at click position
        const newParticle = { id: Date.now(), x: e.clientX, y: e.clientY }
        setParticles((prev) => [...prev, newParticle])

        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
        }, 1000)

        clickTimesRef.current = []
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [achievementsEnabled])

  // 5. COPY TEXT
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    const handleCopy = () => {
      unlockAchievementRef.current('copy-cat')

      // Add custom message to clipboard
      const selection = window.getSelection()?.toString()
      if (selection) {
        setTimeout(() => {
          console.log('%c📋 Copied! Thanks for sharing lowcash.dev 🚀', 'color: #ec4899; font-size: 12px;')
        }, 100)
      }
    }

    document.addEventListener('copy', handleCopy)
    return () => document.removeEventListener('copy', handleCopy)
  }, [achievementsEnabled])

  // 6. RAPID SCROLL (mobile) + RAPID MOUSE MOVEMENT (desktop)
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    // Detect if on mobile/touch device
    const isMobileDevice = () => {
      return (
        typeof window !== 'undefined' &&
        (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 2))
      )
    }

    const mobileMode = isMobileDevice()
    let scrollTimer: NodeJS.Timeout | undefined
    let mouseTimer: NodeJS.Timeout | undefined

    // MOBILE: Scroll detection
    let scrollEvents: Array<{ time: number; scrollY: number }> = []

    const handleScroll = () => {
      if (!mobileMode) return

      const now = Date.now()
      const currentScroll = window.scrollY

      scrollEvents.push({ time: now, scrollY: currentScroll })
      scrollEvents = scrollEvents.filter((e) => now - e.time < 1000)

      // Calculate total scroll distance in the last 1 second
      if (scrollEvents.length >= 2) {
        const firstEvent = scrollEvents[0]
        const lastEvent = scrollEvents[scrollEvents.length - 1]
        const scrollDistance = Math.abs(lastEvent.scrollY - firstEvent.scrollY)

        if (scrollDistance > 500) {
          if (scrollTimer) clearTimeout(scrollTimer)
          unlockAchievementRef.current('shake')
          scrollEvents = []

          const root = document.documentElement
          const randomVariation = Math.random() * 100
          root.style.setProperty('--color-variation', String(randomVariation / 100))

          console.log('%c📜 Rapid scroll detected! Colors shuffled!', 'color: #ec4899; font-size: 14px;')
        }
      }
    }

    // DESKTOP: Mouse movement detection (keep existing logic)
    let lastX = 0
    let lastY = 0
    let mouseMovements: Array<{ time: number; distance: number }> = []

    const handleMouseMove = (e: MouseEvent) => {
      if (mobileMode) return

      const now = Date.now()
      const deltaX = Math.abs(e.clientX - lastX)
      const deltaY = Math.abs(e.clientY - lastY)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distance > 100) {
        mouseMovements.push({ time: now, distance })
        mouseMovements = mouseMovements.filter((m) => now - m.time < 1000)

        if (mouseMovements.length >= 8) {
          const totalDistance = mouseMovements.reduce((sum, m) => sum + m.distance, 0)

          if (totalDistance > 2000) {
            if (mouseTimer) clearTimeout(mouseTimer)
            unlockAchievementRef.current('shake')
            mouseMovements = []

            const root = document.documentElement
            const randomVariation = Math.random() * 100
            root.style.setProperty('--color-variation', String(randomVariation / 100))

            console.log('%c🖱️ Rapid mouse movement detected! Colors shuffled!', 'color: #ec4899; font-size: 14px;')
          }
        }
      }

      lastX = e.clientX
      lastY = e.clientY
    }

    if (mobileMode) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    } else {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (mobileMode) {
        window.removeEventListener('scroll', handleScroll)
        if (scrollTimer) clearTimeout(scrollTimer)
      } else {
        window.removeEventListener('mousemove', handleMouseMove)
        if (mouseTimer) clearTimeout(mouseTimer)
      }
    }
  }, [achievementsEnabled])

  // 8. SECTION EXPLORATION + HERO RETURN
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    const sectionIds = [
      'hero',
      'who-i-am',
      'tech-journey',
      'notable-work',
      'work-experience',
      'education',
      'beyond-code',
      'whats-next',
      'contact',
    ]

    const checkSections = () => {
      const viewportMiddle = window.innerHeight / 2
      let activeSection: string | null = null
      let closestDistance = Number.POSITIVE_INFINITY

      sectionIds.forEach((id) => {
        const element = document.getElementById(id)
        if (!element) {
          return
        }

        const rect = element.getBoundingClientRect()
        const sectionMiddle = rect.top + rect.height / 2
        const distance = Math.abs(sectionMiddle - viewportMiddle)

        if (distance < closestDistance) {
          closestDistance = distance
          activeSection = id
        }
      })

      if (!activeSection) {
        return
      }

      visitedSectionsRef.current.add(activeSection)

      if (visitedSectionsRef.current.size >= 5) {
        unlockAchievementRef.current('section-hopper')
      }

      if (visitedSectionsRef.current.size === sectionIds.length) {
        unlockAchievementRef.current('world-tour')
      }

      if (activeSection === 'contact') {
        hasReachedContactRef.current = true
      }

      if (hasReachedContactRef.current && activeSection === 'hero' && window.scrollY < 220) {
        unlockAchievementRef.current('back-to-origin')
      }
    }

    checkSections()
    window.addEventListener('scroll', checkSections, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkSections)
    }
  }, [achievementsEnabled])

  // 11. ORB SETTINGS TINKERER
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    const handleSettingsChange = () => {
      orbSettingsChangesRef.current += 1
      if (orbSettingsChangesRef.current >= 5) {
        unlockAchievementRef.current('settings-tinkerer')
      }
    }

    window.addEventListener('orb-settings-change', handleSettingsChange)

    return () => {
      window.removeEventListener('orb-settings-change', handleSettingsChange)
    }
  }, [achievementsEnabled])

  // 12. NAVIGATION INTERACTIONS
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const triggerButton = target.closest('button')

      if (!triggerButton) {
        return
      }

      if (triggerButton.matches('button[aria-label="Scroll to top of page"]')) {
        unlockAchievementRef.current('round-trip')
      }

      const isDesktopNav = triggerButton.matches('button[aria-label^="Navigate to "]')
      const isMobileNav = Boolean(triggerButton.closest('#mobile-navigation-menu'))

      if (isDesktopNav || isMobileNav) {
        navClicksRef.current += 1
        if (navClicksRef.current >= 3) {
          unlockAchievementRef.current('nav-master')
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [achievementsEnabled])

  // 7. MARATHON RUNNER (10,000 pixels scrolled)
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    let totalScroll = 0
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      totalScroll += Math.abs(currentScrollY - previousScrollY)
      previousScrollY = currentScrollY

      if (totalScroll >= 10000) {
        unlockAchievementRef.current('marathon-runner')

        console.log(
          '%c🏃 MARATHON RUNNER! You scrolled a total of 10,000 pixels!',
          'color: #6b7280; font-size: 16px; font-weight: bold;',
        )

        // Remove event listener to prevent further unlocking
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [achievementsEnabled])

  // 14. SPEED READER (reach bottom in under 2 minutes)
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    const startTime = Date.now()
    const docHeight = document.documentElement.scrollHeight
    const winHeight = window.innerHeight
    const maxScroll = docHeight - winHeight

    const handleScroll = () => {
      const scrollTop = window.scrollY

      if (scrollTop >= maxScroll) {
        const endTime = Date.now()
        const duration = (endTime - startTime) / 1000 // Convert to seconds

        if (duration < 120) {
          // 2 minutes
          unlockAchievementRef.current('speed-reader')

          console.log(
            '%c📚 SPEED READER! You reached the bottom in under 2 minutes!',
            'color: #6b7280; font-size: 16px; font-weight: bold;',
          )

          // Remove event listener to prevent further unlocking
          window.removeEventListener('scroll', handleScroll)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [achievementsEnabled])

  // 15. REPEAT VISITOR (3+ visits)
  useEffect(() => {
    if (!canUseStorage || !achievementsEnabled) {
      return
    }
    const visitCount = localStorage.getItem('visit_count')
    const count = visitCount ? parseInt(visitCount, 10) : 0

    if (count >= 3) {
      unlockAchievementRef.current('repeat-visitor')

      console.log(
        '%c🔄 REPEAT VISITOR! You visited the site 3+ times!',
        'color: #6b7280; font-size: 16px; font-weight: bold;',
      )
    }

    // Increment visit count
    localStorage.setItem('visit_count', String(count + 1))
  }, [achievementsEnabled, canUseStorage])

  // Handle Enlightenment click for confetti
  const handleEnlightenmentClick = () => {
    if (showAchievement?.id === 'enlightenment') {
      fireCasinoConfetti()
    }
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (achievementTimeoutRef.current) clearTimeout(achievementTimeoutRef.current)
      if (achievementHidingTimeoutRef.current) clearTimeout(achievementHidingTimeoutRef.current)
    }
  }, [])

  // Prevent SSR/client hydration mismatch — premium overlay depends on localStorage
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Derive enlightenment unlock state for premium UI — only after mount
  const enlightenmentUnlocked = mounted && (achievements.find((a) => a.id === 'enlightenment')?.unlocked ?? false)

  // Sync premium state to document root when enlightenment is unlocked
  useEffect(() => {
    if (enlightenmentUnlocked) {
      document.documentElement.setAttribute('data-enlightened', 'true')
    } else {
      document.documentElement.removeAttribute('data-enlightened')
    }
  }, [enlightenmentUnlocked])

  // Bind canvas-confetti to our dedicated canvas so confetti renders above all overlays (DevConsole z:130)
  useEffect(() => {
    if (!confettiCanvasRef.current) return
    const instance = confetti.create(confettiCanvasRef.current, { resize: true, useWorker: false })
    _canvasFire = instance
    return () => {
      instance.reset()
      _canvasFire = null
    }
  }, [])

  // Replenish floating sparkles while enlightened
  useEffect(() => {
    const SYMBOLS = ['\u2726', '\u2727', '\u22c6', '\u25c6'] as const
    const COLORS = ['#fbbf24', '#f59e0b', '#fde68a'] as const
    if (!enlightenmentUnlocked) {
      setSparkles([])
      return
    }
    const spawn = (): Sparkle => ({
      id: Date.now() + Math.random(),
      x: 5 + Math.random() * 90,
      duration: 7 + Math.random() * 5,
      size: 14 + Math.random() * 18,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    })
    setSparkles(Array.from({ length: 14 }, spawn))
    const iv = setInterval(() => setSparkles((prev) => [...prev.slice(-18), spawn()]), 1200)
    return () => clearInterval(iv)
  }, [enlightenmentUnlocked])

  // Listen for enlightenment-clicked event dispatched by DevConsole for casino confetti
  useEffect(() => {
    const handleConsoleCelebrate = () => fireCasinoConfetti()
    window.addEventListener('enlightenment-clicked', handleConsoleCelebrate)
    return () => window.removeEventListener('enlightenment-clicked', handleConsoleCelebrate)
  }, [])

  const renderAchievementCard = (width: string, marginRight?: string) => {
    return (
      <div
        onClick={handleEnlightenmentClick}
        role='alert'
        aria-live='polite'
        className={`pointer-events-auto rounded-xl border border-purple-500/50 p-4 shadow-2xl transition-all ${showAchievement?.id === 'enlightenment' ? 'cursor-pointer hover:shadow-[0_0_60px_rgba(251,191,36,0.4)]' : ''}`}
        style={{
          width,
          marginRight,
          animation: isHidingAchievement
            ? 'slideOutRight 0.5s ease-in forwards'
            : 'slideInRight 0.5s ease-out forwards',
          borderColor: 'rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.6)',
          boxShadow:
            '0 0 45px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.35), 0 0 90px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.18)',
          backdropFilter: 'blur(16px)',
          background: 'rgba(10, 10, 20, 0.42)',
        }}
      >
        <div className='flex items-start gap-3'>
          <div className={`text-3xl ${showAchievement?.id === 'enlightenment' ? 'animate-pulse' : ''}`}>
            {showAchievement?.icon}
          </div>
          <div className='flex-1'>
            <div className='mb-1 flex items-center gap-2'>
              <Trophy className='h-4 w-4 text-yellow-400' />
              <span className='text-sm font-semibold text-yellow-400'>Achievement Unlocked!</span>
            </div>
            <h3 className='font-semibold text-white'>{showAchievement?.name}</h3>
            <p className='mt-1 text-sm text-gray-300'>{showAchievement?.description}</p>
            {showAchievement?.id === 'enlightenment' && (
              <p className='mt-2 text-xs text-[#fbbf24]'>✨ Click for celebration!</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Dedicated confetti canvas — fixed above all overlays including mobile DevConsole (z:130) */}
      <canvas
        ref={confettiCanvasRef}
        aria-hidden='true'
        className='pointer-events-none fixed inset-0'
        style={{ zIndex: 200, width: '100%', height: '100%' }}
      />

      {/* Achievement Popup - above all overlays including devTools (z:130). Positioned context-aware for all breakpoints. */}
      {showAchievement && (
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
      )}

      {/* Particle Effects */}
      {particles.map((particle) => {
        const isSquare = particle.type === 'square'
        const isStar = particle.type === 'star'
        const color = particle.color || '#a855f7'

        return (
          <div
            key={particle.id}
            className='pointer-events-none fixed'
            style={{
              zIndex: 90,
              left: particle.x,
              top: particle.y,
              animation: `${particle.drift === -1 ? 'confettiFallLeft' : particle.drift === 1 ? 'confettiFallRight' : 'confettiFall'} 2.5s ease-in forwards`,
            }}
          >
            {isSquare ? (
              <div
                className='h-4 w-4 rounded-sm'
                style={{
                  backgroundColor: color,
                  animation: 'confettiSpin 2.5s linear forwards',
                }}
              />
            ) : isStar ? (
              <div
                style={{
                  fontSize: '28px',
                  animation: 'confettiSpin 2.5s linear forwards',
                }}
              >
                ✨
              </div>
            ) : (
              <div
                className='h-4 w-4 rounded-full'
                style={{
                  backgroundColor: color,
                  animation: 'confettiBounce 2.5s ease-in forwards',
                }}
              />
            )}
          </div>
        )
      })}

      {/* Floating gold sparkles — ambient atmosphere when enlightened */}
      {enlightenmentUnlocked &&
        sparkles.map((s) => (
          <div
            key={s.id}
            className='pointer-events-none fixed'
            aria-hidden='true'
            style={{
              left: `${s.x}%`,
              bottom: 0,
              zIndex: 3,
              fontSize: `${s.size}px`,
              color: s.color,
              opacity: 0,
              animation: `sparkleRise ${s.duration}s ease-out forwards`,
            }}
          >
            {s.symbol}
          </div>
        ))}

      {/* Premium golden vignette frame — visible once all achievements are unlocked */}
      {enlightenmentUnlocked && (
        <>
          {/* Golden sweeping hairline — animated gleam at very top of viewport */}
          <div
            className='pointer-events-none fixed inset-x-0 top-0'
            aria-hidden='true'
            style={{
              zIndex: 4,
              height: '2px',
              background:
                'linear-gradient(90deg, transparent 0%, #fbbf24 30%, #fde68a 50%, #fbbf24 70%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'goldenBeam 3s ease-in-out infinite alternate',
            }}
          />

          {/* Top gold glow */}
          <div
            className='pointer-events-none fixed inset-x-0 top-0'
            aria-hidden='true'
            style={{
              zIndex: 1,
              height: '35vh',
              background: 'linear-gradient(to bottom, rgba(251,191,36,0.13) 0%, transparent 100%)',
              animation: 'enlightenedPulse 5s ease-in-out infinite',
            }}
          />
          {/* Bottom gold glow */}
          <div
            className='pointer-events-none fixed inset-x-0 bottom-0'
            aria-hidden='true'
            style={{
              zIndex: 1,
              height: '30vh',
              background: 'linear-gradient(to top, rgba(251,191,36,0.10) 0%, transparent 100%)',
              animation: 'enlightenedPulse 5s ease-in-out infinite 2.5s',
            }}
          />
          {/* Left gold glow */}
          <div
            className='pointer-events-none fixed inset-y-0 left-0'
            aria-hidden='true'
            style={{
              zIndex: 1,
              width: '20vw',
              background: 'linear-gradient(to right, rgba(251,191,36,0.07) 0%, transparent 100%)',
              animation: 'enlightenedSidePulse 7s ease-in-out infinite',
            }}
          />
          {/* Right gold glow */}
          <div
            className='pointer-events-none fixed inset-y-0 right-0'
            aria-hidden='true'
            style={{
              zIndex: 1,
              width: '20vw',
              background: 'linear-gradient(to left, rgba(251,191,36,0.07) 0%, transparent 100%)',
              animation: 'enlightenedSidePulse 7s ease-in-out infinite 3.5s',
            }}
          />
          {/* Inset frame shadow */}
          <div
            className='pointer-events-none fixed inset-0'
            aria-hidden='true'
            style={{
              zIndex: 1,
              boxShadow: 'inset 0 0 80px rgba(251,191,36,0.08), inset 0 0 160px rgba(251,191,36,0.04)',
            }}
          />
        </>
      )}
    </>
  )
}
