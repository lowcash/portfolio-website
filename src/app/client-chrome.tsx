'use client'

import { useEffect, useState } from 'react'

import { siteContent } from '@/lib/content'

import { DeveloperConsole } from '@/components/features/DeveloperConsole'
import { AnimatedBackground } from '@/components/shared/AnimatedBackground'
import { EasterEggs } from '@/components/ui/easter-eggs'
import { ScrollNavigation } from '@/components/ui/scroll-navigation'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { ScrollToTop } from '@/components/ui/scroll-to-top'

type ClientChromeProps = {
  sectionIds: string[]
}

export function ClientChrome({ sectionIds }: ClientChromeProps) {
  const sectionMeta = siteContent.navigation.sections
  const [currentSection, setCurrentSection] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [, setIsDevConsoleOpen] = useState(false)
  const [isRestoringScroll, setIsRestoringScroll] = useState(false)

  useEffect(() => {
    let frameId: number | null = null

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

    const handleScroll = () => {
      if (isMobileMenuOpen || isRestoringScroll || frameId !== null) {
        return
      }

      frameId = requestAnimationFrame(() => {
        updateCurrentSection()
        frameId = null
      })
    }

    updateCurrentSection()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [sectionIds, isMobileMenuOpen, isRestoringScroll])

  const scrollToSection = (index: number) => {
    const sectionId = sectionIds[index]
    const element = document.getElementById(sectionId)
    if (!element) return

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      })
      return
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

      <DeveloperConsole onVisibilityChange={setIsDevConsoleOpen} />
      <ScrollProgress />
    </>
  )
}
