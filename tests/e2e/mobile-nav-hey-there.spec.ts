import { expect, test } from '@playwright/test'

test.describe('Mobile navigation regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Intro tab returns the user to the hero from the bottom', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' })
    })
    await page.waitForTimeout(900)

    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Intro' }).click()

    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3500 }).toBeLessThan(320)
    await expect(page.locator('#hero')).toBeInViewport({ ratio: 0.25 })
  })

  test('status line does not overlap contact text on mobile', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('contact')?.scrollIntoView({ block: 'start' })
    })
    await page.waitForTimeout(900)
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))

    const bar = await page.locator('#status').boundingBox()
    const hint = await page.locator('#contact .hint').boundingBox()

    expect(bar).not.toBeNull()
    expect(hint).not.toBeNull()
    expect(hint!.y + hint!.height).toBeLessThanOrEqual(bar!.y)
  })

  test('the conventional menu fits one row inside the gutters at 390px', async ({ page }) => {
    const menu = page.getByRole('navigation', { name: 'Main menu' })
    const box = await menu.boundingBox()
    const last = await menu.getByRole('link', { name: 'Contact' }).boundingBox()

    expect(box).not.toBeNull()
    expect(last).not.toBeNull()
    expect(last!.x + last!.width).toBeLessThanOrEqual(390)
    expect(box!.height).toBeLessThan(60)
  })

  test('the page does not scroll sideways', async ({ page }) => {
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(sw).toBeLessThanOrEqual(cw)
  })
})
