'use client'

import { useSyncExternalStore } from 'react'

const EVENTS = ['achievements-updated', 'dev-console-opened', 'storage'] as const
const TOTAL = 16

function subscribe(onChange: () => void) {
  EVENTS.forEach((name) => window.addEventListener(name, onChange))
  return () => EVENTS.forEach((name) => window.removeEventListener(name, onChange))
}

/** "★ 3/16" once the console has been opened; nothing before (the achievements are dormant until then). */
function readCounter() {
  try {
    if (localStorage.getItem('dev_console_opened') !== 'true') {
      return ''
    }
    const saved = JSON.parse(localStorage.getItem('achievements') ?? '[]') as Array<{ unlocked?: boolean }>
    return `★︎ ${saved.filter((achievement) => achievement.unlocked).length}/${TOTAL}`
  } catch {
    return ''
  }
}

export function StatusAchievements() {
  const counter = useSyncExternalStore(subscribe, readCounter, () => '')

  return (
    <button
      type='button'
      className='st-ach'
      hidden={counter === ''}
      popoverTarget='console'
      popoverTargetAction='show'
      aria-label={`Achievements unlocked ${counter.replace('★︎ ', '')}. Open the console to see them`}
    >
      {counter}
    </button>
  )
}
