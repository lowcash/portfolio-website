'use client'

import { useEffect, useState } from 'react'

import { PORTFOLIO_SECTIONS } from '@/lib/content'

interface TopBarProps {
  currentSection: number
  onSectionClick: (index: number) => void
}

/**
 * Title bar with the conventional text menu (Intro, Projects, Experience, Contact), so navigation is recognisable at
 * first glance. Plain anchors: they work without JavaScript, and with it they run the smooth, locked scroll.
 * Below 48rem the bar is just the wordmark and a menu button; the menu opens as a full-width list (links plus the
 * developer console) so nothing is crammed into one row. The status line keeps the section tabs there.
 */
export function TopBar({ currentSection, onSectionClick }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const go = (index: number) => (event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return
    }
    event.preventDefault()
    setIsOpen(false)
    onSectionClick(index)
  }

  return (
    <header className='topbar mono'>
      <div className='wrap'>
        <a className='wordmark' href={`#${PORTFOLIO_SECTIONS[0].id}`} onClick={go(0)}>
          lowcash.dev
        </a>
        <button
          className='menu-btn js-only'
          type='button'
          aria-expanded={isOpen}
          aria-controls='top-menu'
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
        <div id='top-menu' className='top-menu' data-open={isOpen ? '' : undefined}>
          <nav aria-label='Main menu'>
            <ul>
              {PORTFOLIO_SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={go(index)}
                    aria-current={index === currentSection ? 'location' : undefined}
                  >
                    {section.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className='keyhint'
            type='button'
            popoverTarget='console'
            popoverTargetAction='toggle'
            aria-keyshortcuts='D'
            title='Open the developer console (shortcut: D)'
            onClick={() => setIsOpen(false)}
          >
            <kbd>D</kbd> dev console
          </button>
        </div>
      </div>
    </header>
  )
}
