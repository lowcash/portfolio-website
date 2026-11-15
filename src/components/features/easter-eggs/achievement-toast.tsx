import type { Achievement } from './achievements'

type AchievementToastProps = {
  achievement: Achievement | null
  isHiding: boolean
}

/** One-line message that slides out of the status line. It never covers content and is announced politely. */
export function AchievementToast({ achievement, isHiding }: AchievementToastProps) {
  const isOn = achievement !== null && !isHiding

  return (
    <p
      data-testid='achievement-toast'
      className={`toast chrome mono ${isOn ? 'on' : ''}`}
      role='status'
      aria-live='polite'
    >
      {achievement ? `★︎ achievement unlocked — ${achievement.name}` : ''}
    </p>
  )
}
