import confetti from 'canvas-confetti'

/** Module-level holder for the canvas-bound confetti function – set after canvas mounts */
let canvasFire: ((opts: confetti.Options) => Promise<null> | null) | null = null

/** Realistic dual-cannon + top-shower casino confetti burst via canvas-confetti */
export function fireCasinoConfetti() {
  const fire = (opts: confetti.Options) => (canvasFire ? canvasFire(opts) : confetti(opts))
  const COLORS = ['#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#e5e7eb']

  // Cannon burst – both sides simultaneously
  fire({
    particleCount: 140,
    angle: 60,
    spread: 70,
    startVelocity: 60,
    decay: 0.92,
    gravity: 1.1,
    ticks: 350,
    origin: { x: 0, y: 0.78 },
    colors: COLORS,
  })
  fire({
    particleCount: 140,
    angle: 120,
    spread: 70,
    startVelocity: 60,
    decay: 0.92,
    gravity: 1.1,
    ticks: 350,
    origin: { x: 1, y: 0.78 },
    colors: COLORS,
  })

  // Top shower
  setTimeout(() => {
    fire({
      particleCount: 100,
      spread: 150,
      startVelocity: 30,
      decay: 0.9,
      gravity: 0.7,
      ticks: 400,
      origin: { x: 0.5, y: 0 },
      colors: COLORS,
      scalar: 1.2,
    })
  }, 220)

  // Gold second wave
  setTimeout(() => {
    fire({
      particleCount: 90,
      angle: 60,
      spread: 60,
      startVelocity: 50,
      origin: { x: 0, y: 0.88 },
      colors: ['#fbbf24', '#f59e0b'],
      ticks: 300,
    })
    fire({
      particleCount: 90,
      angle: 120,
      spread: 60,
      startVelocity: 50,
      origin: { x: 1, y: 0.88 },
      colors: ['#fbbf24', '#f59e0b'],
      ticks: 300,
    })
  }, 500)

  // Final shimmer
  setTimeout(() => {
    fire({
      particleCount: 60,
      spread: 180,
      startVelocity: 20,
      decay: 0.88,
      gravity: 0.5,
      ticks: 350,
      origin: { x: Math.random(), y: 0.2 },
      colors: COLORS,
      scalar: 0.9,
    })
  }, 900)
}

/** Bind canvas-confetti to a dedicated canvas so confetti renders above all overlays (DevConsole z:130). */
export function bindConfettiCanvas(canvas: HTMLCanvasElement) {
  const instance = confetti.create(canvas, { resize: true, useWorker: false })
  canvasFire = instance

  return () => {
    instance.reset()
    canvasFire = null
  }
}
