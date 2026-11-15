/** Arms the achievements: they stay dormant until the console has been opened once. */
export function openConsole(): void {
  localStorage.setItem('dev_console_opened', 'true')
  window.dispatchEvent(new CustomEvent('dev-console-opened'))
  console.log('%c🎮 Achievement system activated!', 'color: #10b981; font-size: 12px; font-weight: bold;')
}

export const CONSOLE_ID = 'console'

let restoreTarget: HTMLElement | null = null

export const supportsPopover = (pane: HTMLElement) => typeof pane.togglePopover === 'function'
const isPaneOpen = (pane: HTMLElement) =>
  supportsPopover(pane) ? pane.matches(':popover-open') : pane.hasAttribute('data-open')

/**
 * Toggles the pane through the popover API (data-open where unsupported). Opening from the keyboard moves focus into
 * the pane; closing hands it back to where it was. There is no focus trap: it is not a modal.
 */
export function toggleConsolePane(fromKeyboard: boolean) {
  const pane = document.getElementById(CONSOLE_ID)
  if (!pane) return

  const wasOpen = isPaneOpen(pane)

  if (supportsPopover(pane)) {
    pane.togglePopover()
  } else {
    pane.toggleAttribute('data-open')
    pane.dispatchEvent(new Event('toggle'))
  }

  if (wasOpen) {
    restoreTarget?.focus({ preventScroll: true })
    restoreTarget = null
  } else if (fromKeyboard) {
    restoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null
    pane.focus({ preventScroll: true })
  }
}

export function closeConsolePane() {
  const pane = document.getElementById(CONSOLE_ID)
  if (pane && isPaneOpen(pane)) {
    toggleConsolePane(true)
  }
}
