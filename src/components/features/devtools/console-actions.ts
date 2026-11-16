/** Arms the achievements: they stay dormant until the console has been opened once. */
export function openConsole(): void {
  localStorage.setItem('dev_console_opened', 'true')
  window.dispatchEvent(new CustomEvent('dev-console-opened'))
  console.log('%c🎮 Achievement system activated!', 'color: #10b981; font-size: 12px; font-weight: bold;')
}

export const CONSOLE_ID = 'console'

export const supportsPopover = (pane: HTMLElement) => typeof pane.togglePopover === 'function'
const isPaneOpen = (pane: HTMLElement) =>
  supportsPopover(pane) ? pane.matches(':popover-open') : pane.hasAttribute('data-open')

/**
 * Toggles the pane through the popover API (data-open where unsupported). Focus handling (into the dialog on open,
 * back to the trigger on close, Tab trap) lives in console-pane.tsx so it also covers the declarative buttons.
 */
export function toggleConsolePane() {
  const pane = document.getElementById(CONSOLE_ID)
  if (!pane) return

  if (supportsPopover(pane)) {
    pane.togglePopover()
  } else {
    pane.toggleAttribute('data-open')
    pane.dispatchEvent(new Event('toggle'))
  }
}

export function closeConsolePane() {
  const pane = document.getElementById(CONSOLE_ID)
  if (pane && isPaneOpen(pane)) {
    toggleConsolePane()
  }
}
