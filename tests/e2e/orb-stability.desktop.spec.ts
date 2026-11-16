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
