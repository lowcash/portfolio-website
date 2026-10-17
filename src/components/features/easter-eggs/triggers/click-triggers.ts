import { useEffect, useRef } from 'react'

import type { UnlockRef } from './types'

export type ClickParticle = { id: number; x: number; y: number }

/** 1. Triple-click on the hero heading */
export function useTripleClickLogo(enabled: boolean, unlockAchievementRef: UnlockRef) {
  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, unlockAchievementRef])
}

/** 4. Ten clicks within two seconds */
export function useRapidClicker(
  enabled: boolean,
  unlockAchievementRef: UnlockRef,
  onParticle: (particle: ClickParticle) => void,
) {
  const clickTimesRef = useRef<number[]>([])

  useEffect(() => {
    if (!enabled) {
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
        onParticle({ id: Date.now(), x: e.clientX, y: e.clientY })

        clickTimesRef.current = []
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [enabled, unlockAchievementRef, onParticle])
}

/** 5. Copy text */
export function useCopyCat(enabled: boolean, unlockAchievementRef: UnlockRef) {
  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, unlockAchievementRef])
}

/** 12-13. Scroll-to-top shortcut and navigation controls */
export function useNavigationInteractions(enabled: boolean, unlockAchievementRef: UnlockRef) {
  const navClicksRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, unlockAchievementRef])
}
