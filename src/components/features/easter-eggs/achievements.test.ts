import { describe, expect, it } from 'vitest'

import { ACHIEVEMENTS } from './achievements'

describe('ACHIEVEMENTS', () => {
  it('has unique ids and a single enlightenment finale', () => {
    const ids = ACHIEVEMENTS.map((achievement) => achievement.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.filter((id) => id === 'enlightenment')).toHaveLength(1)
  })

  it('derives base count without hard-coding 15', () => {
    const baseCount = ACHIEVEMENTS.filter((achievement) => achievement.id !== 'enlightenment').length
    expect(baseCount).toBe(ACHIEVEMENTS.length - 1)
    expect(baseCount).toBeGreaterThan(0)
  })
})
