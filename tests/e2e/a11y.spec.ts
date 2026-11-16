import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const scan = (page: import('@playwright/test').Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()

const blockingOf = (results: Awaited<ReturnType<typeof scan>>) =>
  results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')

test.describe('Automated accessibility scan', () => {
  test('home page has no serious or critical axe violations (wcag2a/aa + wcag22aa)', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('main#main-content')).toBeVisible()

    const blocking = blockingOf(await scan(page))

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })

  test('the page with the dev console open has no serious or critical violations either', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    await expect(page.locator('#orb-setting-animationSpeed')).toBeVisible()

    const blocking = blockingOf(await scan(page))

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })
})
