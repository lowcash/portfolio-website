// style-boundary-ignore-file: accent color derives from the live orb RGB passed in as props – inline styles are unavoidable here
import { useSyncExternalStore } from 'react'

import {
  ORB_PRESETS,
  ORB_SETTING_DEFINITIONS,
  type OrbSettingDefinition,
  type OrbSettingGroup,
  applyOrbPreset,
  getOrbSettings,
  getServerOrbSettings,
  matchesPreset,
  resetOrbSettings,
  setOrbSetting,
  subscribeToOrbSettings,
} from '@/lib/orb-settings'

const GROUPS: ReadonlyArray<{ id: OrbSettingGroup; title: string }> = [
  { id: 'motion', title: 'Motion' },
  { id: 'look', title: 'Look' },
  { id: 'color', title: 'Color' },
  { id: 'effects', title: 'Effects' },
]

type AccentProps = {
  /** CSS color of the live orb, used to tint sliders and highlights */
  accent: string
}

function SettingSlider({
  definition,
  value,
  accent,
}: AccentProps & { definition: OrbSettingDefinition; value: number }) {
  return (
    <div>
      <div className='mb-1 flex items-center justify-between'>
        <label htmlFor={`orb-setting-${definition.key}`} className='text-[12px] text-gray-400'>
          {definition.label}:
        </label>
        <span className='text-[12px] text-white tabular-nums'>{definition.format(value)}</span>
      </div>
      <input
        id={`orb-setting-${definition.key}`}
        type='range'
        min={definition.min}
        max={definition.max}
        step={definition.step}
        value={value}
        aria-describedby={`orb-setting-${definition.key}-hint`}
        onChange={(event) => setOrbSetting(definition.key, parseFloat(event.target.value))}
        className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
        style={{ accentColor: accent }}
      />
      <p id={`orb-setting-${definition.key}-hint`} className='mt-1 text-[10px] leading-tight text-gray-600'>
        {definition.hint}
      </p>
    </div>
  )
}

function SettingToggle({
  definition,
  value,
  accent,
}: AccentProps & { definition: OrbSettingDefinition; value: number }) {
  const isOn = value >= 1

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span id={`orb-setting-${definition.key}-label`} className='text-[12px] text-gray-400'>
          {definition.label}:
        </span>
        <button
          type='button'
          role='switch'
          aria-checked={isOn}
          aria-labelledby={`orb-setting-${definition.key}-label`}
          aria-describedby={`orb-setting-${definition.key}-hint`}
          onClick={() => setOrbSetting(definition.key, isOn ? 0 : 1)}
          className='cursor-pointer rounded border px-2 py-0.5 text-[11px] tabular-nums transition-colors'
          style={
            isOn ? { borderColor: accent, color: accent } : { borderColor: 'rgb(55 65 81)', color: 'rgb(156 163 175)' }
          }
        >
          {definition.format(value)}
        </button>
      </div>
      <p id={`orb-setting-${definition.key}-hint`} className='mt-1 text-[10px] leading-tight text-gray-600'>
        {definition.hint}
      </p>
    </div>
  )
}

export function OrbPresets({ accent }: AccentProps) {
  const settings = useSyncExternalStore(subscribeToOrbSettings, getOrbSettings, getServerOrbSettings)

  return (
    <div>
      <div className='mb-1 text-[12px] text-gray-400'>PRESETS:</div>
      <div className='flex flex-wrap gap-1.5'>
        {ORB_PRESETS.map((preset) => {
          const isActive = matchesPreset(settings, preset)

          return (
            <button
              key={preset.id}
              type='button'
              title={preset.description}
              aria-pressed={isActive}
              onClick={() => applyOrbPreset(preset)}
              className='cursor-pointer rounded border px-2.5 py-1 text-[11px] transition-colors hover:text-white'
              style={
                isActive
                  ? { borderColor: accent, color: accent }
                  : { borderColor: 'rgb(55 65 81)', color: 'rgb(156 163 175)' }
              }
            >
              {preset.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function OrbControls({ accent }: AccentProps) {
  const settings = useSyncExternalStore(subscribeToOrbSettings, getOrbSettings, getServerOrbSettings)

  return (
    <div className='space-y-3'>
      <OrbPresets accent={accent} />

      {GROUPS.map((group) => (
        <div key={group.id} className='space-y-3'>
          <div className='pt-1 text-[11px] tracking-wider text-gray-600 uppercase'>{group.title}</div>
          {ORB_SETTING_DEFINITIONS.filter((definition) => definition.group === group.id).map((definition) =>
            definition.kind === 'toggle' ? (
              <SettingToggle
                key={definition.key}
                definition={definition}
                value={settings[definition.key]}
                accent={accent}
              />
            ) : (
              <SettingSlider
                key={definition.key}
                definition={definition}
                value={settings[definition.key]}
                accent={accent}
              />
            ),
          )}
        </div>
      ))}
    </div>
  )
}

export function OrbResetButton() {
  return (
    <button
      type='button'
      onClick={resetOrbSettings}
      className='w-full cursor-pointer rounded border border-gray-700 px-3 py-1.5 text-[12px] text-gray-400 transition-all hover:border-gray-500 hover:text-white'
    >
      RESET TO DEFAULT
    </button>
  )
}
