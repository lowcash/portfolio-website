import { useEffect, useRef, useState } from 'react'

import { setOrbSetting } from '@/lib/orbs/settings'

import type { UnlockRef } from './types'

/** 3. Idle for a minute after the first interaction; also swaps the cursor to a sleeping emoji */
export function useIdleAchievement(enabled: boolean, unlockAchievementRef: UnlockRef) {
  const [isIdle, setIsIdle] = useState(false)
  const userHasInteractedRef = useRef(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const markUserInteraction = () => {
      if (!userHasInteractedRef.current) {
        userHasInteractedRef.current = true
        console.log('%c👋 User interaction detected, idle timer started', 'color: #6b7280; font-size: 10px;')
      }
    }

    const resetIdleTimer = () => {
      setIsIdle(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      // Only start timer if user has interacted
      if (userHasInteractedRef.current) {
        idleTimerRef.current = setTimeout(() => {
          setIsIdle(true)
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
  }, [enabled, unlockAchievementRef])

  useEffect(() => {
    if (isIdle) {
      document.body.style.cursor =
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ctext x='0' y='24' font-size='24'%3E💤%3C/text%3E%3C/svg%3E\"), auto"
    } else {
      document.body.style.cursor = ''
    }

    return () => {
      document.body.style.cursor = ''
    }
  }, [isIdle])
}

/** 6. Shake: rapid scroll on touch devices, rapid mouse movement on desktop. Also shuffles the orb colors. */
export function useShake(enabled: boolean, unlockAchievementRef: UnlockRef) {
  useEffect(() => {
    if (!enabled) {
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
          unlockAchievementRef.current('shake')
          scrollEvents = []

          setOrbSetting('hue', Math.round(Math.random() * 72) * 5)

          console.log('%c📜 Rapid scroll detected! Colors shuffled!', 'color: #ec4899; font-size: 14px;')
        }
      }
    }

    // DESKTOP: a shake is the pointer swinging side to side. Real mice report small steps (a fast shake is ~10-30 px
    // per event), so count direction reversals of the x movement after a swing of at least 60 px, within one second.
    let lastX: number | null = null
    let swingStartX = 0
    let direction = 0
    let reversals: number[] = []

    const handleMouseMove = (e: MouseEvent) => {
      if (mobileMode) return

      const now = Date.now()
      const previousX = lastX
      lastX = e.clientX

      if (previousX === null || e.clientX === previousX) return

      const deltaX = e.clientX - previousX

      const nextDirection = Math.sign(deltaX)

      if (direction === 0) {
        direction = nextDirection
        swingStartX = previousX
      } else if (nextDirection !== direction) {
        // Turning point: was the swing that just ended wide enough to count?
        if (Math.abs(previousX - swingStartX) >= 60) {
          reversals.push(now)
        }

        reversals = reversals.filter((time) => now - time < 1000)

        direction = nextDirection
        swingStartX = previousX

        if (reversals.length >= 5) {
          unlockAchievementRef.current('shake')
          reversals = []

          setOrbSetting('hue', Math.round(Math.random() * 72) * 5)

          console.log('%c🖱️ Rapid mouse movement detected! Colors shuffled!', 'color: #ec4899; font-size: 14px;')
        }
      }
    }

    if (mobileMode) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    } else {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (mobileMode) {
        window.removeEventListener('scroll', handleScroll)
      } else {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [enabled, unlockAchievementRef])
}

/** 9. Visit the site three or more times */
export function useRepeatVisitor(enabled: boolean, unlockAchievementRef: UnlockRef) {
  useEffect(() => {
    if (!enabled) {
      return
    }
    const visitCount = localStorage.getItem('visit_count')
    const count = visitCount ? parseInt(visitCount, 10) : 0

    // This visit counts too: the third visit is the one that unlocks
    if (count + 1 >= 3) {
      unlockAchievementRef.current('repeat-visitor')

      console.log(
        '%c🔄 REPEAT VISITOR! You visited the site 3+ times!',
        'color: #6b7280; font-size: 16px; font-weight: bold;',
      )
    }

    // Increment visit count
    localStorage.setItem('visit_count', String(count + 1))
  }, [enabled, unlockAchievementRef])
}

/** 14. Change the orb settings five times (a drag counts once, see orb-settings) */
export function useSettingsTinkerer(enabled: boolean, unlockAchievementRef: UnlockRef) {
  const orbSettingsChangesRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, unlockAchievementRef])
}
