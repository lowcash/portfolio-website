'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { siteContent } from '@/lib/content'
import { useActiveSection } from '@/hooks/use-active-section'
import {
  resolveHashSectionIndex,
  resolveActiveSectionIndex,
  scrollToSectionByIndex,
  setSectionHashByIndex,
} from '@/lib/navigation-core-adapter'

import { DeveloperConsole } from '@/components/features/devtools/DeveloperConsole'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [, setIsDevConsoleOpen] = useState(false)
  const [isRestoringScroll, setIsRestoringScroll] = useState(false)
  const hasInitializedHash = useRef(false)
  const hashRestoreTimeoutRef = useRef<number | null>(null)
  const isUserNavigatingRef = useRef(false)
  const navigationMonitorFrameRef = useRef<number | null>(null)
  const navigationMonitorTimeoutRef = useRef<number | null>(null)

  const isScrollSpyPaused = useCallback(
    () => isUserNavigatingRef.current || isMobileMenuOpen,
    [isMobileMenuOpen],
  )
  const [currentSection, setCurrentSection] = useActiveSection(sectionIds, {
    isRestoringScroll,
    isPaused: isScrollSpyPaused,
  })

  const clearNavigationMonitor = () => {
    if (navigationMonitorFrameRef.current !== null) {
      window.cancelAnimationFrame(navigationMonitorFrameRef.current)
      navigationMonitorFrameRef.current = null
    }

    if (navigationMonitorTimeoutRef.current !== null) {
      window.clearTimeout(navigationMonitorTimeoutRef.current)
      navigationMonitorTimeoutRef.current = null
    }
  }

  const releaseNavigationLock = (nextSectionIndex?: number) => {
    clearNavigationMonitor()
    isUserNavigatingRef.current = false
    setCurrentSection(typeof nextSectionIndex === 'number' ? nextSectionIndex : resolveActiveSectionIndex(sectionIds))
  }

  const monitorNavigationTarget = (index: number) => {
    const targetElement = document.getElementById(sectionIds[index])

    if (!targetElement) {
      releaseNavigationLock()
      return
    }

    const startedAt = performance.now()

    const checkTarget = () => {
      const distanceToTarget = Math.abs(targetElement.getBoundingClientRect().top)

      if (distanceToTarget <= 4) {
        releaseNavigationLock(index)
        return
      }

      if (performance.now() - startedAt >= 5000) {
        releaseNavigationLock()
        return
      }

      navigationMonitorFrameRef.current = window.requestAnimationFrame(checkTarget)
    }

    clearNavigationMonitor()
    navigationMonitorFrameRef.current = window.requestAnimationFrame(checkTarget)
    navigationMonitorTimeoutRef.current = window.setTimeout(() => {
      releaseNavigationLock()
    }, 5200)
  }

  const scrollToSection = (index: number, behavior: ScrollBehavior = 'smooth', updateHash = true) => {
    if (behavior === 'smooth') {
      setCurrentSection(index)
      isUserNavigatingRef.current = true
    }

    const didScroll = scrollToSectionByIndex(sectionIds, index, {
      behavior,
      updateHash,
    })

    if (!didScroll && behavior === 'smooth') {
      releaseNavigationLock()
      return
    }

    if (didScroll && behavior === 'smooth') {
      monitorNavigationTarget(index)
      return
    }
  }

  useEffect(() => {
    const restoreHashSection = () => {
      clearNavigationMonitor()
      isUserNavigatingRef.current = false

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
      clearNavigationMonitor()
    }
  }, [sectionIds, setCurrentSection])

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
