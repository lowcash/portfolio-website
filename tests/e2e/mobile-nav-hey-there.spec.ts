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

  test('the top bar is compact: wordmark and a menu button on one slim row, the menu opens full width', async ({
    page,
  }) => {
    const bar = await page.locator('.topbar').boundingBox()
    const wordmark = await page.getByRole('link', { name: 'lowcash.dev' }).boundingBox()
    const button = page.locator('.menu-btn')
    const buttonBox = await button.boundingBox()

    expect(bar!.height).toBeLessThanOrEqual(48)
    expect(wordmark!.x).toBeGreaterThanOrEqual(15)
    expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(390 - 15)
    expect(buttonBox!.height).toBeGreaterThanOrEqual(40)
    await expect(page.locator("nav[aria-label='Main menu']")).toBeHidden()
    await expect(button).toHaveAttribute('aria-expanded', 'false')

    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const menu = page.locator('#top-menu')
    const menuBox = await menu.boundingBox()
    expect(menuBox!.x).toBe(0)
    expect(menuBox!.width).toBe(390)
    for (const name of ['Intro', 'Projects', 'Experience', 'Contact']) {
      const link = await menu.getByRole('link', { name }).boundingBox()
      expect(link!.height).toBeGreaterThanOrEqual(44)
    }

    await page.keyboard.press('Escape')
    await expect(page.locator("nav[aria-label='Main menu']")).toBeHidden()
  })

  test('the dev console stays reachable on touch: from the menu and from the status line', async ({ page }) => {
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await page.locator('.topbar .keyhint').click()
    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeVisible()
    await expect(page.locator('#top-menu')).toBeHidden()

    await page.keyboard.press('Escape')
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
