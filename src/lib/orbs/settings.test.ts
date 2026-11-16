import { describe, expect, it } from 'vitest'

import {
  DEFAULT_ORB_SETTINGS,
  ORB_PRESETS,
  ORB_SETTING_DEFINITIONS,
  matchesPreset,
  resolveStoredSettings,
  settingsToCssVars,
} from './settings'

describe('orb setting definitions', () => {
  it('has unique keys and storage keys', () => {
    const keys = ORB_SETTING_DEFINITIONS.map((definition) => definition.key)
    const storageKeys = ORB_SETTING_DEFINITIONS.map((definition) => definition.storageKey)

    expect(new Set(keys).size).toBe(keys.length)
    expect(new Set(storageKeys).size).toBe(storageKeys.length)
  })

  it('keeps every default inside its own range', () => {
    for (const definition of ORB_SETTING_DEFINITIONS) {
      expect(definition.defaultValue).toBeGreaterThanOrEqual(definition.min)
      expect(definition.defaultValue).toBeLessThanOrEqual(definition.max)
    }
  })

  it('keeps legacy storage keys so existing visitors keep their settings', () => {
    const storageKeys = ORB_SETTING_DEFINITIONS.map((definition) => definition.storageKey)

    for (const legacyKey of ['animation_speed', 'orb_size', 'orb_blur', 'orb_opacity']) {
      expect(storageKeys).toContain(legacyKey)
    }
  })
})

describe('defaults', () => {
  it('emits the Night Paper CSS custom property values', () => {
    expect(settingsToCssVars(DEFAULT_ORB_SETTINGS)).toMatchObject({
      '--orb-size': '1',
      '--orb-blur': '1',
      '--orb-opacity': '1',
      '--hue-shift': '0',
      '--sat': '1',
    })
  })

  it('has the physics on at a very gentle strength and the palette unshifted', () => {
    expect(DEFAULT_ORB_SETTINGS).toMatchObject({
      pointer: 20,
      parallax: 10,
      nudge: 1,
      damping: 0.9,
      hue: 0,
      saturation: 1,
    })
  })
})

describe('resolveStoredSettings', () => {
  it('returns defaults when nothing is stored', () => {
    expect(resolveStoredSettings(() => null)).toEqual(DEFAULT_ORB_SETTINGS)
  })

  it('reads stored values and clamps them to the allowed range', () => {
    const stored: Record<string, string> = { orb_size: '99', animation_speed: '-4', orb_opacity: '1.5' }
    const settings = resolveStoredSettings((key) => stored[key] ?? null)

    expect(settings.orbSize).toBe(1.6)
    expect(settings.animationSpeed).toBe(0.2)
    expect(settings.orbOpacity).toBe(1.5)
  })

  it('falls back to the default for garbage', () => {
    const settings = resolveStoredSettings((key) => (key === 'orb_blur' ? 'not-a-number' : null))

    expect(settings.orbBlur).toBe(DEFAULT_ORB_SETTINGS.orbBlur)
  })
})

describe('visible controls', () => {
  it('exposes ten settings, one of them a toggle, with the softness slider only going down', () => {
    expect(ORB_SETTING_DEFINITIONS).toHaveLength(10)
    expect(ORB_SETTING_DEFINITIONS.filter((definition) => definition.kind === 'toggle').map((d) => d.key)).toEqual([
      'nudge',
    ])
    expect(ORB_SETTING_DEFINITIONS.find((definition) => definition.key === 'orbBlur')?.max).toBe(1)
  })

  it('has dropped the duplicate and no-op controls', () => {
    const keys = ORB_SETTING_DEFINITIONS.map((definition) => definition.key as string)

    for (const removed of ['orbBrightness', 'magnetism', 'burst', 'ripples']) {
      expect(keys).not.toContain(removed)
    }
  })

  it('wires every control to exactly one consumer: a CSS variable, the physics loop or the playback rate', () => {
    for (const definition of ORB_SETTING_DEFINITIONS) {
      const consumers = [
        Boolean(definition.cssVar),
        Boolean(definition.needsPhysics),
        definition.key === 'animationSpeed',
      ]

      expect(consumers.filter(Boolean), definition.key).toHaveLength(1)
    }
  })
})

describe('presets', () => {
  it('only reference known keys and stay within range', () => {
    for (const preset of ORB_PRESETS) {
      for (const [key, value] of Object.entries(preset.values)) {
        const definition = ORB_SETTING_DEFINITIONS.find((candidate) => candidate.key === key)

        expect(definition, `${preset.id}.${key}`).toBeDefined()
        expect(value).toBeGreaterThanOrEqual(definition!.min)
        expect(value).toBeLessThanOrEqual(definition!.max)
      }
    }
  })

  it('treats the calm preset as the defaults and the others as distinct', () => {
    const [calm, ...others] = ORB_PRESETS

    expect(matchesPreset(DEFAULT_ORB_SETTINGS, calm)).toBe(true)

    for (const preset of others) {
      expect(matchesPreset(DEFAULT_ORB_SETTINGS, preset)).toBe(false)
    }
  })
})
