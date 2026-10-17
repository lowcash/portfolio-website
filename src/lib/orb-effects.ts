/**
 * Interactive background effects: magnetism (pointer / device tilt), section burst, click ripples, and the
 * animation speed control. Everything is driven by CSS custom properties or the Web Animations API so React never
 * re-renders, and every effect is a no-op while its setting is 0 or the visitor prefers reduced motion.
 */
import { DEFAULT_ORB_SETTINGS, getOrbSettings, subscribeToOrbSettings } from '@/lib/orb-settings'

// Time constant of the pointer easing (about 8% per 60fps frame), applied per elapsed time so low fps feels the same
const POINTER_EASING_MS = 190
const POINTER_EPSILON = 0.001
const BURST_DURATION_MS = 1100
const BURST_STAGGER_MS = 45
const RIPPLE_DURATION_MS = 950
const RIPPLE_PUSH_PX = 150
const RIPPLE_IGNORED_TARGETS = 'a, button, input, select, textarea, label, summary, [role="button"], [role="slider"]'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const getOrbElements = () => Array.from(document.querySelectorAll<HTMLElement>('.orb'))
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

type PermissionedOrientationEvent = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }

/** CSS animation speed: durations are authored for the default speed, so scale the playback rate instead. */
function startAnimationRate() {
  const apply = () => {
    if (typeof CSSAnimation === 'undefined') {
      return
    }

    const rate = getOrbSettings().animationSpeed / DEFAULT_ORB_SETTINGS.animationSpeed

    for (const animation of document.getAnimations()) {
      if (animation instanceof CSSAnimation && animation.animationName.startsWith('orb-float')) {
        animation.playbackRate = rate
      }
    }
  }

  // Media queries swap the keyframes (desktop <-> mobile) which creates fresh animations at rate 1
  const viewportQuery = window.matchMedia('(max-width: 767.98px)')
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  const unsubscribe = subscribeToOrbSettings(apply)

  apply()
  viewportQuery.addEventListener('change', apply)
  reducedMotionQuery.addEventListener('change', apply)

  return () => {
    unsubscribe()
    viewportQuery.removeEventListener('change', apply)
    reducedMotionQuery.removeEventListener('change', apply)
  }
}

/** Eases a -1..1 pointer (or device tilt) position into --orb-pointer-x/y, which `.orb` turns into a translate. */
function startMagnetism() {
  const root = document.documentElement
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let frameId: number | null = null
  let hasAskedOrientationPermission = false

  let lastFrameAt = 0

  const tick = (now: number) => {
    frameId = null
    const elapsed = lastFrameAt === 0 ? 16 : Math.min(100, now - lastFrameAt)
    const easing = 1 - Math.exp(-elapsed / POINTER_EASING_MS)
    lastFrameAt = now
    currentX += (targetX - currentX) * easing
    currentY += (targetY - currentY) * easing

    const isSettled = Math.abs(targetX - currentX) < POINTER_EPSILON && Math.abs(targetY - currentY) < POINTER_EPSILON

    if (isSettled) {
      currentX = targetX
      currentY = targetY
    }

    root.style.setProperty('--orb-pointer-x', currentX.toFixed(4))
    root.style.setProperty('--orb-pointer-y', currentY.toFixed(4))

    if (isSettled) {
      lastFrameAt = 0
    } else {
      frameId = requestAnimationFrame(tick)
    }
  }

  const schedule = () => {
    if (frameId === null) {
      frameId = requestAnimationFrame(tick)
    }
  }

  const aim = (x: number, y: number) => {
    targetX = clamp(x, -1, 1)
    targetY = clamp(y, -1, 1)
    schedule()
  }

  const setTarget = (x: number, y: number) => {
    if (getOrbSettings().magnetism === 0 || prefersReducedMotion()) {
      return
    }

    aim(x, y)
  }

  // Preview when the setting changes: swing the orbs across the screen and back so the slider visibly does something
  const swingTimers: ReturnType<typeof setTimeout>[] = []
  const swing = () => {
    if (prefersReducedMotion()) {
      return
    }

    swingTimers.forEach(clearTimeout)
    swingTimers.length = 0
    ;[
      [0, 0.9, -0.7],
      [450, -0.9, 0.7],
      [900, 0, 0],
    ].forEach(([delay, x, y]) => swingTimers.push(setTimeout(() => aim(x, y), delay)))
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      return
    }

    setTarget((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
  }

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.gamma === null || event.beta === null) {
      return
    }

    // Holding a phone upright is ~45deg beta; 30deg of tilt reaches the full range
    setTarget(event.gamma / 30, (event.beta - 45) / 30)
  }

  // iOS only delivers tilt after an explicit permission prompt, which must come from a user gesture
  const handlePointerDown = (event: PointerEvent) => {
    const OrientationEvent = window.DeviceOrientationEvent as PermissionedOrientationEvent | undefined

    if (
      event.pointerType !== 'touch' ||
      hasAskedOrientationPermission ||
      getOrbSettings().magnetism === 0 ||
      typeof OrientationEvent?.requestPermission !== 'function'
    ) {
      return
    }

    hasAskedOrientationPermission = true
    OrientationEvent.requestPermission().catch(() => {})
  }

  // Settings turned off -> glide back home
  const unsubscribe = subscribeToOrbSettings(() => {
    if (getOrbSettings().magnetism === 0 && (targetX !== 0 || targetY !== 0)) {
      targetX = 0
      targetY = 0
      schedule()
    }
  })

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerdown', handlePointerDown, { passive: true })
  window.addEventListener('deviceorientation', handleOrientation)

  const stop = () => {
    unsubscribe()
    swingTimers.forEach(clearTimeout)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerdown', handlePointerDown)
    window.removeEventListener('deviceorientation', handleOrientation)

    if (frameId !== null) {
      cancelAnimationFrame(frameId)
    }

    root.style.removeProperty('--orb-pointer-x')
    root.style.removeProperty('--orb-pointer-y')
  }

  return { stop, swing }
}

