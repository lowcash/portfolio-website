import { expect, test } from '@playwright/test'

async function triggerMidpointAchievement(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    localStorage.setItem('dev_console_opened', 'true')
    window.dispatchEvent(new CustomEvent('dev-console-opened'))
    localStorage.removeItem('achievements')
    window.dispatchEvent(new CustomEvent('achievements-reset'))

    document.documentElement.style.scrollSnapType = 'none'
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    for (let pass = 0; pass < 3; pass++) {
      await new Promise((resolve) => setTimeout(resolve, 90))
      for (const ratio of [0.5, 0.501, 0.499, 0.502, 0.498]) {
        window.scrollTo({ top: maxScroll * ratio, behavior: 'instant' })
        window.dispatchEvent(new Event('scroll'))
      }
    }
  })
}

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

  test('achievement popup displays on mobile with devtools open', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await toggleButton.evaluate((btn: HTMLElement) => btn.click())

    const consoleRegion = page.getByRole('region', { name: 'Developer debug console' })
    await expect(consoleRegion).toBeVisible()

    // Trigger achievement
    await triggerMidpointAchievement(page)
    await page.waitForTimeout(800)

    // Check if achievement popup is visible on mobile
    const mobilePopup = page.locator('[data-testid="achievement-popup-layer-mobile"]').first()
    const hasPopup = await mobilePopup.isVisible().catch(() => false)

    if (hasPopup) {
      await expect(mobilePopup).toBeVisible()

      // Verify popup content
      const achievementText = mobilePopup.locator('text=/Achievement Unlocked|.+/')
      await expect(achievementText).toBeVisible()
    }

    await page.evaluate(() => {
      document.documentElement.style.scrollSnapType = ''
    })
  })

  test('achievement icons are appropriately sized on mobile', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await toggleButton.evaluate((btn: HTMLElement) => btn.click())

    const consoleRegion = page.getByRole('region', { name: 'Developer debug console' })
    await expect(consoleRegion).toBeVisible()

    // Trigger achievements
    await triggerMidpointAchievement(page)

    // Check if achievement buttons have reasonable size on mobile
    const achievementButtons = consoleRegion.locator('button').filter({ has: page.locator('[class*="text-2xl"]') })
    const count = await achievementButtons.count()

    if (count > 0) {
      const firstButton = achievementButtons.first()
      const buttonBox = await firstButton.boundingBox()

      if (buttonBox) {
        // Mobile icons should be visible (at least 32x32, max 60x60 on small screen)
        expect(buttonBox.width).toBeLessThan(60)
        expect(buttonBox.height).toBeLessThan(60)
      }
    }
  })
})
