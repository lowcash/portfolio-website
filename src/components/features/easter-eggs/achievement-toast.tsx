import type { Achievement } from './achievements'

type AchievementToastProps = {
  achievement: Achievement | null
  isHiding: boolean
  /** "3/16": how many are collected, so the toast doubles as a progress line (also on phones, which hide the counter) */
  progress?: string
}

/** One-line message that slides out of the status line. It never covers content and is announced politely. */
export function AchievementToast({ achievement, isHiding, progress }: AchievementToastProps) {
  const isOn = achievement !== null && !isHiding

  return (
    <p
      data-testid='achievement-toast'
      className={`toast chrome mono ${isOn ? 'on' : ''}`}
      role='status'
      aria-live='polite'
    >
      {achievement ? `★︎ achievement unlocked — ${achievement.name}${progress ? ` · ${progress}` : ''}` : ''}
    </p>
  )
}
