'use client'

import { type MutableRefObject, useEffect, useRef, useState } from 'react'

import { ACHIEVEMENTS, type Achievement } from './achievements'
import { fireCasinoConfetti } from './confetti'

const BASE_ACHIEVEMENT_COUNT = ACHIEVEMENTS.filter((a) => a.id !== 'enlightenment').length

function loadAchievements(canUseStorage: boolean): Achievement[] {
  if (!canUseStorage) {
    return ACHIEVEMENTS
  }

  try {
    const saved = localStorage.getItem('achievements')
    if (saved) {
      const parsed = JSON.parse(saved) as Achievement[]
      return ACHIEVEMENTS.map((defaultAch) => {
        const savedAch = parsed.find((a) => a.id === defaultAch.id)
        return savedAch ? { ...defaultAch, ...savedAch } : defaultAch
      })
    }
  } catch (e) {
    console.error('Failed to load achievements:', e)
    localStorage.removeItem('achievements')
  }

  return ACHIEVEMENTS
}

export type AchievementState = {
  achievements: Achievement[]
  achievementsEnabled: boolean
  showAchievement: Achievement | null
  isHidingAchievement: boolean
  unlockAchievementRef: MutableRefObject<(id: string) => void>
}

/**
 * Owns unlock state, localStorage persistence, and achievement popup timers.
 * Side effects never run inside setState updaters (StrictMode-safe).
 */
export function useAchievementState(): AchievementState {
  const canUseStorage = typeof window !== 'undefined'
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements(canUseStorage))
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [isHidingAchievement, setIsHidingAchievement] = useState(false)

  const achievementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const achievementHidingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastShownKeyRef = useRef<string | null>(null)
  const loggedKeyRef = useRef<string | null>(null)
  const achievementsRef = useRef(achievements)

  const [achievementsEnabled, setAchievementsEnabled] = useState(() => {
    if (!canUseStorage) {
      return false
    }
    return localStorage.getItem('dev_console_opened') === 'true'
  })

  const achievementsEnabledRef = useRef(achievementsEnabled)
  useEffect(() => {
    achievementsEnabledRef.current = achievementsEnabled
  }, [achievementsEnabled])

  useEffect(() => {
    achievementsRef.current = achievements
  }, [achievements])

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

  const showUnlockPopup = (unlockedAchievement: Achievement) => {
    const key = `${unlockedAchievement.id}:${unlockedAchievement.unlockedAt ?? 0}`

    // Deduplicate StrictMode / duplicate unlock notifications for the same unlock
    if (lastShownKeyRef.current === key) {
      return
    }
    lastShownKeyRef.current = key

    if (achievementTimeoutRef.current) clearTimeout(achievementTimeoutRef.current)
    if (achievementHidingTimeoutRef.current) clearTimeout(achievementHidingTimeoutRef.current)

    setShowAchievement(unlockedAchievement)
    setIsHidingAchievement(false)

    if (loggedKeyRef.current !== key) {
      loggedKeyRef.current = key
      console.log(`%c🏆 Achievement Unlocked!`, 'color: #fbbf24; font-size: 16px; font-weight: bold;')
      console.log(`%c${unlockedAchievement.icon} ${unlockedAchievement.name}`, 'color: #a855f7; font-size: 14px;')
      console.log(`%c${unlockedAchievement.description}`, 'color: #9ca3af; font-size: 12px;')
    }

    achievementTimeoutRef.current = setTimeout(() => {
      setIsHidingAchievement(true)

      achievementHidingTimeoutRef.current = setTimeout(() => {
        setShowAchievement(null)
        setIsHidingAchievement(false)
      }, 500)
    }, 4000)
  }

  const unlockAchievementRef = useRef<(id: string) => void>(() => {})

  const unlockAchievement = (id: string) => {
    if (!canUseStorage || !achievementsEnabledRef.current) {
      return
    }

    const prev = achievementsRef.current
    const achievement = prev.find((a) => a.id === id)
    if (!achievement || achievement.unlocked) {
      return
    }

    const unlockedAchievement: Achievement = { ...achievement, unlocked: true, unlockedAt: Date.now() }
    const updated = prev.map((a) => (a.id === id ? unlockedAchievement : a))

    // Keep ref in sync before React re-renders so rapid unlocks see fresh state
    achievementsRef.current = updated
    setAchievements(updated)

    // Popup / timers / logs outside the setState updater
    showUnlockPopup(unlockedAchievement)
  }

  useEffect(() => {
    unlockAchievementRef.current = unlockAchievement
  })

  // SHOW ACHIEVEMENT LIST ON PAGE LOAD (only after dev console opened)
  useEffect(() => {
    if (!achievementsEnabled) {
      return
    }

    console.log(
      '%c🏆 ACHIEVEMENT SYSTEM',
      'color: #fbbf24; font-size: 18px; font-weight: bold; text-decoration: underline;',
    )
    console.log(
      `%c${ACHIEVEMENTS.length} achievements available! Press D to open Dev Console and track your progress.`,
      'color: #a855f7; font-size: 12px;',
    )
    console.log('')

    ACHIEVEMENTS.forEach((achievement) => {
      const unlocked = achievements.find((a) => a.id === achievement.id)?.unlocked
      console.log(
        `%c${unlocked ? '✅' : '🔒'} ${achievement.icon} ${achievement.name}`,
        `color: ${unlocked ? '#10b981' : '#6b7280'}; font-size: 11px; ${unlocked ? 'font-weight: bold;' : ''}`,
      )
      console.log(`   %c${achievement.description}`, `color: #9ca3af; font-size: 10px; font-style: italic;`)
    })

    console.log('')
    console.log(
      '%c💡 Hint: Explore the page to discover how to unlock each achievement!',
      'color: #6b7280; font-size: 10px; font-style: italic;',
    )
  }, [achievements, achievementsEnabled])

  // Save achievements to localStorage + enlightenment auto-unlock
  useEffect(() => {
    if (!canUseStorage) {
      return
    }
    localStorage.setItem('achievements', JSON.stringify(achievements))

    const baseAchievements = achievements.filter((a) => a.id !== 'enlightenment')
    const enlightenmentAch = achievements.find((a) => a.id === 'enlightenment')
    const allBaseUnlocked =
      baseAchievements.length === BASE_ACHIEVEMENT_COUNT && baseAchievements.every((a) => a.unlocked)

    let enlightenmentTimer: ReturnType<typeof setTimeout> | undefined

    if (allBaseUnlocked && enlightenmentAch && !enlightenmentAch.unlocked) {
      enlightenmentTimer = setTimeout(() => {
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

    window.dispatchEvent(
      new CustomEvent('achievements-updated', {
        detail: { achievements },
      }),
    )

    return () => {
      if (enlightenmentTimer) clearTimeout(enlightenmentTimer)
    }
  }, [achievements, canUseStorage])

  useEffect(() => {
    const handleReset = () => {
      const reset = ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined }))
      achievementsRef.current = reset
      setAchievements(reset)
      lastShownKeyRef.current = null
      localStorage.setItem('achievements', JSON.stringify(ACHIEVEMENTS))
    }

    window.addEventListener('achievements-reset', handleReset)
    return () => {
      window.removeEventListener('achievements-reset', handleReset)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (achievementTimeoutRef.current) clearTimeout(achievementTimeoutRef.current)
      if (achievementHidingTimeoutRef.current) clearTimeout(achievementHidingTimeoutRef.current)
    }
  }, [])

  return {
    achievements,
    achievementsEnabled,
    showAchievement,
    isHidingAchievement,
    unlockAchievementRef,
  }
}
