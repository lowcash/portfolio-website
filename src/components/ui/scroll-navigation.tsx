import { useEffect, useRef, useState } from 'react'

import { Menu, X } from 'lucide-react'

import { DrawerNavItem } from './drawer-nav-item'
import { FloatingRail } from './floating-rail'
import { MobileDrawerBackdrop } from './mobile-drawer-backdrop'
import { NavDot } from './nav-dot'

interface ScrollNavigationProps {
  currentSection: number
  totalSections: number
  sectionNames: string[]
  onSectionClick: (index: number) => void
  onMenuStateChange?: (isOpen: boolean) => void
  onScrollRestore?: (isRestoring: boolean) => void
}

export function ScrollNavigation({
  currentSection,
  totalSections,
  sectionNames,
  onSectionClick,
  onMenuStateChange,
  onScrollRestore,
}: ScrollNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dragStartY, setDragStartY] = useState<number | null>(null)
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)
  const pendingNavigationIndexRef = useRef<number | null>(null)
  const onSectionClickRef = useRef(onSectionClick)
  const htmlStyleRestoreRef = useRef({
    scrollBehavior: '',
    scrollSnapType: '',
  })

  useEffect(() => {
    onSectionClickRef.current = onSectionClick
  }, [onSectionClick])

  const setMobileMenuOpenState = (nextOpen: boolean) => {
    onMenuStateChange?.(nextOpen)
    setMobileMenuOpen(nextOpen)
  }

  const sections = Array.from({ length: totalSections }, (_, i) => ({
    id: i,
    label: sectionNames[i],
  }))

  const unlockBodyScroll = () => {
    const html = document.documentElement
    const body = document.body
    const scrollY = scrollPositionRef.current

    body.style.position = ''
    body.style.top = ''
    body.style.width = ''

    window.scrollTo({
      top: scrollY,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    })

    html.style.scrollBehavior = htmlStyleRestoreRef.current.scrollBehavior
    html.style.scrollSnapType = htmlStyleRestoreRef.current.scrollSnapType
  }

  const handleMobileClick = (index: number) => {
    pendingNavigationIndexRef.current = index
    setMobileMenuOpenState(false)
    setDragStartY(null)
    setDragCurrentY(null)
  }

  // Swipe to close functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY === null) return

    const currentY = e.touches[0].clientY
    const diff = currentY - dragStartY

    if (diff > 0) {
      setDragCurrentY(currentY)
    }
  }

  const handleTouchEnd = () => {
    if (dragStartY === null || dragCurrentY === null) {
      setDragStartY(null)
      setDragCurrentY(null)
      return
    }

    const diff = dragCurrentY - dragStartY

    if (diff > 100) {
      pendingNavigationIndexRef.current = null
      setMobileMenuOpenState(false)
    }

    setDragStartY(null)
    setDragCurrentY(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartY(e.clientY)
  }

  useEffect(() => {
    if (dragStartY === null) return

    const handleMouseMove = (e: MouseEvent) => {
      if (dragStartY === null) return

      const currentY = e.clientY
      const diff = currentY - dragStartY

      if (diff > 0) {
        setDragCurrentY(currentY)
      }
    }

    const handleMouseUp = () => {
      const diff = dragCurrentY !== null && dragStartY !== null ? dragCurrentY - dragStartY : 0

      if (diff > 100) {
        pendingNavigationIndexRef.current = null
        setMobileMenuOpenState(false)
      }

      setDragStartY(null)
      setDragCurrentY(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragStartY, dragCurrentY])

  const getDragOffset = () => {
    if (dragStartY === null || dragCurrentY === null) return 0
    const diff = dragCurrentY - dragStartY
    return diff > 0 ? diff : 0
  }

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    if (!mobileMenuOpen) {
      return
    }

    htmlStyleRestoreRef.current = {
      scrollBehavior: html.style.scrollBehavior,
      scrollSnapType: html.style.scrollSnapType,
    }

    scrollPositionRef.current = window.scrollY

    html.style.scrollBehavior = 'auto'
    html.style.scrollSnapType = 'none'

    body.style.position = 'fixed'
    body.style.top = `-${scrollPositionRef.current}px`
    body.style.width = '100%'

    return () => {
      onScrollRestore?.(true)
      unlockBodyScroll()

      requestAnimationFrame(() => {
        onScrollRestore?.(false)

        const pendingIndex = pendingNavigationIndexRef.current
        if (pendingIndex !== null) {
          pendingNavigationIndexRef.current = null
          onSectionClickRef.current(pendingIndex)
        }
      })
    }
  }, [mobileMenuOpen, onScrollRestore])

  return (
    <>
      <FloatingRail variant='center-right' desktopOnly childOffsetRightPx={22}>
        <nav aria-label='Page navigation' role='navigation'>
          <div className='flex flex-col gap-4'>
            {sections.map((section) => (
              <NavDot
                key={section.id}
                isActive={currentSection === section.id}
                label={section.label}
                onClick={() => onSectionClick(section.id)}
              />
            ))}
          </div>
        </nav>
      </FloatingRail>

      <div className='pointer-events-none fixed top-0 right-0 left-0 lg:hidden' style={{ zIndex: 60 }}>
        <div className='relative mx-auto h-0 max-w-6xl px-4 sm:px-6'>
          <button
            onClick={() => {
              pendingNavigationIndexRef.current = null
              setMobileMenuOpenState(!mobileMenuOpen)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                pendingNavigationIndexRef.current = null
                setMobileMenuOpenState(!mobileMenuOpen)
              }
            }}
            className='pointer-events-auto absolute top-7 transition-all duration-300 hover:scale-105'
            style={{ right: '1rem' }}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls='mobile-navigation-menu'
          >
            <div className='group relative'>
              <div
                className='animate-glow-shimmer scroll-to-top-glow pointer-events-none absolute inset-0 -z-10 rounded-xl'
                aria-hidden='true'
              />
              <div className='scroll-to-top-inner rounded-xl bg-black/40 p-3 backdrop-blur-sm transition-all duration-500'>
                {mobileMenuOpen ? (
                  <X className='scroll-to-top-icon h-6 w-6' aria-hidden='true' />
                ) : (
                  <Menu className='scroll-to-top-icon h-6 w-6' aria-hidden='true' />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      <MobileDrawerBackdrop
        isOpen={mobileMenuOpen}
        onClose={() => {
          pendingNavigationIndexRef.current = null
          setMobileMenuOpenState(false)
        }}
      >
        <nav
          id='mobile-navigation-menu'
          ref={drawerRef}
          className={`absolute right-0 bottom-0 left-0 touch-pan-y rounded-t-3xl bg-black/95 backdrop-blur-xl transition-all duration-300 ${
            mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          aria-label='Mobile navigation'
          role='navigation'
          style={{
            boxShadow: '0 -10px 60px rgba(139, 92, 246, 0.3)',
            transform: mobileMenuOpen ? `translateY(${getDragOffset()}px)` : 'translateY(100%)',
            transition: dragStartY !== null ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
            visibility: mobileMenuOpen ? 'visible' : 'hidden',
          }}
        >
          <div
            className='flex justify-center pt-4 pb-2'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className='h-1 w-12 rounded-full bg-gray-600' />
          </div>

          <div className='px-6 pt-4 pb-8'>
            <div className='space-y-2'>
              {sections.map((section) => (
                <DrawerNavItem
                  key={section.id}
                  isActive={currentSection === section.id}
                  label={section.label}
                  onClick={() => handleMobileClick(section.id)}
                />
              ))}
            </div>
          </div>
        </nav>
      </MobileDrawerBackdrop>
    </>
  )
}
