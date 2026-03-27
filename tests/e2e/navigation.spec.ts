import { expect, test } from '@playwright/test'

const SECTIONS = [
  { id: 'tech-journey', label: 'Tech Stack' },
  { id: 'notable-work', label: 'Notable Work' },
  { id: 'contact', label: "Let's Connect" },
] as const

test.describe('Desktop navigation baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  for (const { id, label } of SECTIONS) {
    test(`navigation dot for ${label} scrolls to #${id}`, async ({ page }) => {
      const navButton = page.getByRole('button', { name: `Navigate to ${label}` })
      await expect(navButton).toBeVisible()

      await navButton.click()
      await page.waitForTimeout(900)

      await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.15 })
    })
  }

  test('active navigation state follows manual section scroll', async ({ page }) => {
    await page.locator('#work-experience').scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)

    await expect(
      page.getByRole('button', { name: 'Navigate to Work Experience' })
    ).toHaveAttribute('aria-current', 'true')
  })

  test('navigation order keeps Work Experience before Academic Journey', async ({ page }) => {
    const workExpButton = page.getByRole('button', { name: 'Navigate to Work Experience' })
    const educationButton = page.getByRole('button', { name: 'Navigate to Academic Journey' })

    await expect(workExpButton).toBeVisible()
    await expect(educationButton).toBeVisible()

    const workExpY = await workExpButton.evaluate((el) => el.getBoundingClientRect().top)
    const educationY = await educationButton.evaluate((el) => el.getBoundingClientRect().top)

    expect(workExpY).toBeLessThan(educationY)
  })

  test('scroll-to-top appears after leaving hero and returns page to top', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)

    const scrollToTop = page.getByRole('button', { name: 'Scroll to top of page' })
    await expect(scrollToTop).toBeVisible()

    await scrollToTop.click()
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBeLessThan(120)
    await expect(page.locator('#hero')).toBeInViewport({ ratio: 0.2 })
  })
})

test.describe('Mobile navigation baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('hamburger menu opens and closes the mobile navigation', async ({ page }) => {
    const trigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()

    const drawer = page.getByRole('navigation', { name: 'Mobile navigation' })
    await expect(drawer).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await page.getByLabel('Close menu backdrop').click()
    await page.waitForTimeout(400)

    await expect(drawer).not.toBeVisible()
  })

  test('mobile menu button scrolls to target section and closes drawer', async ({ page }) => {
    await page.locator('button[aria-controls="mobile-navigation-menu"]').click()

    const drawer = page.getByRole('navigation', { name: 'Mobile navigation' })
    const contactButton = drawer.getByRole('button', { name: "Let's Connect" })
    await expect(contactButton).toBeVisible()

    await contactButton.click()
    await page.waitForTimeout(900)

    await expect(drawer).not.toBeVisible()
    await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.15 })
  })
})
