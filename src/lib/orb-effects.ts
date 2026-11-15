/**
 * Background effects: the drift speed (CSS animation playback rate) and the pointer physics. The physics is one
 * requestAnimationFrame loop for all three lights: a damped spring per light is pulled by the pointer (the lights give
 * way softly) and by the scroll position (parallax), and kicked by a click on the background. Only `translate` is
 * written, so nothing lays out or repaints; the loop sleeps when everything is at rest and while the tab is hidden.
 *
 * Fine pointer and motion allowed only: with `prefers-reduced-motion` or on touch devices the lights just drift (CSS),
 * which keeps phones cool.
 */
import {
  type Spring,
  type SpringTarget,
  createSpring,
  isAtRest,
  resolveNudge,
  resolveTarget,
  stepSpring,
} from '@/lib/orb-physics'
import { getOrbSettings, subscribeToOrbSettings } from '@/lib/orb-settings'
import { subscribeToScrollMetrics } from '@/lib/scroll-metrics'

const NUDGE_IGNORED_TARGETS = 'a, button, input, select, textarea, label, summary, [role="button"], [role="slider"]'
const PREVIEW_COOLDOWN_MS = 450
const PHYSICS_QUERY = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)'

const getOrbElements = () => Array.from(document.querySelectorAll<HTMLElement>('.orb'))

/** True where the pointer physics run (also used by the console to disable the sliders that depend on it). */
export const supportsOrbPhysics = () => typeof window !== 'undefined' && window.matchMedia(PHYSICS_QUERY).matches

export function subscribeToPhysicsSupport(onChange: () => void) {
  const query = window.matchMedia(PHYSICS_QUERY)
  query.addEventListener('change', onChange)

  return () => query.removeEventListener('change', onChange)
}

/** CSS animation speed: durations are authored for 1x, so scale the playback rate instead. */
function startAnimationRate() {
  const apply = () => {
    if (typeof CSSAnimation === 'undefined') {
      return
    }

    const rate = getOrbSettings().animationSpeed

    for (const animation of document.getAnimations()) {
      if (animation instanceof CSSAnimation && animation.animationName.startsWith('drift')) {
        animation.playbackRate = rate
      }
    }
  }

  // Toggling reduced motion creates fresh animations at rate 1
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const unsubscribe = subscribeToOrbSettings(apply)

  apply()
  reducedMotionQuery.addEventListener('change', apply)

  return () => {
    unsubscribe()
    reducedMotionQuery.removeEventListener('change', apply)
  }
}

function startPhysics() {
  const orbs = getOrbElements()
  const springs: Spring[] = orbs.map(createSpring)
  const targets: SpringTarget[] = orbs.map(() => ({ x: 0, y: 0 }))
  const written = orbs.map(() => ({ x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY }))
  let pointerX = 0
  let pointerY = 0
  let scrollProgress = 0
  let frameId: number | null = null
  let lastFrameAt = 0

  const refreshTargets = () => {
    const { pointer, parallax } = getOrbSettings()

    targets.forEach((target, index) => {
      Object.assign(
        target,
        resolveTarget(index, {
          pointerX,
          pointerY,
          scrollProgress,
          pointerStrength: pointer,
          parallaxStrength: parallax,
        }),
      )
    })
  }

  const tick = (now: number) => {
    frameId = null
    const elapsedSeconds = lastFrameAt === 0 ? 1 / 60 : (now - lastFrameAt) / 1000
    lastFrameAt = now
    const { damping } = getOrbSettings()
    let isResting = true

    orbs.forEach((orb, index) => {
      const spring = springs[index]
      stepSpring(spring, targets[index], damping, elapsedSeconds)

      if (!isAtRest(spring, targets[index])) {
        isResting = false
      }

      // Skip sub-pixel changes: nothing to repaint
      if (Math.abs(spring.x - written[index].x) > 0.01 || Math.abs(spring.y - written[index].y) > 0.01) {
        written[index] = { x: spring.x, y: spring.y }
        orb.style.translate = `${spring.x.toFixed(2)}px ${spring.y.toFixed(2)}px`
      }
    })

    if (isResting) {
      lastFrameAt = 0
    } else if (!document.hidden) {
      frameId = requestAnimationFrame(tick)
    }
  }

  const wake = () => {
    if (frameId === null && !document.hidden) {
      frameId = requestAnimationFrame(tick)
    }
  }

  const aim = () => {
    refreshTargets()
    wake()
  }

  const handlePointerMove = (event: PointerEvent) => {
    pointerX = (event.clientX / window.innerWidth) * 2 - 1
    pointerY = (event.clientY / window.innerHeight) * 2 - 1
    aim()
  }

  // The cursor left the window: let the lights settle back
  const handlePointerLeave = () => {
    pointerX = 0
    pointerY = 0
    aim()
  }

  const kick = (clickX: number, clickY: number) => {
    springs.forEach((spring, index) => {
      const { vx, vy } = resolveNudge(index, clickX, clickY)
      spring.vx += vx
      spring.vy += vy
    })
    wake()
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (!getOrbSettings().nudge || (event.target instanceof Element && event.target.closest(NUDGE_IGNORED_TARGETS))) {
      return
    }

    kick((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
  }

  const handleVisibility = () => {
    lastFrameAt = 0

    if (document.hidden) {
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    } else {
      wake()
    }
  }

  // Dragging a physics slider shows nothing until the cursor moves, so every change plays a short demo shove
  let previous = getOrbSettings()
  let lastPreviewAt = 0
  const unsubscribeSettings = subscribeToOrbSettings(() => {
    const next = getOrbSettings()
    const hasChanged =
      next.pointer !== previous.pointer ||
      next.damping !== previous.damping ||
      next.parallax !== previous.parallax ||
      next.nudge > previous.nudge
    previous = next
    aim()

    const now = performance.now()
    if (hasChanged && now - lastPreviewAt > PREVIEW_COOLDOWN_MS) {
      lastPreviewAt = now
      kick(0.9, 0.6)
    }
  })

  const unsubscribeScroll = subscribeToScrollMetrics((metrics) => {
    if (metrics.progress !== scrollProgress) {
      scrollProgress = metrics.progress
      aim()
    }
  })

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', handlePointerLeave)
  window.addEventListener('pointerdown', handlePointerDown, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)
  aim()

  return () => {
    unsubscribeSettings()
    unsubscribeScroll()
    window.removeEventListener('pointermove', handlePointerMove)
    document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
    window.removeEventListener('pointerdown', handlePointerDown)
    document.removeEventListener('visibilitychange', handleVisibility)

    if (frameId !== null) {
      cancelAnimationFrame(frameId)
    }

    orbs.forEach((orb) => orb.style.removeProperty('translate'))
  }
}

/** Starts the background effects; follows the pointer/motion media query so the physics come and go with it. */
export function startOrbEffects() {
  const stopRate = startAnimationRate()
  const query = window.matchMedia(PHYSICS_QUERY)
  let stopPhysics: (() => void) | null = null

  const sync = () => {
    if (query.matches && !stopPhysics) {
      stopPhysics = startPhysics()
    } else if (!query.matches && stopPhysics) {
      stopPhysics()
      stopPhysics = null
    }
  }

  sync()
  query.addEventListener('change', sync)

  return () => {
    query.removeEventListener('change', sync)
    stopPhysics?.()
    stopRate()
  }
}
