'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { AchievementToast } from './achievement-toast'
import { ClickParticles } from './click-particles'
import { bindConfettiCanvas, fireCasinoConfetti } from './confetti'
import { EnlightenedAtmosphere } from './enlightened-atmosphere'
import { useIdleAchievement, useRepeatVisitor, useSettingsTinkerer, useShake } from './triggers/behavior-triggers'
import {
  type ClickParticle,
  useCopyCat,
  useNavigationInteractions,
  useRapidClicker,
  useTripleClickLogo,
} from './triggers/click-triggers'
import {
  useMarathonRunner,
  usePerfectlyBalanced,
  useSectionExploration,
  useSpeedReader,
} from './triggers/scroll-triggers'
import { useAchievementState } from './use-achievement-state'

// false on the server and during hydration, true afterwards: avoids a hydration mismatch for localStorage-derived UI
const subscribeToNothing = () => () => {}

/**
 * Easter eggs and achievements. Detection lives in ./triggers; unlock/persistence/popup
 * live in useAchievementState. This component mounts triggers and overlays.
 */
export function EasterEggs() {
  const { achievements, achievementsEnabled, showAchievement, isHidingAchievement, unlockAchievementRef } =
    useAchievementState()

  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<ClickParticle[]>([])

  const spawnParticle = useCallback((particle: ClickParticle) => {
    setParticles((prev) => [...prev, particle])

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particle.id))
    }, 1000)
  }, [])

  useTripleClickLogo(achievementsEnabled, unlockAchievementRef)
  usePerfectlyBalanced(achievementsEnabled, unlockAchievementRef)
  useIdleAchievement(achievementsEnabled, unlockAchievementRef)
  useRapidClicker(achievementsEnabled, unlockAchievementRef, spawnParticle)
  useCopyCat(achievementsEnabled, unlockAchievementRef)
  useShake(achievementsEnabled, unlockAchievementRef)
  useSectionExploration(achievementsEnabled, unlockAchievementRef)
  useSettingsTinkerer(achievementsEnabled, unlockAchievementRef)
  useNavigationInteractions(achievementsEnabled, unlockAchievementRef)
  useMarathonRunner(achievementsEnabled, unlockAchievementRef)
  useSpeedReader(achievementsEnabled, unlockAchievementRef)
  useRepeatVisitor(achievementsEnabled, unlockAchievementRef)

  const mounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )

  const enlightenmentUnlocked = mounted && (achievements.find((a) => a.id === 'enlightenment')?.unlocked ?? false)

  useEffect(() => {
    return confettiCanvasRef.current ? bindConfettiCanvas(confettiCanvasRef.current) : undefined
  }, [])

  useEffect(() => {
    const handleConsoleCelebrate = () => fireCasinoConfetti()
    window.addEventListener('enlightenment-clicked', handleConsoleCelebrate)
    return () => window.removeEventListener('enlightenment-clicked', handleConsoleCelebrate)
  }, [])

  return (
    <>
      <canvas
        ref={confettiCanvasRef}
        aria-hidden='true'
        className='pointer-events-none fixed inset-0'
        style={{ zIndex: 200, width: '100%', height: '100%' }}
      />

      <AchievementToast achievement={showAchievement} isHiding={isHidingAchievement} />

      <ClickParticles particles={particles} />

      <EnlightenedAtmosphere active={enlightenmentUnlocked} />
    </>
  )
}
