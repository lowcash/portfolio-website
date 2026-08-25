import { expect, test } from '@playwright/test'

test.describe('Content sections baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('core content sections render expected card counts', async ({ page }) => {
    await expect(page.locator('#featured-projects article')).toHaveCount(3)
    await expect(page.locator('#experience article')).toHaveCount(3)
  })

  test('featured projects links are present and trading engine has no public repo link', async ({ page }) => {
    await page.locator('#featured-projects').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    await expect(page.locator('#featured-projects a[href="https://youtu.be/8PpEFLIw7TY"]')).toHaveCount(1)
    await expect(page.locator('#featured-projects a[href*="github.com"]')).toHaveCount(0)
    await expect(page.locator('#featured-projects a[href="https://pohlazenipoteleadusi.cz/"]')).toHaveCount(1)
    await expect(page.locator('#featured-projects a[href="https://pinkladyyachtingservices.com/"]')).toHaveCount(1)
    const ziveSkloLink = page.getByRole('link', { name: /Živé Sklo/i })
    await expect(ziveSkloLink).toHaveAttribute('href', 'https://akce.zivesklo.cz/')
    await expect(ziveSkloLink).toHaveAttribute('target', '_blank')
    await expect(page.getByRole('link', { name: /Pink Lady Yachting Services/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Pohlazení po těle a duši/i })).toBeVisible()
  })

  test('background section includes beyond code note with Lowcash link', async ({ page }) => {
    await page.locator('#experience').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    const lowcashLink = page.getByRole('link', { name: /^Lowcash$/i })
    await expect(lowcashLink).toHaveAttribute('href', /youtube.com\/@ltdlowcash/)
    await expect(lowcashLink).toHaveAttribute('target', '_blank')
    await expect(page.getByText(/mix drum &\s*bass sets as/i)).toBeVisible()
  })
})
