import { useEffect, useRef } from 'react'

import type { UnlockRef } from './types'

/** 2. Rest at (about) 50% of the page */
export function usePerfectlyBalanced(enabled: boolean, unlockAchievementRef: UnlockRef) {
  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, unlockAchievementRef])
}

// The page has four sections, so five could never be reached (and Enlightenment with it)
const SECTION_HOPPER_THRESHOLD = 3

/** 10-11, 15. Section hopper, world tour, back to origin */
export function useSectionExploration(enabled: boolean, unlockAchievementRef: UnlockRef) {
  const visitedSectionsRef = useRef(new Set<string>())
  const hasReachedContactRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const sectionIds = ['hero', 'featured-projects', 'experience', 'contact']

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

      if (visitedSectionsRef.current.size >= SECTION_HOPPER_THRESHOLD) {
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
  }, [enabled, unlockAchievementRef])
}

/** 7. Ten thousand pixels scrolled in total */
export function useMarathonRunner(enabled: boolean, unlockAchievementRef: UnlockRef) {
  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, unlockAchievementRef])
}

/** 8. Reach the bottom within two minutes */
export function useSpeedReader(enabled: boolean, unlockAchievementRef: UnlockRef) {
  useEffect(() => {
    if (!enabled) {
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
  }, [enabled, unlockAchievementRef])
}
