'use client'

import { useEffect, useRef } from 'react'

import { PORTFOLIO_SECTIONS } from '@/lib/content'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

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
          {PORTFOLIO_SECTIONS.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={index === currentSection ? 'location' : undefined}
                aria-keyshortcuts={String(index)}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
                    return
                  }
                  event.preventDefault()
                  onSectionClick(index)
                }}
              >
                <span className='n' aria-hidden='true'>
                  {index}:
                </span>
                {section.name}
              </a>
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
