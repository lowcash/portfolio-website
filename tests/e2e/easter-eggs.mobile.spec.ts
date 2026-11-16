import { type Page, expect, test } from '@playwright/test'

/** On a phone: touch taps and flick scrolling reach the achievements, the console shows hints on tap. */
const isUnlocked = (page: Page, id: string) =>
  page.evaluate(
    (key) =>
      (JSON.parse(localStorage.getItem('achievements') ?? '[]') as Array<{ id: string; unlocked: boolean }>).some(
        (a) => a.id === key && a.unlocked,
      ),
    id,
  )

test.describe('Achievements on touch', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('dev_console_opened', 'true'))
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
  })

  test('triple-tapping the name, ten quick taps and a flick scroll unlock their achievements', async ({ page }) => {
    await page.locator('#hero h1').tap()
    await page.locator('#hero h1').tap()
    await page.locator('#hero h1').tap()
    await expect.poll(() => isUnlocked(page, 'triple-click')).toBe(true)

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    for (let index = 0; index < 10; index += 1) await page.touchscreen.tap(2, 300)
    await expect.poll(() => isUnlocked(page, 'rapid-clicker')).toBe(true)

    // A fast flick: more than 500 px within a second
    for (let step = 1; step <= 8; step += 1) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), step * 120)
      await page.waitForTimeout(40)
    }
    await expect.poll(() => isUnlocked(page, 'shake')).toBe(true)
  })

  test('tapping a tile shows its hint and the toast carries the progress', async ({ page }) => {
    await page.evaluate(() => document.dispatchEvent(new Event('copy')))
    await expect(page.getByTestId('achievement-toast')).toContainText('· 1/16')

    await page.getByRole('button', { name: 'Toggle developer console' }).first().tap()
    const dialog = page.getByRole('dialog', { name: 'Developer console' })
    await expect(dialog).toBeVisible()
    await dialog.locator('.tiles button').nth(1).tap()
    await expect(dialog.locator('.ach-line')).toContainText('Scroll to exactly 50% of the page')
  })
})
