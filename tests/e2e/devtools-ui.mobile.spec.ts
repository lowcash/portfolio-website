import { expect, test } from '@playwright/test'

test.describe('Mobile console', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('the >_ button is a full-height target at the bottom left of the status line', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Toggle developer console' })
    const box = await toggle.boundingBox()
    const bar = await page.locator('#status').boundingBox()

    expect(box!.x).toBeLessThanOrEqual(2)
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)
    expect(Math.abs(box!.y + box!.height - (bar!.y + bar!.height))).toBeLessThanOrEqual(2)
  })

  test('the pane scrolls inside itself and stays within the viewport', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const pane = page.getByRole('region', { name: 'Developer console' })
    await expect(pane).toBeVisible()

    const box = await pane.boundingBox()
    const viewport = page.viewportSize()!
    expect(box!.y).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1)
    expect(box!.height).toBeLessThanOrEqual(viewport.height * 0.7)
  })

  test('achievement tiles are comfortable touch targets', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const tile = page.getByRole('region', { name: 'Developer console' }).locator('.tiles button').first()
    const box = await tile.boundingBox()

    expect(box!.width).toBeGreaterThanOrEqual(24)
    expect(box!.height).toBeGreaterThanOrEqual(24)
  })
})
