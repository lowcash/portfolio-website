/**
 * Achievements (detection lives in ./triggers, unlock state in EasterEggs):
 * 1. Triple-click the hero heading → "Speed Clicker"
 * 2. Scroll to exactly 50% → "Perfectly Balanced"
 * 3. Idle 60 seconds → "Patience is a Virtue"
 * 4. Rapid 10 clicks → "Click Master"
 * 5. Copy text → "Copy Cat"
 * 6. Shake device / mouse → "Shake It Off"
 * 7. Scroll 10,000px → "Marathon Runner"
 * 8. Reach bottom <2min → "Speed Reader"
 * 9. Visit 3+ times → "Repeat Visitor"
 * 10. Visit 3 sections → "Section Hopper"
 * 11. Visit all sections → "World Tour"
 * 12. Tweak orb settings 5x → "Settings Tinkerer"
 * 13. Use navigation controls 3x → "Nav Master"
 * 14. Use scroll-to-top shortcut → "Round Trip"
 * 15. Reach contact and return hero → "Back to Origin"
 * 16. Unlocked all 15 → "Enlightenment" (auto-unlock)
 *
 * Open the Dev Console (tap the terminal icon bottom-left or press D on desktop) to see all achievements.
 */

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'triple-click',
    name: 'Speed Clicker',
    description: 'Triple-clicked the logo',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'perfectly-balanced',
    name: 'Perfectly Balanced',
    description: 'Scrolled to exactly 50% of the page',
    icon: '⚖️',
    unlocked: false,
  },
  {
    id: 'patience',
    name: 'Patience is a Virtue',
    description: 'Stayed idle for 60 seconds',
    icon: '💤',
    unlocked: false,
  },
  {
    id: 'rapid-clicker',
    name: 'Click Master',
    description: 'Clicked 10 times in 2 seconds',
    icon: '🖱️',
    unlocked: false,
  },
  {
    id: 'copy-cat',
    name: 'Copy Cat',
    description: 'Copied some text',
    icon: '📋',
    unlocked: false,
  },
  {
    id: 'shake',
    name: 'Shake It Off',
    description: 'Shook your device or moved mouse rapidly',
    icon: '📱',
    unlocked: false,
  },
  {
    id: 'marathon-runner',
    name: 'Marathon Runner',
    description: 'Scrolled a total of 10,000 pixels',
    icon: '🏃',
    unlocked: false,
  },
  {
    id: 'speed-reader',
    name: 'Speed Reader',
    description: 'Reached the bottom in under 2 minutes',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'repeat-visitor',
    name: 'Repeat Visitor',
    description: 'Visited the site 3+ times',
    icon: '🔄',
    unlocked: false,
  },
  {
    id: 'section-hopper',
    name: 'Section Hopper',
    description: 'Visited 3 different sections',
    icon: '🧭',
    unlocked: false,
  },
  {
    id: 'world-tour',
    name: 'World Tour',
    description: 'Visited every section on the page',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'settings-tinkerer',
    name: 'Settings Tinkerer',
    description: 'Tweaked orb settings 5 times',
    icon: '🎛️',
    unlocked: false,
  },
  {
    id: 'nav-master',
    name: 'Nav Master',
    description: 'Used navigation controls 3 times',
    icon: '🛰️',
    unlocked: false,
  },
  {
    id: 'round-trip',
    name: 'Round Trip',
    description: 'Used the scroll-to-top shortcut',
    icon: '🔝',
    unlocked: false,
  },
  {
    id: 'back-to-origin',
    name: 'Back to Origin',
    description: 'Reached contact and returned to hero',
    icon: '🏠',
    unlocked: false,
  },
  {
    id: 'enlightenment',
    name: 'Enlightenment',
    description: 'Unlocked all 15 other achievements',
    icon: '✨',
    unlocked: false,
  },
]