function burstOrbs(intensity: number) {
  getOrbElements().forEach((orb, index) => {
    orb.animate([{ scale: 1 }, { scale: 1 + 0.5 * intensity }, { scale: 1 }], {
      duration: BURST_DURATION_MS,
      delay: index * BURST_STAGGER_MS,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    })
  })
}

/** Pulses the orbs whenever a different page section becomes the dominant one. */
function startSectionBurst() {
  const sections = document.querySelectorAll<HTMLElement>('section[id]')
  let currentSectionId: string | null = null

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.target.id === currentSectionId) {
          continue
        }

        const isFirstSection = currentSectionId === null
        currentSectionId = entry.target.id
        const { burst } = getOrbSettings()

        if (!isFirstSection && burst > 0 && !prefersReducedMotion()) {
          burstOrbs(burst / 100)
        }
      }
    },
    { threshold: 0.55 },
  )

  sections.forEach((section) => observer.observe(section))

  return () => observer.disconnect()
}

/** Expanding ring from the click point; nearby orbs get shoved away from it and settle back. */
function startRipples(layer: HTMLElement) {
  const spawnRipple = (x: number, y: number) => {
    const ring = document.createElement('div')
    ring.className = 'orb-ripple'
    ring.style.left = `${x}px`
    ring.style.top = `${y}px`
    layer.appendChild(ring)

    const animation = ring.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0.05)', opacity: 0.7 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
      ],
      { duration: RIPPLE_DURATION_MS, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    )
    animation.onfinish = () => ring.remove()

    for (const orb of getOrbElements()) {
      const rect = orb.getBoundingClientRect()
      const dx = rect.left + rect.width / 2 - x
      const dy = rect.top + rect.height / 2 - y
      const distance = Math.hypot(dx, dy) || 1
      const push = RIPPLE_PUSH_PX / (1 + distance / 350)

      orb.animate(
        [{ translate: `${(dx / distance) * push}px ${(dy / distance) * push}px` }, { translate: '0px 0px' }],
        { duration: RIPPLE_DURATION_MS * 1.6, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', composite: 'add' },
      )
    }
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (
      getOrbSettings().ripples < 1 ||
      prefersReducedMotion() ||
      (event.target instanceof Element && event.target.closest(RIPPLE_IGNORED_TARGETS))
    ) {
      return
    }

    spawnRipple(event.clientX, event.clientY)
  }

  window.addEventListener('pointerdown', handlePointerDown, { passive: true })

  return {
    stop: () => window.removeEventListener('pointerdown', handlePointerDown),
    spawn: spawnRipple,
  }
}

const PREVIEW_COOLDOWN_MS = 500

/**
 * Burst, ripples and magnetism react to events (a new section, a click, the cursor), so dragging their slider shows
 * nothing by itself. Play a short demo whenever one of them is changed.
 */
function startSettingPreviews(previews: { burst: (intensity: number) => void; ripple: () => void; swing: () => void }) {
  let previous = getOrbSettings()
  let lastPreviewAt = 0

  return subscribeToOrbSettings(() => {
    const next = getOrbSettings()
    const now = performance.now()
    const canPreview = now - lastPreviewAt > PREVIEW_COOLDOWN_MS && !prefersReducedMotion()

    if (canPreview) {
      if (next.burst !== previous.burst && next.burst > 0) {
        lastPreviewAt = now
        previews.burst(next.burst / 100)
      } else if (next.ripples > previous.ripples) {
        lastPreviewAt = now
        previews.ripple()
      } else if (next.magnetism !== previous.magnetism && next.magnetism > 0) {
        lastPreviewAt = now
        previews.swing()
      }
    }

    previous = next
  })
}

/** Starts every background effect. `rippleLayer` is the element ripple rings are appended to. */
export function startOrbEffects(rippleLayer: HTMLElement) {
  const magnetism = startMagnetism()
  const ripples = startRipples(rippleLayer)
  const stops = [
    startAnimationRate(),
    magnetism.stop,
    startSectionBurst(),
    ripples.stop,
    startSettingPreviews({
      burst: burstOrbs,
      ripple: () => ripples.spawn(window.innerWidth / 2, window.innerHeight / 2),
      swing: magnetism.swing,
    }),
  ]

  return () => stops.forEach((stop) => stop())
}
