import { expect, test } from '@playwright/test'

test.describe('Mobile navigation regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Intro from drawer returns user to hero', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' })
    })
    await page.waitForTimeout(900)

    const trigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    await expect(trigger).toBeVisible()

    await trigger.click()
    const drawer = page.getByRole('navigation', { name: 'Mobile navigation' })
    await expect(drawer).toBeVisible()

    const heroButton = drawer.getByRole('button', { name: 'Intro' })
    await expect(heroButton).toBeVisible()

    await heroButton.click()

    await expect(drawer).not.toBeVisible()
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3500 }).toBeLessThan(320)
    await expect(page.locator('#hero')).toBeInViewport({ ratio: 0.25 })
  })

  test('scroll-to-top does not overlap contact text on mobile', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' })
    })
    await page.waitForTimeout(900)

    const scrollToTopButton = page.getByRole('button', { name: 'Scroll to top of page' })
    await expect(scrollToTopButton).toBeVisible()

    await scrollToTopButton.click()
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3500 }).toBeLessThan(220)
    await expect(page.locator('#hero')).toBeInViewport({ ratio: 0.2 })
  })
})
