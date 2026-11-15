'use client'

import { useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'

import { CONSOLE_ID, closeConsolePane, openConsole, supportsPopover } from './console-actions'

// The controls are code-split and mounted when the browser is idle; the pane itself is plain server-rendered markup
const ConsoleControls = dynamic(() => import('./console-controls').then((module) => module.ConsoleControls), {
  ssr: false,
})

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Keeps Tab and Shift+Tab inside the dialog. Escape is handled globally (shortcuts.ts) so it also works from the page. */
function trapTab(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab') return

  const pane = event.currentTarget
  const items = Array.from(pane.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.offsetParent !== null)
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement

  if (!first || !last) {
    event.preventDefault()
    pane.focus()
  } else if (event.shiftKey && (active === first || active === pane)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

export function ConsolePane({ controlsReady }: { controlsReady: boolean }) {
  const paneRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return

    const handleToggle = (event: Event) => {
      const open = (event as ToggleEvent).newState
        ? (event as ToggleEvent).newState === 'open'
        : pane.hasAttribute('data-open')

      setIsOpen(open)

      if (open) {
        openConsole()
        // Dialog behaviour: focus moves in, and goes back to whatever opened it when the dialog closes
        restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        pane.focus({ preventScroll: true })
      } else {
        restoreFocusRef.current?.focus({ preventScroll: true })
        restoreFocusRef.current = null
      }
    }

    // Focus that wandered out of the open dialog (a click on the page, say) is pulled back by the next Tab
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      const isOpenNow = pane.hasAttribute('data-open') || pane.matches(':popover-open')

      if (event.key === 'Tab' && isOpenNow && !pane.contains(document.activeElement)) {
        event.preventDefault()
        pane.focus({ preventScroll: true })
      }
    }

    pane.addEventListener('toggle', handleToggle)
    document.addEventListener('keydown', handleDocumentKeyDown)
    return () => {
      pane.removeEventListener('toggle', handleToggle)
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [])

  return (
    <section
      ref={paneRef}
      id={CONSOLE_ID}
      className='console chrome mono'
      popover='manual'
      role='dialog'
      aria-modal='true'
      aria-label='Developer console'
      tabIndex={-1}
      onKeyDown={trapTab}
    >
      <header>
        <h2>[dev]</h2>
        <p>orbs · achievements · readout · Esc closes</p>
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
