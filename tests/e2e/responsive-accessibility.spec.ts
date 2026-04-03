import { type Page, expect, test } from '@playwright/test'

async function getCardBoxes(page: Page) {
  await page.locator('#tech-journey').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  const cards = page.locator('#tech-journey article')
  await expect(cards).toHaveCount(5)

  const first = await cards.nth(0).boundingBox()
  const second = await cards.nth(1).boundingBox()

  expect(first).not.toBeNull()
  expect(second).not.toBeNull()

  return { first, second }
}

test.describe('Responsive and accessibility baseline', () => {
  test('tech stack cards collapse to one column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { first, second } = await getCardBoxes(page)

    if (first && second) {
      expect(Math.abs(first.x - second.x)).toBeLessThan(10)
      expect(second.y).toBeGreaterThan(first.y + first.height * 0.5)
    }
  })

  test('tech stack cards use multiple columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { first, second } = await getCardBoxes(page)

    if (first && second) {
      expect(Math.abs(first.x - second.x)).toBeGreaterThan(80)
    }
  })

  test('skip link targets main content landmark', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: 'Skip to content' })
    await expect(skipLink).toBeVisible()

    await skipLink.press('Enter')

    await expect(page.locator('#main-content')).toHaveAttribute('role', 'main')
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#main-content')
  })

  test('reduced motion preference disables smooth scrolling behavior', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)
    expect(scrollBehavior).toBe('auto')
  })
})
