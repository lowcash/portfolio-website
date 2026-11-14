import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('Automated accessibility scan', () => {
  test('home page has no serious or critical axe violations (wcag2a/aa + wcag22aa)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('main#main-content')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze()

    const blocking = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    )

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })
})
