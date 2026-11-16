import { useEffect, useRef } from 'react'

import { SECTION_IDS } from '@/lib/content'

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
      const heading = (e.target as HTMLElement).closest('h1')

      // Check if clicked on hero heading (contains "Lukáš Machala")
      if (heading?.textContent?.includes('Lukáš Machala')) {
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

    // A triple click would paint a selection block over the name; drag selection still works
    const preventTripleSelection = (e: MouseEvent) => {
      if (e.detail > 2 && (e.target as HTMLElement).closest('h1')) {
        e.preventDefault()
      }
    }

    document.addEventListener('click', handleLogoClick)
    document.addEventListener('mousedown', preventTripleSelection)
    return () => {
      document.removeEventListener('click', handleLogoClick)
      document.removeEventListener('mousedown', preventTripleSelection)
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

/** 13-14. Navigation controls (3 uses) and the way back to the intro from further down the page */
export function useNavigationInteractions(enabled: boolean, unlockAchievementRef: UnlockRef) {
  const navUsesRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      return
    }

    // AppShell announces every user-initiated section jump (tabs, menu, wordmark, keys 0-3)
    const handleNavigate = (event: Event) => {
      const { sectionId, fromY } = (event as CustomEvent<{ sectionId: string; fromY: number }>).detail

      navUsesRef.current += 1
      if (navUsesRef.current >= 3) {
        unlockAchievementRef.current('nav-master')
      }

      if (sectionId === SECTION_IDS[0] && fromY > window.innerHeight) {
        unlockAchievementRef.current('round-trip')
      }
    }

    window.addEventListener('section-navigate', handleNavigate)

    return () => {
      window.removeEventListener('section-navigate', handleNavigate)
    }
  }, [enabled, unlockAchievementRef])
}
