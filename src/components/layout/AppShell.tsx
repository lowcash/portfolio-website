'use client'

import { useEffect, useRef, useState } from 'react'

import { siteContent } from '@/lib/content'
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
      const windowHeight = window.innerHeight
      const viewportMiddle = windowHeight / 2

      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      sectionIds.forEach((id, index) => {
        const element = document.getElementById(id)
        if (!element) return

        const rect = element.getBoundingClientRect()
        const sectionMiddle = rect.top + rect.height / 2
        const distance = Math.abs(sectionMiddle - viewportMiddle)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setCurrentSection(closestIndex)
    }

    return subscribeToScrollMetrics(() => {
      if (isMobileMenuOpen || isRestoringScroll || isUserNavigatingRef.current) {
        return
      }

      updateCurrentSection()
    })
  }, [sectionIds, isMobileMenuOpen, isRestoringScroll])

  const setSectionHash = (index: number) => {
    const sectionId = sectionIds[index]
    const nextUrl =
      index === 0
        ? `${window.location.pathname}${window.location.search}`
        : `${window.location.pathname}${window.location.search}#${sectionId}`

    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (currentUrl !== nextUrl) {
      window.history.replaceState(null, '', nextUrl)
    }
  }

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

    const sectionId = sectionIds[index]
    const element = document.getElementById(sectionId)
    if (!element) return

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition,
        behavior,
      })
      if (updateHash) {
        setSectionHash(index)
      }
      return
    }

    element.scrollIntoView({ behavior, block: 'start' })

    if (updateHash) {
      setSectionHash(index)
    }
  }

  useEffect(() => {
    const restoreHashSection = () => {
      const hashId = window.location.hash.replace('#', '')

      if (!hashId) {
        hasInitializedHash.current = true
        return
      }

      const sectionIndex = sectionIds.indexOf(hashId)
      if (sectionIndex === -1) {
        hasInitializedHash.current = true
        return
      }

      setIsRestoringScroll(true)
      scrollToSection(sectionIndex, 'auto', false)
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

    setSectionHash(currentSection)
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
