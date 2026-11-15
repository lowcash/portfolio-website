/**
 * Single source of truth for the settings of the three lights.
 *
 * - `ORB_SETTING_DEFINITIONS` drives the developer console sliders, persistence and CSS custom properties.
 * - The store writes CSS custom properties on :root (consumed by the `.orb` rules in animations.css) and persists
 *   to localStorage. Physics settings (pointer, damping, parallax, nudge) are consumed by `orb-effects.ts`.
 * - Defaults are the calm Night Paper look: 1x on every multiplier is the restrained composition, the upper half of
 *   each slider is the louder one. Every control must have a visible effect (see the table in docs/ARCHITECTURE.md).
 */

export type OrbSettingKey =
  | 'animationSpeed'
  | 'orbSize'
  | 'orbOpacity'
  | 'orbBlur'
  | 'hue'
  | 'saturation'
  | 'pointer'
  | 'damping'
  | 'parallax'
  | 'nudge'

type OrbSettings = Record<OrbSettingKey, number>

export type OrbSettingDefinition = {
  key: OrbSettingKey
  label: string
  kind: 'slider' | 'toggle'
  min: number
  max: number
  step: number
  defaultValue: number
  /** localStorage key */
  storageKey: string
  format: (value: number) => string
  /** CSS custom property written on :root, if the setting is consumed by CSS */
  cssVar?: string
  toCssValue?: (value: number) => string
  /** One line shown under the label so every slider says what it visibly does */
  hint: string
  /** Only does something where the pointer physics run (fine pointer, motion allowed) */
  needsPhysics?: boolean
}

const times = (value: number) => `${value.toFixed(1)}x`
const times2 = (value: number) => `${value.toFixed(2)}x`
const percent = (value: number) => `${value.toFixed(0)}%`

export const ORB_SETTING_DEFINITIONS: readonly OrbSettingDefinition[] = [
  {
    key: 'animationSpeed',
    label: 'DRIFT SPEED',
    kind: 'slider',
    min: 0.2,
    max: 3,
    step: 0.1,
    defaultValue: 1,
    storageKey: 'animation_speed',
    format: times,
    hint: 'How fast the lights drift on their own (1x is one cycle in about 2.5 minutes)',
  },
  {
    key: 'orbSize',
    label: 'SIZE',
    kind: 'slider',
    min: 0.5,
    max: 1.6,
    step: 0.05,
    defaultValue: 1,
    storageKey: 'orb_size',
    format: times2,
    cssVar: '--orb-size',
    hint: 'Diameter of every light',
  },
  {
    key: 'orbOpacity',
    label: 'INTENSITY',
    kind: 'slider',
    min: 0,
    max: 2,
    step: 0.05,
    defaultValue: 1,
    storageKey: 'orb_opacity',
    format: (value) => percent(value * 100),
    cssVar: '--orb-opacity',
    hint: '0% hides the lights; text contrast is only guaranteed up to 100%',
  },
  {
    key: 'orbBlur',
    label: 'SOFTNESS',
    kind: 'slider',
    min: 0.1,
    max: 1,
    step: 0.05,
    defaultValue: 1,
    storageKey: 'orb_blur',
    format: times2,
    cssVar: '--orb-blur',
    hint: '1x is a pure haze, lower makes a harder-edged disc',
  },
  {
    key: 'hue',
    label: 'HUE SHIFT',
    kind: 'slider',
    min: 0,
    max: 360,
    step: 5,
    defaultValue: 0,
    storageKey: 'orb_hue',
    format: (value) => `${value.toFixed(0)}°`,
    cssVar: '--hue-shift',
    hint: 'Rotates the whole palette (status line and accents follow)',
  },
  {
    key: 'saturation',
    label: 'SATURATION',
    kind: 'slider',
    min: 0,
    max: 2,
    step: 0.05,
    defaultValue: 1,
    storageKey: 'orb_saturation',
    format: (value) => percent(value * 100),
    cssVar: '--sat',
    hint: '0% is monochrome, 100% the muted default, above is vivid',
  },
  {
    key: 'pointer',
    label: 'POINTER PUSH',
    kind: 'slider',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 30,
    storageKey: 'orb_pointer',
    format: percent,
    needsPhysics: true,
    hint: 'How far the lights give way to your cursor',
  },
  {
    key: 'damping',
    label: 'SPRING DAMPING',
    kind: 'slider',
    min: 0.15,
    max: 1.5,
    step: 0.05,
    defaultValue: 0.9,
    storageKey: 'orb_damping',
    format: times2,
    needsPhysics: true,
    hint: 'Low wobbles and overshoots, high glides without bounce',
  },
  {
    key: 'parallax',
    label: 'SCROLL PARALLAX',
    kind: 'slider',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 30,
    storageKey: 'orb_parallax',
    format: percent,
    needsPhysics: true,
    hint: 'How much the lights trail behind while you scroll',
  },
  {
    key: 'nudge',
    label: 'CLICK NUDGE',
    kind: 'toggle',
    min: 0,
    max: 1,
    step: 1,
    defaultValue: 1,
    storageKey: 'orb_nudge',
    format: (value) => (value >= 1 ? 'ON' : 'OFF'),
    needsPhysics: true,
    hint: 'Clicking the background gives the lights a soft shove',
  },
]

export const DEFAULT_ORB_SETTINGS = Object.fromEntries(
  ORB_SETTING_DEFINITIONS.map((definition) => [definition.key, definition.defaultValue]),
) as OrbSettings

type OrbPreset = {
  id: string
  label: string
  description: string
  values: Partial<OrbSettings>
}

export const ORB_PRESETS: readonly OrbPreset[] = [
  { id: 'calm', label: 'Calm', description: 'The default look', values: {} },
  {
    id: 'still',
    label: 'Still',
    description: 'Barely there: no physics, slowest drift, fainter',
    values: { animationSpeed: 0.3, orbOpacity: 0.7, pointer: 0, parallax: 0, nudge: 0 },
  },
  {
    id: 'lively',
    label: 'Lively',
    description: 'Looser spring, more reaction',
    values: { animationSpeed: 3, damping: 0.4, pointer: 80, parallax: 80 },
  },
  {
    id: 'vivid',
    label: 'Vivid',
    description: 'Bigger, brighter, more colour',
    values: { orbSize: 1.3, orbOpacity: 1.6, saturation: 1.6, orbBlur: 0.8 },
  },
  {
    id: 'mono',
    label: 'Mono',
    description: 'Black and white film',
    values: { saturation: 0, orbOpacity: 1.2 },
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
          animationSpeed: settings.animationSpeed,
          orbSize: settings.orbSize,
          orbBlur: settings.orbBlur,
          orbOpacity: settings.orbOpacity,
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

function setOrbSettings(partial: Partial<OrbSettings>) {
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
