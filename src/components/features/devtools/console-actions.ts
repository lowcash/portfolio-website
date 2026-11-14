/** Shared open/close side effects for D-key, 4-finger, trigger button, and X close. */

export function openConsole(): void {
  localStorage.setItem('dev_console_opened', 'true')
  window.dispatchEvent(new CustomEvent('dev-console-opened'))
  console.log('%c🎮 Achievement system activated!', 'color: #10b981; font-size: 12px; font-weight: bold;')
}

export function closeConsole(): void {
  localStorage.removeItem('dev_console_opened')
  window.dispatchEvent(new CustomEvent('dev-console-closed'))
}
