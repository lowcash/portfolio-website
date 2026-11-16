'use client'

import { SECTION_LINKS } from '@/lib/navigation/section-links'

import { SectionLink } from './section-link'

interface TopBarProps {
  onSectionClick: (index: number) => void
}

/**
 * Title bar: the wordmark (home, the first section) and the console key hint. It carries no section menu: the
 * status line at the bottom is the one navigation, so there are no two lists of the same four links.
 */
export function TopBar({ onSectionClick }: TopBarProps) {
  return (
    <header className='topbar mono'>
      <div className='wrap'>
        <SectionLink className='wordmark' item={SECTION_LINKS[0]} currentSection={-1} onSectionClick={onSectionClick}>
          lowcash.dev
        </SectionLink>
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
