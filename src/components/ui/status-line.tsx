'use client'

import { useEffect, useRef } from 'react'

import { SECTION_LINKS } from '@/lib/navigation/section-links'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

import { SectionLink } from './section-link'
import { StatusAchievements } from './status-achievements'

interface StatusLineProps {
  currentSection: number
  onSectionClick: (index: number) => void
}

/**
 * tmux-style status line: console button, section tabs, achievement counter and scroll percentage. It replaces nav
 * dots, burger, progress bar, scroll-to-top and the console trigger. Without JavaScript it is a row of anchors and a working popover button.
 */
export function StatusLine({ currentSection, onSectionClick }: StatusLineProps) {
  const percentRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let lastPercent = -1

    return subscribeToScrollMetrics((metrics) => {
      const percent = Math.round(metrics.progress * 100)
      if (percent !== lastPercent && percentRef.current) {
        lastPercent = percent
        percentRef.current.textContent = `${percent}%`
      }
    })
  }, [])

  return (
    <div className='status chrome mono' id='status'>
      <button
        className='st-session'
        type='button'
        popoverTarget='console'
        popoverTargetAction='toggle'
        aria-keyshortcuts='D'
        aria-label='Toggle developer console'
        title='Developer console (shortcut: D)'
      >
        &gt;_<span>dev</span>
        <kbd className='st-key' aria-hidden='true'>
          D
        </kbd>
      </button>
      <nav className='st-tabs' aria-label='Sections'>
        <ol>
          {SECTION_LINKS.map((item) => (
            <li key={item.id}>
              <SectionLink item={item} currentSection={currentSection} onSectionClick={onSectionClick}>
                <span className='n' aria-hidden='true'>
                  {item.index}:
                </span>
                {item.label}
              </SectionLink>
            </li>
          ))}
        </ol>
      </nav>
      <p className='st-right js-only'>
        <StatusAchievements />
        <span ref={percentRef}>0%</span>
      </p>
    </div>
  )
}
