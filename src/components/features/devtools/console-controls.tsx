'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { subscribeToPhysicsSupport, supportsOrbPhysics } from '@/lib/orbs/effects'
import {
  ORB_PRESETS,
  ORB_SETTING_DEFINITIONS,
  type OrbSettingDefinition,
  applyOrbPreset,
  describePresetChanges,
  getOrbSettings,
  getServerOrbSettings,
  matchesPreset,
  resetOrbSettings,
  setOrbSetting,
  subscribeToOrbSettings,
} from '@/lib/orbs/settings'

import { ACHIEVEMENTS, type Achievement } from '@/components/features/easter-eggs/achievements'

import { ACHIEVEMENT_HINTS } from './achievement-hints'
import { useConsoleStats } from './use-console-stats'

function Knob({
  definition,
  value,
  hasPhysics,
}: {
  definition: OrbSettingDefinition
  value: number
  hasPhysics: boolean
}) {
  const id = `orb-setting-${definition.key}`
  const isDisabled = Boolean(definition.needsPhysics) && !hasPhysics
  const hint = isDisabled
    ? 'Needs a mouse and motion enabled; touch and reduced motion keep the plain drift'
    : definition.hint

  if (definition.kind === 'toggle') {
    const isOn = value >= 1

    return (
      <div className='knob'>
        <span id={`${id}-label`} className='caps'>
          {definition.label}
        </span>
        <button
          type='button'
          role='switch'
          aria-checked={isOn}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          disabled={isDisabled}
          onClick={() => setOrbSetting(definition.key, isOn ? 0 : 1)}
        >
          {definition.format(value)}
        </button>
        <small id={`${id}-hint`}>{hint}</small>
      </div>
    )
  }

  return (
    <div className='knob'>
      <label htmlFor={id} className='caps'>
        {definition.label}
      </label>
      <output htmlFor={id}>{definition.format(value)}</output>
      <input
        id={id}
        type='range'
        min={definition.min}
        max={definition.max}
        step={definition.step}
        value={value}
        aria-describedby={`${id}-hint`}
        disabled={isDisabled}
        onChange={(event) => setOrbSetting(definition.key, parseFloat(event.target.value))}
      />
      <small id={`${id}-hint`}>{hint}</small>
    </div>
  )
}

function Lights() {
  const settings = useSyncExternalStore(subscribeToOrbSettings, getOrbSettings, getServerOrbSettings)
  const hasPhysics = useSyncExternalStore(subscribeToPhysicsSupport, supportsOrbPhysics, () => true)
  const [peeked, setPeeked] = useState<string | null>(null)
  const shown =
    ORB_PRESETS.find((preset) => preset.id === peeked) ?? ORB_PRESETS.find((preset) => matchesPreset(settings, preset))

  return (
    <div className='pane'>
      <h3 className='caps'>Lights</h3>
      <div className='presets' role='group' aria-label='Presets'>
        {ORB_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type='button'
            aria-pressed={matchesPreset(settings, preset)}
            onPointerEnter={() => setPeeked(preset.id)}
            onPointerLeave={() => setPeeked(null)}
            onFocus={(event) => setPeeked(event.currentTarget.matches(':focus-visible') ? preset.id : null)}
            onBlur={() => setPeeked(null)}
            onClick={() => applyOrbPreset(preset)}
          >
            {preset.label}
          </button>
        ))}
        <button type='button' className='reset' onClick={resetOrbSettings}>
          RESET TO DEFAULT
        </button>
      </div>
      <p className='preset-note' aria-live='polite'>
        {shown ? (
          <>
            <b>{shown.label}</b> — {shown.description}. <span>{describePresetChanges(shown)}</span>
          </>
        ) : (
          'Custom: sliders moved away from every preset.'
        )}
      </p>
      <div className='knobs'>
        {ORB_SETTING_DEFINITIONS.map((definition) => (
          <Knob key={definition.key} definition={definition} value={settings[definition.key]} hasPhysics={hasPhysics} />
        ))}
      </div>
    </div>
  )
}

function loadAchievements(): Achievement[] {
  try {
    const saved = localStorage.getItem('achievements')
    const parsed = saved ? (JSON.parse(saved) as Achievement[]) : []
    return ACHIEVEMENTS.map((base) => ({ ...base, ...parsed.find((entry) => entry.id === base.id) }))
  } catch {
    return ACHIEVEMENTS
  }
}

function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      setAchievements((event as CustomEvent<{ achievements: Achievement[] }>).detail.achievements)
    }

    // Read once the pane mounts (client only), then follow the live updates from the easter-egg layer
    const frame = requestAnimationFrame(() => setAchievements(loadAchievements()))
    window.addEventListener('achievements-updated', handleUpdate)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('achievements-updated', handleUpdate)
    }
  }, [])

  return achievements
}

function hintFor(achievement: Achievement) {
  return ACHIEVEMENT_HINTS[achievement.id] ?? 'Keep exploring...'
}

function Achievements() {
  const achievements = useAchievements()
  const [focused, setFocused] = useState<Achievement | null>(null)
  const unlocked = achievements.filter((achievement) => achievement.unlocked).length

  const handleReset = () => {
    if (confirm('Reset all achievements? This cannot be undone!')) {
      localStorage.removeItem('achievements')
      window.dispatchEvent(new CustomEvent('achievements-reset'))
    }
  }

  return (
    <div className='pane'>
      <h3 className='caps'>
        Achievements{' '}
        <span>
          {unlocked}/{achievements.length}
        </span>
      </h3>
      <ol className='tiles'>
        {achievements.map((achievement, index) => (
          <li key={achievement.id}>
            <button
              type='button'
              data-on={achievement.unlocked ? '' : undefined}
              aria-label={`${achievement.name}: ${achievement.unlocked ? 'unlocked' : 'locked'}. ${hintFor(achievement)}`}
              onPointerEnter={() => setFocused(achievement)}
              onFocus={() => setFocused(achievement)}
              onClick={() => {
                setFocused(achievement)
                if (achievement.id === 'enlightenment' && achievement.unlocked) {
                  window.dispatchEvent(new CustomEvent('enlightenment-clicked'))
                }
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          </li>
        ))}
      </ol>
      <p className='ach-line'>
        {focused ? (
          <>
            <b>{focused.name}</b> — {focused.unlocked ? focused.description : hintFor(focused)}
          </>
        ) : (
          `${achievements.length} things to find. Hover, focus or tap a tile for a hint.`
        )}
      </p>
      <button type='button' className='reset' onClick={handleReset}>
        RESET ACHIEVEMENTS
      </button>
    </div>
  )
}

function Readout({ isOpen }: { isOpen: boolean }) {
  const { scrollPercent, fps } = useConsoleStats(isOpen)
  const scene = useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-scene'] })
      return () => observer.disconnect()
    },
    () => document.documentElement.dataset.scene ?? 'hero',
    () => 'hero',
  )

  return (
    <div className='pane'>
      <h3 className='caps'>Readout</h3>
      <dl className='read'>
        <dt>scene</dt>
        <dd>{scene}</dd>
        <dt>scroll</dt>
        <dd>{scrollPercent}%</dd>
        <dt>fps</dt>
        <dd>{fps ?? '–'}</dd>
        <dt>keys</dt>
        <dd>D · 0–3 · Esc</dd>
      </dl>
    </div>
  )
}

/** Sliders and presets (generated from the orb setting definitions), the 16 tiles and the readout. */
export function ConsoleControls({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <Lights />
      <Achievements />
      <Readout isOpen={isOpen} />
    </>
  )
}
