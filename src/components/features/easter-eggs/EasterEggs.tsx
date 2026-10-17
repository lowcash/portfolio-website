import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { AchievementPopup } from './achievement-popup'
import { ACHIEVEMENTS, type Achievement } from './achievements'
import { bindConfettiCanvas, fireCasinoConfetti } from './confetti'
import { EnlightenedAtmosphere } from './enlightened-atmosphere'
import { useIdleAchievement, useRepeatVisitor, useSettingsTinkerer, useShake } from './triggers/behavior-triggers'
import {
  type ClickParticle,
  useCopyCat,
  useNavigationInteractions,
  useRapidClicker,
  useTripleClickLogo,
} from './triggers/click-triggers'
import {
  useMarathonRunner,
  usePerfectlyBalanced,
  useSectionExploration,
  useSpeedReader,
} from './triggers/scroll-triggers'

// false on the server and during hydration, true afterwards: avoids a hydration mismatch for localStorage-derived UI
const subscribeToNothing = () => () => {}

/**
 * Easter eggs and achievements. Detection lives in ./triggers, this component owns the unlock state, persistence
 * and the overlays. Everything stays dormant until the developer console has been opened once.
 */
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
  const [particles, setParticles] = useState<ClickParticle[]>([])
  const [achievementsEnabled, setAchievementsEnabled] = useState(() => {
    if (!canUseStorage) {
      return false
    }

    return localStorage.getItem('dev_console_opened') === 'true'
  })

  // Sync achievementsEnabled into a ref so unlockAchievement can read the latest value
  // without being listed as a dependency in event-listener effects
  const achievementsEnabledRef = useRef(achievementsEnabled)

  useEffect(() => {
    achievementsEnabledRef.current = achievementsEnabled
  }, [achievementsEnabled])

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

  // Unlock achievement helper – called via ref so effects don't need it in their deps arrays.
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

  // Runs before the trigger hooks below (effects run in call order), so they always see the latest unlock function
  useEffect(() => {
    unlockAchievementRef.current = unlockAchievement
  })

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

  const spawnParticle = useCallback((particle: ClickParticle) => {
    setParticles((prev) => [...prev, particle])

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particle.id))
    }, 1000)
  }, [])

  useTripleClickLogo(achievementsEnabled, unlockAchievementRef)
  usePerfectlyBalanced(achievementsEnabled, unlockAchievementRef)
  useIdleAchievement(achievementsEnabled, unlockAchievementRef)
  useRapidClicker(achievementsEnabled, unlockAchievementRef, spawnParticle)
  useCopyCat(achievementsEnabled, unlockAchievementRef)
  useShake(achievementsEnabled, unlockAchievementRef)
  useSectionExploration(achievementsEnabled, unlockAchievementRef)
  useSettingsTinkerer(achievementsEnabled, unlockAchievementRef)
  useNavigationInteractions(achievementsEnabled, unlockAchievementRef)
  useMarathonRunner(achievementsEnabled, unlockAchievementRef)
  useSpeedReader(achievementsEnabled, unlockAchievementRef)
  useRepeatVisitor(achievementsEnabled, unlockAchievementRef)

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

  // Prevent SSR/client hydration mismatch – premium overlay depends on localStorage
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )

  // Derive enlightenment unlock state for premium UI – only after mount
  const enlightenmentUnlocked = mounted && (achievements.find((a) => a.id === 'enlightenment')?.unlocked ?? false)

  // Bind canvas-confetti to our dedicated canvas so confetti renders above all overlays (DevConsole z:130)
  useEffect(() => {
    return confettiCanvasRef.current ? bindConfettiCanvas(confettiCanvasRef.current) : undefined
  }, [])

  // Listen for enlightenment-clicked event dispatched by DevConsole for casino confetti
  useEffect(() => {
    const handleConsoleCelebrate = () => fireCasinoConfetti()
    window.addEventListener('enlightenment-clicked', handleConsoleCelebrate)
    return () => window.removeEventListener('enlightenment-clicked', handleConsoleCelebrate)
  }, [])

  return (
    <>
      {/* Dedicated confetti canvas – fixed above all overlays including mobile DevConsole (z:130) */}
      <canvas
        ref={confettiCanvasRef}
        aria-hidden='true'
        className='pointer-events-none fixed inset-0'
        style={{ zIndex: 200, width: '100%', height: '100%' }}
      />

      <AchievementPopup
        achievement={showAchievement}
        isHiding={isHidingAchievement}
        onEnlightenmentClick={handleEnlightenmentClick}
      />

      {/* Rapid-click particles */}
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

      <EnlightenedAtmosphere active={enlightenmentUnlocked} />
    </>
  )
}
