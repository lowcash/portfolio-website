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

  test('the top bar is a slim wordmark row with no menu; the console stays reachable from the status line', async ({
    page,
  }) => {
    const bar = await page.locator('.topbar').boundingBox()
    const wordmark = await page.getByRole('link', { name: 'lowcash.dev' }).boundingBox()

    expect(bar!.height).toBeLessThanOrEqual(48)
    expect(wordmark!.x).toBeGreaterThanOrEqual(15)
    await expect(page.locator('.menu-btn')).toHaveCount(0)
    await expect(page.locator('.topbar .keyhint')).toBeHidden()

    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeVisible()
  })

  test('the page does not scroll sideways', async ({ page }) => {
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }))
    expect(sw).toBeLessThanOrEqual(cw)
  })
})
