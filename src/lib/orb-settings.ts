/**
 * Single source of truth for the background orb settings.
 *
 * - `ORB_SETTING_DEFINITIONS` drives the developer console sliders, persistence and CSS custom properties.
 * - The store writes CSS custom properties on :root (consumed by the `.orb` rules in animations.css) and persists
 *   to localStorage. Color-related settings (hue, saturation, color variation) are consumed in JS by the
 *   scroll-driven color loop; effect settings (magnetism, burst, ripples) by `orb-effects.ts`.
 * - Defaults reproduce the original look exactly, everything else is opt-in.
 */

export type OrbSettingKey =
  | 'animationSpeed'
  | 'colorVariation'
  | 'orbSize'
  | 'orbBlur'
  | 'orbOpacity'
  | 'orbBrightness'
  | 'scatter'
  | 'hue'
  | 'saturation'
  | 'magnetism'
  | 'burst'
  | 'ripples'
  | 'grain'

export type OrbSettings = Record<OrbSettingKey, number>

export type OrbSettingGroup = 'motion' | 'look' | 'color' | 'effects'

export type OrbSettingDefinition = {
  key: OrbSettingKey
  label: string
  group: OrbSettingGroup
  kind: 'slider' | 'toggle'
  min: number
  max: number
  step: number
  defaultValue: number
  /** localStorage key (legacy keys kept so existing visitors keep their settings) */
  storageKey: string
  format: (value: number) => string
  /** CSS custom property written on :root, if the setting is consumed by CSS */
  cssVar?: string
  toCssValue?: (value: number) => string
  /** One line shown under the label so every slider says what it visibly does */
  hint: string
}

const times = (value: number) => `${value.toFixed(1)}x`
const percent = (value: number) => `${value.toFixed(0)}%`

export const ORB_SETTING_DEFINITIONS: readonly OrbSettingDefinition[] = [
  {
    key: 'animationSpeed',
    label: 'ANIMATION SPEED',
    group: 'motion',
    kind: 'slider',
    min: 0.1,
    max: 10,
    step: 0.1,
    defaultValue: 3,
    storageKey: 'animation_speed',
    format: times,
    cssVar: '--animation-speed',
    hint: 'How fast the orbs drift',
  },
  {
    key: 'scatter',
    label: 'SCATTER',
    group: 'motion',
    kind: 'slider',
    min: 0,
    max: 200,
    step: 5,
    defaultValue: 0,
    storageKey: 'orb_scatter',
    format: percent,
    cssVar: '--position-variation',
    toCssValue: (value) => String(1 + value / 100),
    hint: 'Pushes each orb away from its home position',
  },
  {
    key: 'orbSize',
    label: 'ORB SIZE',
    group: 'look',
    kind: 'slider',
    min: 0.1,
    max: 5,
    step: 0.1,
    defaultValue: 1.2,
    storageKey: 'orb_size',
    format: times,
    cssVar: '--orb-size',
    hint: 'Diameter of every orb',
  },
  {
    key: 'orbOpacity',
    label: 'ORB OPACITY',
    group: 'look',
    kind: 'slider',
    min: 0,
    max: 3,
    step: 0.1,
    defaultValue: 0.85,
    storageKey: 'orb_opacity',
    format: (value) => percent(value * 100),
    cssVar: '--orb-opacity',
    hint: 'Above the default the orbs punch through the page',
  },
  {
    key: 'orbBlur',
    label: 'ORB BLUR',
    group: 'look',
    kind: 'slider',
    min: 0.1,
    max: 5,
    step: 0.1,
    defaultValue: 1,
    storageKey: 'orb_blur',
    format: times,
    cssVar: '--orb-blur',
    hint: 'Below 1x the orbs turn into crisp discs',
  },
  {
    key: 'orbBrightness',
    label: 'GLOW',
    group: 'look',
    kind: 'slider',
    min: 0.2,
    max: 2,
    step: 0.05,
    defaultValue: 0.5,
    storageKey: 'orb_brightness',
    format: (value) => value.toFixed(2),
    cssVar: '--orb-brightness',
    hint: 'Brightness of the orb light',
  },
  {
    key: 'colorVariation',
    label: 'COLOR VARIATION',
    group: 'color',
    kind: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 40,
    storageKey: 'color_variation',
    format: percent,
    cssVar: '--color-variation',
    toCssValue: (value) => String(value / 100),
    hint: 'How far each orb drifts from the section color',
  },
  {
    key: 'hue',
    label: 'HUE SHIFT',
    group: 'color',
    kind: 'slider',
    min: 0,
    max: 360,
    step: 5,
    defaultValue: 0,
    storageKey: 'orb_hue',
    format: (value) => `${value.toFixed(0)}°`,
    hint: 'Rotates the whole palette (progress bar and glows follow)',
  },
  {
    key: 'saturation',
    label: 'SATURATION',
    group: 'color',
    kind: 'slider',
    min: 0,
    max: 2,
    step: 0.05,
    defaultValue: 1,
    storageKey: 'orb_saturation',
    format: (value) => percent(value * 100),
    hint: '0% is monochrome, above 100% is neon',
  },
  {
    key: 'magnetism',
    label: 'MAGNETISM',
    group: 'effects',
    kind: 'slider',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 0,
    storageKey: 'orb_magnetism',
    format: percent,
    cssVar: '--orb-magnetism',
    toCssValue: (value) => String(value / 50),
    hint: 'Orbs follow your cursor (device tilt on phones)',
  },
  {
    key: 'burst',
    label: 'SECTION BURST',
    group: 'effects',
    kind: 'slider',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 0,
    storageKey: 'orb_burst',
    format: percent,
    hint: 'Orbs pulse when you reach a new section',
  },
  {
    key: 'grain',
    label: 'FILM GRAIN',
    group: 'effects',
    kind: 'slider',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 0,
    storageKey: 'orb_grain',
    format: percent,
    cssVar: '--orb-grain',
    toCssValue: (value) => String(value / 100),
    hint: 'Analog noise over the background',
  },
  {
    key: 'ripples',
    label: 'CLICK RIPPLES',
    group: 'effects',
    kind: 'toggle',
    min: 0,
    max: 1,
    step: 1,
    defaultValue: 0,
    storageKey: 'orb_ripples',
    format: (value) => (value >= 1 ? 'ON' : 'OFF'),
    hint: 'Click or tap the background for a shockwave that shoves the orbs',
  },
]

