import { Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { NavDot } from './nav-dot'
import { DrawerNavItem } from './drawer-nav-item'
import { FloatingRail } from './floating-rail'
import { MobileDrawerBackdrop } from './mobile-drawer-backdrop'

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
  const isNavigatingRef = useRef(false)

  const sections = Array.from({ length: totalSections }, (_, i) => ({
    id: i,
    label: sectionNames[i],
  }))

  const handleMobileClick = (index: number) => {
    // Signal that we are navigating to a new section
    isNavigatingRef.current = true

    // Close the menu
    setMobileMenuOpen(false)
    setDragStartY(null)
    setDragCurrentY(null)

    // Navigate after a short delay to allow the menu close cleanup to finish
    // but WITHOUT restoring the old scroll position
    setTimeout(() => {
      onSectionClick(index)
      // Reset navigation flag after navigation is initiated
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 100)
    }, 50)
  }

  // Swipe to close functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY === null) return

    const currentY = e.touches[0].clientY
    const diff = currentY - dragStartY

    // Only allow dragging down
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

    // Close if dragged down more than 100px
    if (diff > 100) {
      setMobileMenuOpen(false)
    }

    setDragStartY(null)
    setDragCurrentY(null)
  }

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartY(e.clientY)
  }

  // Handle mouse move and up on document level
  useEffect(() => {
    if (dragStartY === null) return

    const handleMouseMove = (e: MouseEvent) => {
      if (dragStartY === null) return

      const currentY = e.clientY
      const diff = currentY - dragStartY

      // Only allow dragging down
      if (diff > 0) {
        setDragCurrentY(currentY)
      }
    }

    const handleMouseUp = () => {
      // Calculate total drag distance
      const diff = dragCurrentY !== null && dragStartY !== null ? dragCurrentY - dragStartY : 0

      // Only close if dragged significantly (> 100px)
      if (diff > 100) {
        setMobileMenuOpen(false)
      }

      // Reset all drag state
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

  // Calculate drag offset for visual feedback
  const getDragOffset = () => {
    if (dragStartY === null || dragCurrentY === null) return 0
    const diff = dragCurrentY - dragStartY
    return diff > 0 ? diff : 0
  }

  // Prevent body scroll when menu is open - PROPER SOLUTION
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    if (mobileMenuOpen) {
      // Save current scroll position IMMEDIATELY
      const currentScrollY = window.scrollY
      scrollPositionRef.current = currentScrollY

      // CRITICAL: Disable scroll snap AND smooth scrolling FIRST
      html.classList.add('no-scroll-snap')
      html.style.scrollBehavior = 'auto' // Prevent smooth scroll during restoration

      // Prevent scroll using position fixed on body to avoid any layout shift
      body.style.position = 'fixed'
      body.style.top = `-${currentScrollY}px`
      body.style.width = '100%'

      return () => {
        // START scroll restoration - notify parent to skip handleScroll
        if (onScrollRestore) {
          onScrollRestore(true)
        }

        // Restore scroll position
        const scrollY = scrollPositionRef.current

        // Remove fixed positioning first
        body.style.position = ''
        body.style.top = ''
        body.style.width = ''

        // ALWAYS restore scroll position immediately to prevent jumping to top (0)
        // This ensures we start the navigation from the correct place
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: 'instant' as ScrollBehavior,
        })

        // CRITICAL: Use requestAnimationFrame to ensure DOM has updated before re-enabling features
        requestAnimationFrame(() => {
          // Re-enable scroll snap and smooth scrolling after 1 RAF
          html.classList.remove('no-scroll-snap')
          html.style.scrollBehavior = ''

          // END scroll restoration - notify parent to resume handleScroll
          if (onScrollRestore) {
            onScrollRestore(false)
          }
        })
      }
    } else {
      // Safety cleanup to ensure no styles are stuck if component re-renders or state changes unexpectedly
      body.style.position = ''
      body.style.top = ''
      body.style.width = ''
      html.classList.remove('no-scroll-snap')
      html.style.scrollBehavior = ''
    }
  }, [mobileMenuOpen, onScrollRestore])

  // Notify parent about menu state change
  useEffect(() => {
    if (onMenuStateChange) {
      onMenuStateChange(mobileMenuOpen)
    }
  }, [mobileMenuOpen, onMenuStateChange])

  return (
    <>
      {/* DESKTOP - Right side vertical dots */}
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

      {/* MOBILE - Hamburger button (top-right) with dynamic glow */}
      <div className='mobile-until-lg fixed top-0 left-0 right-0 z-60 pointer-events-none'>
        <div className='relative mx-auto px-6 max-w-6xl h-0'>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setMobileMenuOpen(!mobileMenuOpen)
              }
            }}
            className='pointer-events-auto absolute top-6 transition-all duration-300 hover:scale-105'
            style={{ right: '1rem' }}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls='mobile-navigation-menu'
          >
            <div className='relative group'>
              {/* Shimmer glow layer - same as scroll-to-top */}
              <div
                className='absolute inset-0 pointer-events-none rounded-xl animate-glow-shimmer -z-10 scroll-to-top-glow'
                aria-hidden='true'
              />

              {/* Button - same styling as scroll-to-top */}
              <div className='bg-black/40 backdrop-blur-sm rounded-xl p-3 transition-all duration-500 scroll-to-top-inner'>
                {mobileMenuOpen ? (
                  <X className='w-6 h-6 scroll-to-top-icon' aria-hidden='true' />
                ) : (
                  <Menu className='w-6 h-6 scroll-to-top-icon' aria-hidden='true' />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE - Slide-in menu panel */}
      <MobileDrawerBackdrop isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        {/* Menu panel - slide from bottom with swipe support */}
        <nav
          id='mobile-navigation-menu'
          ref={drawerRef}
          className={`absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl rounded-t-3xl transition-all duration-300 touch-pan-y ${
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
          {/* Handle bar - visual hint for swipe - THIS is the drag area */}
          <div
            className='flex justify-center pt-4 pb-2'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className='w-12 h-1 bg-gray-600 rounded-full' />
          </div>

          {/* Menu items */}
          <div className='px-6 pb-8 pt-4'>
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
