'use client'

import { useEffect, useState } from 'react'

import { resolveActiveSectionIndex } from '@/lib/scroll-spy'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

type UseActiveSectionOptions = {
  isRestoringScroll?: boolean
  isPaused?: () => boolean
}

/**
 * Tracks the active section index from scroll position.
 * Pauses updates while hash restore or programmatic navigation is in progress.
 */
export function useActiveSection(sectionIds: readonly string[], options: UseActiveSectionOptions = {}) {
  const { isRestoringScroll = false, isPaused } = options
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const updateActiveSection = () => {
      if (isRestoringScroll || isPaused?.()) {
        return
      }

      setActiveIndex(resolveActiveSectionIndex(sectionIds))
    }

    updateActiveSection()
    return subscribeToScrollMetrics(updateActiveSection)
  }, [sectionIds, isRestoringScroll, isPaused])

  return [activeIndex, setActiveIndex] as const
}