export const DEFAULT_ORB_SETTINGS = Object.fromEntries(
  ORB_SETTING_DEFINITIONS.map((definition) => [definition.key, definition.defaultValue]),
) as OrbSettings

export type OrbPreset = {
  id: string
  label: string
  description: string
  values: Partial<OrbSettings>
}

export const ORB_PRESETS: readonly OrbPreset[] = [
  { id: 'calm', label: 'Calm', description: 'The original look', values: {} },
  {
    id: 'aurora',
    label: 'Aurora',
    description: 'Slow, wide, glowing curtains',
    values: {
      animationSpeed: 1.8,
      orbSize: 1.7,
      orbOpacity: 1.5,
      orbBlur: 1.6,
      orbBrightness: 0.7,
      colorVariation: 160,
      hue: 105,
      magnetism: 35,
      burst: 40,
    },
  },
  {
    id: 'neon',
    label: 'Neon',
    description: 'Crisp, saturated, fast',
    values: {
      animationSpeed: 5,
      orbSize: 0.9,
      orbOpacity: 0.9,
      orbBlur: 0.45,
      orbBrightness: 1,
      colorVariation: 120,
      saturation: 1.5,
      magnetism: 50,
      burst: 80,
      ripples: 1,
    },
  },
  {
    id: 'nebula',
    label: 'Nebula',
    description: 'Heavy magenta haze with film grain',
    values: {
      animationSpeed: 1.5,
      orbSize: 1.7,
      orbOpacity: 1.7,
      orbBlur: 1.3,
      orbBrightness: 0.75,
      colorVariation: 70,
      hue: 40,
      saturation: 1.4,
      scatter: 45,
      magnetism: 20,
      grain: 20,
    },
  },
  {
    id: 'mono',
    label: 'Mono',
    description: 'Black and white film',
    values: {
      animationSpeed: 2,
      orbSize: 1.4,
      orbOpacity: 1.3,
      orbBlur: 1.2,
      orbBrightness: 0.6,
      colorVariation: 0,
      saturation: 0,
      grain: 45,
      burst: 30,
    },
  },
]

const SETTINGS_EVENT = 'orb-settings-change'
const SETTINGS_EVENT_DEBOUNCE_MS = 400

