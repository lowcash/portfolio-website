import { expect, test } from '@playwright/test'

test.describe('Mobile devtools visuals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('mobile orb centers are spread across viewport width', async ({ page }) => {
    await page.waitForTimeout(1800)

    const orbSpread = await page.evaluate(() => {
      const orbElements = Array.from(document.querySelectorAll('.orb-1, .orb-2, .orb-3, .orb-4, .orb-5, .orb-6'))
      const centers = orbElements
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return ((rect.left + rect.width / 2) / window.innerWidth) * 100
        })
        .filter((value) => Number.isFinite(value))

      const leftCount = centers.filter((x) => x < 40).length
      const rightCount = centers.filter((x) => x > 60).length

      const minX = centers.length > 0 ? Math.min(...centers) : 0
      const maxX = centers.length > 0 ? Math.max(...centers) : 0

      return { leftCount, rightCount, centers, minX, maxX }
    })

    expect(orbSpread.leftCount).toBeGreaterThanOrEqual(1)
    expect(orbSpread.rightCount).toBeGreaterThanOrEqual(2)
    expect(orbSpread.maxX - orbSpread.minX).toBeGreaterThanOrEqual(35)
  })
})
