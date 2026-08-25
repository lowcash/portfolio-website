import { type Page, expect, test } from '@playwright/test'

async function getCardBoxes(page: Page) {
  await page.locator('#featured-projects').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  const cards = page.locator('#featured-projects article')
  await expect(cards).toHaveCount(3)

  const featured = await cards.nth(0).boundingBox()
  const firstHalf = await cards.nth(1).boundingBox()
  const secondHalf = await cards.nth(2).boundingBox()

  expect(featured).not.toBeNull()
  expect(firstHalf).not.toBeNull()
  expect(secondHalf).not.toBeNull()

  return { featured, firstHalf, secondHalf }
}

test.describe('Responsive and accessibility baseline', () => {
  test('featured project cards collapse to one column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { featured, firstHalf } = await getCardBoxes(page)

    if (featured && firstHalf) {
      expect(Math.abs(featured.x - firstHalf.x)).toBeLessThan(10)
      expect(firstHalf.y).toBeGreaterThan(featured.y + featured.height * 0.5)
    }
  })

  test('featured project cards use multiple columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { featured, firstHalf, secondHalf } = await getCardBoxes(page)

    if (featured && firstHalf && secondHalf) {
      expect(featured.width).toBeGreaterThan(firstHalf.width * 1.5)
      expect(Math.abs(firstHalf.x - secondHalf.x)).toBeGreaterThan(80)
    }
  })

  test('featured project cards use a two-column split on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { featured, firstHalf, secondHalf } = await getCardBoxes(page)

    if (featured && firstHalf && secondHalf) {
      expect(featured.width).toBeGreaterThan(firstHalf.width * 1.5)
      expect(Math.abs(firstHalf.x - secondHalf.x)).toBeGreaterThan(80)
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
