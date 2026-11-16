import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { ACHIEVEMENT_HINTS } from '../devtools/achievement-hints'
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

  it('has a hint and a description for every achievement, and no hint without an achievement', () => {
    expect(Object.keys(ACHIEVEMENT_HINTS).sort()).toEqual(ACHIEVEMENTS.map((achievement) => achievement.id).sort())

    for (const achievement of ACHIEVEMENTS) {
      expect(achievement.description.length, achievement.id).toBeGreaterThan(10)
      expect(ACHIEVEMENT_HINTS[achievement.id].length, achievement.id).toBeGreaterThan(10)
    }
  })

  it('has a trigger in code for every achievement (none is unreachable)', () => {
    const directory = join(__dirname, 'triggers')
    const sources = [
      ...readdirSync(directory).map((file) => readFileSync(join(directory, file), 'utf8')),
      readFileSync(join(__dirname, 'use-achievement-state.ts'), 'utf8'),
    ].join('\n')

    for (const achievement of ACHIEVEMENTS) {
      expect(sources, achievement.id).toContain(`'${achievement.id}'`)
    }
  })
})
