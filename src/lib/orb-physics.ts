/**
 * Pure physics of the lights: a damped spring per axis, bounded, integrated in fixed sub-steps so the result does not
 * depend on the frame rate. No DOM in here (see orb-effects.ts for the loop that applies it).
 */

export type Spring = { x: number; y: number; vx: number; vy: number }

export type SpringTarget = { x: number; y: number }

/** Spring stiffness (1/s^2): about 0.85 Hz natural frequency, so the lights react softly rather than snap */
const STIFFNESS = 28
/** Hard bound on the displacement of a light from its scene position, in px */
export const MAX_OFFSET_PX = 90
/** Largest frame time that is simulated; a stalled tab must not catapult the lights */
const MAX_FRAME_S = 1 / 20
const SUB_STEP_S = 1 / 120
const REST_POSITION_PX = 0.05
const REST_VELOCITY_PX = 0.05

const clamp = (value: number, limit: number) => Math.min(limit, Math.max(-limit, value))

export const createSpring = (): Spring => ({ x: 0, y: 0, vx: 0, vy: 0 })

/** Advances the spring by `elapsedSeconds` towards `target`. `damping` is the damping ratio (1 = critical). */
export function stepSpring(spring: Spring, target: SpringTarget, damping: number, elapsedSeconds: number) {
  const drag = 2 * damping * Math.sqrt(STIFFNESS)
  let remaining = Math.min(MAX_FRAME_S, Math.max(0, elapsedSeconds))

  while (remaining > 1e-6) {
    const dt = Math.min(SUB_STEP_S, remaining)
    remaining -= dt

    spring.vx += (STIFFNESS * (target.x - spring.x) - drag * spring.vx) * dt
    spring.vy += (STIFFNESS * (target.y - spring.y) - drag * spring.vy) * dt
    spring.x = clamp(spring.x + spring.vx * dt, MAX_OFFSET_PX)
    spring.y = clamp(spring.y + spring.vy * dt, MAX_OFFSET_PX)
  }
}

export function isAtRest(spring: Spring, target: SpringTarget) {
  return (
    Math.abs(spring.x - target.x) < REST_POSITION_PX &&
    Math.abs(spring.y - target.y) < REST_POSITION_PX &&
    Math.abs(spring.vx) < REST_VELOCITY_PX &&
    Math.abs(spring.vy) < REST_VELOCITY_PX
  )
}

/** How far each light travels, in px at 100% strength (depth: the far light moves less) */
const LIGHT_DEPTH = [1, 0.7, 0.5] as const
const POINTER_REACH_PX = 70
const PARALLAX_REACH_PX = 80
/** Lights retreat from the cursor, so the page content is never chased by a glow */
const POINTER_DIRECTION = -1

type TargetInput = {
  /** Pointer position in -1..1 across the viewport */
  pointerX: number
  pointerY: number
  /** Scroll progress 0..1 */
  scrollProgress: number
  /** 0..100 */
  pointerStrength: number
  parallaxStrength: number
}

/** Where the spring of light `index` is pulled to, given pointer and scroll. */
export function resolveTarget(index: number, input: TargetInput): SpringTarget {
  const depth = LIGHT_DEPTH[index % LIGHT_DEPTH.length]
  const pointer = (input.pointerStrength / 100) * POINTER_REACH_PX * depth * POINTER_DIRECTION
  const parallax = (input.parallaxStrength / 100) * PARALLAX_REACH_PX * depth

  return {
    x: clamp(input.pointerX * pointer, MAX_OFFSET_PX),
    // Scrolling down drifts the lights up and back, centred on the middle of the page
    y: clamp(input.pointerY * pointer + (0.5 - input.scrollProgress) * 2 * parallax, MAX_OFFSET_PX),
  }
}

/** Velocity kick (px/s) for light `index` from a click at `-1..1` viewport coordinates: away from the click. */
export function resolveNudge(index: number, clickX: number, clickY: number): { vx: number; vy: number } {
  const depth = LIGHT_DEPTH[index % LIGHT_DEPTH.length]
  const NUDGE_SPEED_PX_S = 300
  const length = Math.hypot(clickX, clickY) || 1

  return { vx: (-clickX / length) * NUDGE_SPEED_PX_S * depth, vy: (-clickY / length) * NUDGE_SPEED_PX_S * depth }
}
