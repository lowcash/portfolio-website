import { describe, expect, it } from 'vitest'

import {
  DEFAULT_ORB_SETTINGS,
  ORB_PRESETS,
  ORB_SETTING_DEFINITIONS,
  matchesPreset,
  resolveStoredSettings,
  settingsToCssVars,
} from './orb-settings'

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

    for (const legacyKey of [
      'orb_brightness',
      'animation_speed',
      'color_variation',
      'orb_size',
      'orb_blur',
      'orb_opacity',
    ]) {
      expect(storageKeys).toContain(legacyKey)
    }
  })
})

describe('defaults reproduce the original look', () => {
  it('emits the original CSS custom property values', () => {
    expect(settingsToCssVars(DEFAULT_ORB_SETTINGS)).toMatchObject({
      '--orb-brightness': '0.5',
      '--animation-speed': '3',
      '--color-variation': '0.4',
      '--orb-size': '1.2',
      '--orb-blur': '1',
      '--orb-opacity': '0.85',
      '--position-variation': '1',
      '--orb-magnetism': '0',
      '--orb-grain': '0',
    })
  })

  it('has all effects switched off', () => {
    expect(DEFAULT_ORB_SETTINGS).toMatchObject({ magnetism: 0, burst: 0, ripples: 0, grain: 0, hue: 0, saturation: 1 })
  })
})

describe('resolveStoredSettings', () => {
  it('returns defaults when nothing is stored', () => {
    expect(resolveStoredSettings(() => null)).toEqual(DEFAULT_ORB_SETTINGS)
  })

  it('reads stored values and clamps them to the allowed range', () => {
    const stored: Record<string, string> = { orb_size: '99', animation_speed: '-4', orb_opacity: '1.5' }
    const settings = resolveStoredSettings((key) => stored[key] ?? null)

    expect(settings.orbSize).toBe(5)
    expect(settings.animationSpeed).toBe(0.1)
    expect(settings.orbOpacity).toBe(1.5)
  })

  it('falls back to the default for garbage', () => {
    const settings = resolveStoredSettings((key) => (key === 'orb_blur' ? 'not-a-number' : null))

    expect(settings.orbBlur).toBe(DEFAULT_ORB_SETTINGS.orbBlur)
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
