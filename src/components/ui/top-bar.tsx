'use client'

import { PORTFOLIO_SECTIONS } from '@/lib/content'

interface TopBarProps {
  currentSection: number
  onSectionClick: (index: number) => void
}

/**
 * Title bar with the conventional text menu (Intro, Projects, Experience, Contact), so navigation is recognisable at
 * first glance. Plain anchors: they work without JavaScript, and with it they run the smooth, locked scroll.
 */
export function TopBar({ currentSection, onSectionClick }: TopBarProps) {
  const go = (index: number) => (event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return
    }
    event.preventDefault()
    onSectionClick(index)
  }

  return (
    <header className='topbar mono'>
      <div className='wrap'>
        <a href={`#${PORTFOLIO_SECTIONS[0].id}`} onClick={go(0)}>
          lowcash.dev
        </a>
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
        >
          <kbd>D</kbd> dev console
        </button>
      </div>
    </header>
  )
}
