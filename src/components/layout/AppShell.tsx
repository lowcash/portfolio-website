'use client'

import { useEffect, useRef, useState } from 'react'

import { siteContent } from '@/lib/content'
import {
  resolveActiveSectionIndex,
  resolveHashSectionIndex,
  scrollToSectionByIndex,
  setSectionHashByIndex,
} from '@/lib/navigation-core-adapter'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

import { DeveloperConsole } from '@/components/features/DeveloperConsole'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { EasterEggs } from '@/components/ui/easter-eggs'
import { ScrollNavigation } from '@/components/ui/scroll-navigation'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

type AppShellProps = {
  sectionIds: string[]
}

export function AppShell({ sectionIds }: AppShellProps) {
  const sectionMeta = siteContent.navigation.sections
  const [currentSection, setCurrentSection] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [, setIsDevConsoleOpen] = useState(false)
  const [isRestoringScroll, setIsRestoringScroll] = useState(false)
  const hasInitializedHash = useRef(false)
  const hashRestoreTimeoutRef = useRef<number | null>(null)
  const isUserNavigatingRef = useRef(false)
  const userNavTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const updateCurrentSection = () => {
      setCurrentSection(resolveActiveSectionIndex(sectionIds))
    }

    return subscribeToScrollMetrics(() => {
      if (isRestoringScroll || isUserNavigatingRef.current) {
        return
      }

      updateCurrentSection()
    })
  }, [sectionIds, isRestoringScroll])

  const scrollToSection = (index: number, behavior: ScrollBehavior = 'smooth', updateHash = true) => {
    if (behavior === 'smooth') {
      setCurrentSection(index)
      isUserNavigatingRef.current = true
      if (userNavTimeoutRef.current !== null) {
        window.clearTimeout(userNavTimeoutRef.current)
      }
      userNavTimeoutRef.current = window.setTimeout(() => {
        isUserNavigatingRef.current = false
      }, 1100)
    }

    // Section 0 (hero) is always at y=0. Force instant behavior: a smooth scroll
    // across the entire page takes 3-4s and can be aborted if scroll metrics
    // fire mid-animation and replaceState updates the URL hash to a non-hero
    // section, which Chromium interprets as a scroll target.
    if (index === 0) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (updateHash) setSectionHashByIndex(sectionIds, 0)
      return
    }

    const didScroll = scrollToSectionByIndex(sectionIds, index, {
      behavior,
      updateHash,
    })

    if (!didScroll && behavior === 'smooth') {
      isUserNavigatingRef.current = false
      return
    }
  }

  useEffect(() => {
    const restoreHashSection = () => {
      const sectionIndex = resolveHashSectionIndex(sectionIds)
      if (sectionIndex === null) {
        hasInitializedHash.current = true
        return
      }

      setIsRestoringScroll(true)
      scrollToSectionByIndex(sectionIds, sectionIndex, { behavior: 'auto', updateHash: false })
      setCurrentSection(sectionIndex)

      if (hashRestoreTimeoutRef.current !== null) {
        window.clearTimeout(hashRestoreTimeoutRef.current)
      }

      hashRestoreTimeoutRef.current = window.setTimeout(() => {
        setIsRestoringScroll(false)
      }, 180)

      hasInitializedHash.current = true
    }

    const frameId = window.requestAnimationFrame(restoreHashSection)
    window.addEventListener('hashchange', restoreHashSection)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('hashchange', restoreHashSection)
      if (hashRestoreTimeoutRef.current !== null) {
        window.clearTimeout(hashRestoreTimeoutRef.current)
      }
      if (userNavTimeoutRef.current !== null) {
        window.clearTimeout(userNavTimeoutRef.current)
      }
    }
  }, [sectionIds])

  useEffect(() => {
    if (!hasInitializedHash.current || isRestoringScroll) {
      return
    }

    setSectionHashByIndex(sectionIds, currentSection)
  }, [currentSection, isRestoringScroll, sectionIds])

  return (
    <>
      <EasterEggs />
      <AnimatedBackground />

      <ScrollToTop currentSection={currentSection} onGoToFirst={() => scrollToSection(0)} />

      <ScrollNavigation
        currentSection={currentSection}
        totalSections={sectionMeta.length}
        sectionNames={sectionMeta.map((section) => section.name)}
        onSectionClick={scrollToSection}
        onMenuStateChange={setIsMobileMenuOpen}
        onScrollRestore={setIsRestoringScroll}
      />

      <DeveloperConsole onVisibilityChange={setIsDevConsoleOpen} isMobileMenuOpen={isMobileMenuOpen} />
      <ScrollProgress />
    </>
  )
}
