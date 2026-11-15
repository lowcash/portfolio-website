'use client'

import { useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'

import { CONSOLE_ID, closeConsolePane, openConsole, supportsPopover } from './console-actions'

// The controls are code-split and mounted when the browser is idle; the pane itself is plain server-rendered markup
const ConsoleControls = dynamic(() => import('./console-controls').then((module) => module.ConsoleControls), {
  ssr: false,
})

export function ConsolePane({ controlsReady }: { controlsReady: boolean }) {
  const paneRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return

    const handleToggle = (event: Event) => {
      const open = (event as ToggleEvent).newState
        ? (event as ToggleEvent).newState === 'open'
        : pane.hasAttribute('data-open')

      setIsOpen(open)
      if (open) openConsole()
    }

    pane.addEventListener('toggle', handleToggle)
    return () => pane.removeEventListener('toggle', handleToggle)
  }, [])

  return (
    <section
      ref={paneRef}
      id={CONSOLE_ID}
      className='console chrome mono'
      popover='manual'
      aria-label='Developer console'
      tabIndex={-1}
    >
      <header>
        <h2>[dev]</h2>
        <p>orbs · achievements · readout</p>
        <button
          className='x'
          type='button'
          popoverTarget={CONSOLE_ID}
          popoverTargetAction='hide'
          aria-label='Close developer console'
          onClick={(event) => {
            // Without popover support the declarative button does nothing, so close by hand
            if (!supportsPopover(event.currentTarget.closest('section') as HTMLElement)) closeConsolePane()
          }}
        >
          &#x2715;&#xFE0E;
        </button>
      </header>
      <div className='panes'>
        <p className='no-js-only'>The controls need JavaScript. Everything else on the page works without it.</p>
        {controlsReady ? <ConsoleControls isOpen={isOpen} /> : null}
      </div>
    </section>
  )
}
