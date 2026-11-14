// style-boundary-ignore-file: dynamic orbR/orbG/orbB RGB values computed from React state – inline styles are unavoidable here
'use client'

import { OrbControls, OrbResetButton } from '@/components/features/devtools/orb-controls'

type ConsoleStatsControlsProps = {
  scrollPercent: number
  orbR: number
  orbG: number
  orbB: number
  fps: number
  isMobile: boolean
  scale: number
  onScaleChange: (scale: number) => void
  onResetAchievements: () => void
}

export function ConsoleStatsControls({
  scrollPercent,
  orbR,
  orbG,
  orbB,
  fps,
  isMobile,
  scale,
  onScaleChange,
  onResetAchievements,
}: ConsoleStatsControlsProps) {
  return (
    <>
      <div className='flex items-center justify-between'>
        <span className='text-gray-400'>SCROLL:</span>
        <div className='flex items-center gap-2'>
          <div className='h-1.5 w-24 overflow-hidden rounded-full bg-gray-800'>
            <div
              className='h-full rounded-full transition-all'
              style={{
                width: `${scrollPercent}%`,
                background: `linear-gradient(90deg, rgb(${orbR}, ${orbG}, ${orbB}), rgba(${orbR}, ${orbG}, ${orbB}, 0.6))`,
              }}
            />
          </div>
          <span className='w-12 text-right text-white tabular-nums'>{scrollPercent.toFixed(1)}%</span>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-gray-400'>ORB_RGB:</span>
        <div className='flex gap-2 text-white tabular-nums'>
          <span style={{ color: `rgb(255, ${orbG}, ${orbB})` }}>{orbR.toString().padStart(3, '0')}</span>
          <span style={{ color: `rgb(${orbR}, 255, ${orbB})` }}>{orbG.toString().padStart(3, '0')}</span>
          <span style={{ color: `rgb(${orbR}, ${orbG}, 255)` }}>{orbB.toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-gray-400'>COLOR:</span>
        <div
          className='h-6 w-32 rounded border-2 border-gray-700'
          style={{
            background: `rgb(${orbR}, ${orbG}, ${orbB})`,
            boxShadow: `0 0 10px rgba(${orbR}, ${orbG}, ${orbB}, 0.5)`,
          }}
        />
      </div>

      <div className='flex items-center justify-between'>
        <span className='text-gray-400'>FPS:</span>
        <span
          className='text-white tabular-nums'
          style={{ color: fps < 30 ? '#ef4444' : fps < 50 ? '#f59e0b' : '#10b981' }}
        >
          {fps}
        </span>
      </div>

      <div
        className='my-3 border-t-2 border-gray-800'
        style={{ borderColor: `rgba(${orbR}, ${orbG}, ${orbB}, 0.3)` }}
      />

      <div className='space-y-3'>
        <div className='text-sm tracking-wider text-gray-400 uppercase'>⚙️ Controls</div>

        <OrbControls accent={`rgb(${orbR}, ${orbG}, ${orbB})`} />

        {!isMobile && (
          <div>
            <div className='mb-1 flex items-center justify-between'>
              <span className='text-[12px] text-gray-400'>CONSOLE SCALE:</span>
              <span className='text-[12px] text-white tabular-nums'>{(scale * 100).toFixed(0)}%</span>
            </div>
            <input
              type='range'
              min='0.4'
              max='1.2'
              step='0.05'
              value={scale}
              onChange={(e) => {
                const newScale = parseFloat(e.target.value)
                onScaleChange(newScale)
              }}
              className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-800'
              style={{
                accentColor: `rgb(${orbR}, ${orbG}, ${orbB})`,
              }}
            />
          </div>
        )}

        <OrbResetButton />

        <button
          type='button'
          onClick={() => {
            if (confirm('⚠️ Reset all achievements? This cannot be undone!')) {
              onResetAchievements()
            }
          }}
          className='w-full cursor-pointer rounded border border-red-700 px-3 py-1.5 text-[12px] text-red-400 transition-all hover:border-red-500 hover:text-red-300'
        >
          RESET ACHIEVEMENTS
        </button>
      </div>
    </>
  )
}
