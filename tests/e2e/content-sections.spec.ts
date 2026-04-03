import { expect, test } from '@playwright/test'

test.describe('Content sections baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('core content sections render expected card counts', async ({ page }) => {
    await expect(page.locator('#who-i-am article')).toHaveCount(3)
    await expect(page.locator('#tech-journey article')).toHaveCount(5)
    await expect(page.locator('#notable-work article')).toHaveCount(4)
    await expect(page.locator('#work-experience article')).toHaveCount(2)
    await expect(page.locator('#education article')).toHaveCount(2)
    await expect(page.locator('#beyond-code article')).toHaveCount(4)
    await expect(page.locator('#whats-next article')).toHaveCount(3)
  })

  test('notable work and beyond code links are present', async ({ page }) => {
    await page.locator('#notable-work').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await expect(page.locator('#notable-work a[href="https://youtu.be/8PpEFLIw7TY"]')).toHaveCount(1)
    await expect(page.locator('#notable-work a[href="https://github.com/lowcash/QuantWise-Demo"]')).toHaveCount(1)
    await expect(page.locator('#notable-work a[href="https://pohlazenipoteleadusi.cz"]')).toHaveCount(1)
    await expect(page.locator('#notable-work a[href="https://pinkladyyachtingservices.com"]')).toHaveCount(1)

    await page.locator('#beyond-code').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.locator('#beyond-code a[href*="youtube.com/@ltdlowcash"]')).toHaveCount(1)
  })
})
