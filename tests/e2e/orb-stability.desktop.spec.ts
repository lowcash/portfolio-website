import { expect, test } from '@playwright/test'

/** The lights are ambient: scrolling the whole page must never move one across the screen. */
test.describe('Orb stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('max displacement of every light while scrolling the whole page is a few percent of the viewport', async ({
    page,
  }) => {
    const centres = () =>
      page.locator('.orb').evaluateAll((els) =>
        els.map((element) => {
          const r = element.getBoundingClientRect()
          return [r.x + r.width / 2, r.y + r.height / 2]
        }),
      )
    const start = await centres()
    const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
    let maxX = 0
    let maxY = 0

    for (let step = 0; step <= 10; step += 1) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), (total * step) / 10)
      await page.waitForTimeout(700)
      ;(await centres()).forEach(([x, y], index) => {
        maxX = Math.max(maxX, Math.abs(x - start[index][0]))
        maxY = Math.max(maxY, Math.abs(y - start[index][1]))
      })
    }

    console.log(`max orb displacement: ${maxX.toFixed(1)}px x, ${maxY.toFixed(1)}px y`)
    expect(maxX).toBeLessThan(1440 * 0.03)
    expect(maxY).toBeLessThan(900 * 0.03)
  })

  test('the lights drift subconsciously: 3-6.5% of the viewport, 44-60 s cycles, smooth, never still', async ({
    page,
  }) => {
    const centres = () =>
      page.locator('.orb i').evaluateAll((els) =>
        els.map((element) => {
          const r = element.getBoundingClientRect()
          return [r.x + r.width / 2, r.y + r.height / 2]
        }),
      )

    // Real time: non-zero but tiny, and no frame ever jumps
    const first = await centres()
    let previous = first
    let maxStep = 0
    let maxFromStart = 0

    for (let sample = 0; sample < 16; sample += 1) {
      await page.waitForTimeout(250)
      const current = await centres()
      current.forEach(([x, y], index) => {
        maxStep = Math.max(maxStep, Math.hypot(x - previous[index][0], y - previous[index][1]))
        maxFromStart = Math.max(maxFromStart, Math.hypot(x - first[index][0], y - first[index][1]))
      })
      previous = current
    }

    console.log(
      `real time, 4 s: max step per 250 ms ${maxStep.toFixed(2)}px, max from start ${maxFromStart.toFixed(2)}px`,
    )
    expect(maxFromStart).toBeGreaterThan(0.2)
    expect(maxStep).toBeLessThan(4)

    // A whole cycle (animations scrubbed): excursion per light in % of the viewport
    const sweep = await page.evaluate(() => {
      const drift = document
        .getAnimations()
        .filter((animation) => animation instanceof CSSAnimation && animation.animationName.startsWith('drift'))
      const cycles = drift.map((animation) => (animation.effect!.getTiming().duration as number) / 1000)
      const orbs = [...document.querySelectorAll('.orb i')]
      const lo = orbs.map(() => [Infinity, Infinity])
      const hi = orbs.map(() => [-Infinity, -Infinity])
      let maxScrubStep = 0
      let last: number[][] | null = null

      for (let second = 0; second <= 180; second += 1) {
        drift.forEach((animation) => {
          animation.pause()
          animation.currentTime = second * 1000
        })
        const now = orbs.map((element) => {
          const r = element.getBoundingClientRect()
          return [r.x + r.width / 2, r.y + r.height / 2]
        })
        now.forEach(([x, y], index) => {
          lo[index] = [Math.min(lo[index][0], x), Math.min(lo[index][1], y)]
          hi[index] = [Math.max(hi[index][0], x), Math.max(hi[index][1], y)]
          if (last) {
            maxScrubStep = Math.max(maxScrubStep, Math.hypot(x - last[index][0], y - last[index][1]))
          }
        })
        last = now
      }

      return {
        shortest: Math.min(...cycles) * 1,
        longest: Math.max(...cycles) * 1,
        halfX: orbs.map((_, index) => (hi[index][0] - lo[index][0]) / 2 / innerWidth),
        halfY: orbs.map((_, index) => (hi[index][1] - lo[index][1]) / 2 / innerHeight),
        maxScrubStep,
      }
    })

    console.log(
      `excursion x ${sweep.halfX.map((v) => (v * 100).toFixed(1))}% y ${sweep.halfY.map((v) => (v * 100).toFixed(1))}%, max 1 s step ${sweep.maxScrubStep.toFixed(1)}px`,
    )
    expect(sweep.shortest).toBeGreaterThanOrEqual(40)
    expect(sweep.longest).toBeLessThanOrEqual(60)

    for (const fraction of [...sweep.halfX, ...sweep.halfY]) {
      expect(fraction).toBeGreaterThanOrEqual(0.03)
      expect(fraction).toBeLessThanOrEqual(0.065)
    }
    // Gentle: never more than ~20 px of travel in one second (measured: about 10)
    expect(sweep.maxScrubStep).toBeLessThan(20)
  })

  test('hovering links and entries does not animate a line', async ({ page }) => {
    const targets = page.locator('.entry, a.mail')
    const count = await targets.count()

    for (let index = 0; index < count; index += 1) {
      const target = targets.nth(index)
      await target.scrollIntoViewIfNeeded()
      await target.hover()
      await page.waitForTimeout(50)
      const running = await page.evaluate(() =>
        document
          .getAnimations()
          .filter((animation) => {
            const name = (animation as CSSTransition).transitionProperty ?? ''
            return (
              animation instanceof CSSTransition && /transform|background-size|background-position|width/.test(name)
            )
          })
          .map((animation) => (animation as CSSTransition).transitionProperty),
      )
      expect(running).toEqual([])
    }
  })
})