function clampToDefinition(definition: OrbSettingDefinition, value: number) {
  if (Number.isNaN(value)) {
    return definition.defaultValue
  }

  return Math.min(definition.max, Math.max(definition.min, value))
}

/** Parse persisted values; anything missing, unparsable or out of range falls back to the default. */
export function resolveStoredSettings(readItem: (storageKey: string) => string | null): OrbSettings {
  const settings = { ...DEFAULT_ORB_SETTINGS }

  for (const definition of ORB_SETTING_DEFINITIONS) {
    const stored = readItem(definition.storageKey)

    if (stored !== null) {
      settings[definition.key] = clampToDefinition(definition, parseFloat(stored))
    }
  }

  return settings
}

/** CSS custom properties (name -> value) for the settings that CSS consumes. */
export function settingsToCssVars(settings: OrbSettings): Record<string, string> {
  const vars: Record<string, string> = {}

  for (const definition of ORB_SETTING_DEFINITIONS) {
    if (definition.cssVar) {
      const value = settings[definition.key]
      vars[definition.cssVar] = definition.toCssValue ? definition.toCssValue(value) : String(value)
    }
  }

  return vars
}

export function matchesPreset(settings: OrbSettings, preset: OrbPreset) {
  return ORB_SETTING_DEFINITIONS.every(
    (definition) =>
      Math.abs(settings[definition.key] - (preset.values[definition.key] ?? definition.defaultValue)) < 1e-9,
  )
}

type Listener = () => void

const listeners = new Set<Listener>()
let state: OrbSettings = DEFAULT_ORB_SETTINGS
let isHydrated = false
let eventTimer: ReturnType<typeof setTimeout> | null = null

function readLocalStorageItem(storageKey: string) {
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

function applyCssVars(settings: OrbSettings) {
  const root = document.documentElement

  for (const [name, value] of Object.entries(settingsToCssVars(settings))) {
    root.style.setProperty(name, value)
  }
}

function persist(settings: OrbSettings) {
  try {
    for (const definition of ORB_SETTING_DEFINITIONS) {
      localStorage.setItem(definition.storageKey, String(settings[definition.key]))
    }
  } catch {
    // Storage can be blocked (private mode); settings then simply last for the session
  }
}

function notify() {
  listeners.forEach((listener) => listener())
}

/** Debounced so a drag counts as one change for the "settings tinkerer" achievement, as before. */
function scheduleSettingsEvent() {
  if (eventTimer) {
    clearTimeout(eventTimer)
  }

  eventTimer = setTimeout(() => {
    const settings = state
    window.dispatchEvent(
      new CustomEvent(SETTINGS_EVENT, {
        detail: {
          orbBrightness: settings.orbBrightness,
          animationSpeed: settings.animationSpeed,
          colorVariation: settings.colorVariation / 100,
          orbSize: settings.orbSize,
          orbBlur: settings.orbBlur,
          orbOpacity: settings.orbOpacity,
          positionVariation: 1 + settings.scatter / 100,
        },
      }),
    )
  }, SETTINGS_EVENT_DEBOUNCE_MS)
}

/** Load persisted settings and apply them to the document. Safe to call repeatedly. */
export function hydrateOrbSettings() {
  if (isHydrated || typeof window === 'undefined') {
    return
  }

  isHydrated = true
  state = resolveStoredSettings(readLocalStorageItem)
  applyCssVars(state)
  notify()
}

export function getOrbSettings() {
  return state
}

export function getServerOrbSettings() {
  return DEFAULT_ORB_SETTINGS
}

export function subscribeToOrbSettings(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setOrbSettings(partial: Partial<OrbSettings>) {
  if (typeof window === 'undefined') {
    return
  }

  hydrateOrbSettings()

  const next = { ...state }

  for (const definition of ORB_SETTING_DEFINITIONS) {
    const value = partial[definition.key]

    if (value !== undefined) {
      next[definition.key] = clampToDefinition(definition, value)
    }
  }

  state = next
  applyCssVars(state)
  persist(state)
  notify()
  scheduleSettingsEvent()
}

export function setOrbSetting(key: OrbSettingKey, value: number) {
  setOrbSettings({ [key]: value })
}

export function resetOrbSettings() {
  setOrbSettings(DEFAULT_ORB_SETTINGS)
}

export function applyOrbPreset(preset: OrbPreset) {
  setOrbSettings({ ...DEFAULT_ORB_SETTINGS, ...preset.values })
}
