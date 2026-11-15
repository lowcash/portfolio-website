'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'

import { PORTFOLIO_SECTIONS, SECTION_SCENES } from '@/lib/content'
import {
  resolveActiveSectionIndex,
  resolveHashSectionIndex,
  scrollToSectionByIndex,
  setSectionHashByIndex,
  useActiveSection,
} from '@/lib/navigation'
import { resolveShortcut } from '@/lib/shortcuts'

import { closeConsolePane, toggleConsolePane } from '@/components/features/devtools/console-actions'
import { ConsolePane } from '@/components/features/devtools/console-pane'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { StatusLine } from '@/components/ui/status-line'
import { TopBar } from '@/components/ui/top-bar'

import { useIdleReady } from '@/hooks/use-idle-ready'

// Non-critical, interaction-only features: split out of the initial bundle and mounted once the browser is idle
const EasterEggs = dynamic(
  () => import('@/components/features/easter-eggs/EasterEggs').then((module) => module.EasterEggs),
  {
    ssr: false,
  },
)

type AppShellProps = {
  sectionIds: string[]
  children: React.ReactNode
}

export function AppShell({ sectionIds, children }: AppShellProps) {
  const areExtrasReady = useIdleReady()
  const [isRestoringScroll, setIsRestoringScroll] = useState(false)
  const hasInitializedHash = useRef(false)
  const hashRestoreTimeoutRef = useRef<number | null>(null)
  const isUserNavigatingRef = useRef(false)
  const navigationMonitorFrameRef = useRef<number | null>(null)
  const navigationMonitorTimeoutRef = useRef<number | null>(null)

  const isScrollSpyPaused = useCallback(() => isUserNavigatingRef.current, [])
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

  // The scene (light composition and chrome hue) follows the active section
  useEffect(() => {
    document.documentElement.dataset.scene = SECTION_SCENES[currentSection]
  }, [currentSection])

  // User-initiated jumps (tabs, menu, wordmark, keys 0-3) are announced for the Nav Master and Round Trip achievements
  const navigateToSection = (index: number) => {
    window.dispatchEvent(
      new CustomEvent('section-navigate', { detail: { sectionId: sectionIds[index], fromY: window.scrollY } }),
    )
    scrollToSection(index)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = resolveShortcut(event, PORTFOLIO_SECTIONS.length)
      if (!action) return

      if (action.type === 'console') {
        event.preventDefault()
        toggleConsolePane(true)
      } else if (action.type === 'escape') {
        closeConsolePane()
      } else {
        event.preventDefault()
        navigateToSection(action.index)
      }
    }

    // Four fingers toggle the console on touch devices
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 4) toggleConsolePane(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  })

  useEffect(() => {
    if (!hasInitializedHash.current || isRestoringScroll) {
      return
    }

    setSectionHashByIndex(sectionIds, currentSection)
  }, [currentSection, isRestoringScroll, sectionIds])

  return (
    <>
      <TopBar currentSection={currentSection} onSectionClick={navigateToSection} />
      {children}

      {areExtrasReady ? <EasterEggs /> : null}
      <AnimatedBackground />
      <ConsolePane controlsReady={areExtrasReady} />
      <StatusLine currentSection={currentSection} onSectionClick={navigateToSection} />
    </>
  )
}
