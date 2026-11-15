import { describe, expect, it } from 'vitest'

import { MAX_OFFSET_PX, createSpring, isAtRest, resolveNudge, resolveTarget, stepSpring } from './orb-physics'

const settle = (damping: number, seconds: number, target = { x: 40, y: 0 }) => {
  const spring = createSpring()
  let peak = 0

  for (let frame = 0; frame < seconds * 60; frame++) {
    stepSpring(spring, target, damping, 1 / 60)
    peak = Math.max(peak, spring.x)
  }

  return { spring, peak }
}

describe('stepSpring', () => {
  it('settles on the target', () => {
    const { spring } = settle(0.7, 8)

    expect(spring.x).toBeCloseTo(40, 1)
    expect(isAtRest(spring, { x: 40, y: 0 })).toBe(true)
  })

  it('overshoots when lightly damped and not when heavily damped', () => {
    expect(settle(0.2, 4).peak).toBeGreaterThan(48)
    expect(settle(1.5, 8).peak).toBeLessThanOrEqual(40.001)
  })

  it('does not depend on the frame rate', () => {
    const slow = createSpring()
    const fast = createSpring()

    for (let frame = 0; frame < 30; frame++) stepSpring(slow, { x: 40, y: 0 }, 0.7, 1 / 30)
    for (let frame = 0; frame < 120; frame++) stepSpring(fast, { x: 40, y: 0 }, 0.7, 1 / 120)

    expect(slow.x).toBeCloseTo(fast.x, 0)
  })

  it('stays bounded, whatever the target or a stalled frame', () => {
    const spring = createSpring()
    spring.vx = 1e6

    stepSpring(spring, { x: 1e6, y: -1e6 }, 0.2, 5)

    expect(Math.abs(spring.x)).toBeLessThanOrEqual(MAX_OFFSET_PX)
    expect(Math.abs(spring.y)).toBeLessThanOrEqual(MAX_OFFSET_PX)
  })
})

describe('resolveTarget', () => {
  const still = { pointerX: 0, pointerY: 0, scrollProgress: 0.5, pointerStrength: 100, parallaxStrength: 100 }

  it('rests at zero with the pointer centred and the page scrolled to the middle', () => {
    const target = resolveTarget(0, still)

    expect(target.x).toBeCloseTo(0)
    expect(target.y).toBeCloseTo(0)
  })

  it('gives way to the pointer, the nearer light further', () => {
    const near = resolveTarget(0, { ...still, pointerX: 1 })
    const far = resolveTarget(2, { ...still, pointerX: 1 })

    expect(near.x).toBeLessThan(0)
    expect(Math.abs(near.x)).toBeGreaterThan(Math.abs(far.x))
  })

  it('moves with scroll and not at all at 0% strength', () => {
    expect(resolveTarget(0, { ...still, scrollProgress: 1 }).y).toBeLessThan(0)
    expect(resolveTarget(0, { ...still, scrollProgress: 1, parallaxStrength: 0 }).y).toBeCloseTo(0)
    expect(resolveTarget(0, { ...still, pointerX: 1, pointerStrength: 0 }).x).toBeCloseTo(0)
  })

  it('never leaves the bound', () => {
    const target = resolveTarget(0, { ...still, pointerX: 1, pointerY: 1, scrollProgress: 0 })

    expect(Math.abs(target.x)).toBeLessThanOrEqual(MAX_OFFSET_PX)
    expect(Math.abs(target.y)).toBeLessThanOrEqual(MAX_OFFSET_PX)
  })
})

describe('resolveNudge', () => {
  it('kicks away from the click', () => {
    const { vx, vy } = resolveNudge(0, 1, 0)

    expect(vx).toBeLessThan(0)
    expect(vy).toBeCloseTo(0)
  })
})
