import { expect, test } from '@playwright/test'

test.describe('Dev console pane', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('the status line button opens a pane docked above the status line', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Toggle developer console' })
    await expect(toggle).toBeVisible()

    await toggle.click()

    const pane = page.getByRole('dialog', { name: 'Developer console' })
    await expect(pane).toBeVisible()
    await expect(page.locator('#orb-setting-animationSpeed')).toBeVisible()

    const paneBox = await pane.boundingBox()
    const barBox = await page.locator('#status').boundingBox()
    expect(Math.abs(paneBox!.y + paneBox!.height - barBox!.y)).toBeLessThanOrEqual(2)
    expect(paneBox!.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 2)
  })

  test('the close button closes the pane and the page stays usable', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const pane = page.getByRole('dialog', { name: 'Developer console' })
    await expect(pane).toBeVisible()

    await pane.getByRole('button', { name: 'Close developer console' }).click()
    await expect(pane).toBeHidden()

    await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Projects' }).click()
    await expect(page.locator('#featured-projects')).toBeInViewport({ ratio: 0.15 })
  })

  test('the achievement grid renders 16 numbered tiles', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('achievements')
      window.dispatchEvent(new CustomEvent('achievements-reset'))
    })
    await page.getByRole('button', { name: 'Toggle developer console' }).click()

    const pane = page.getByRole('dialog', { name: 'Developer console' })
    const tiles = pane.locator('.tiles li')
    await expect(tiles).toHaveCount(16)
    await expect(tiles.first()).toHaveText('01')
    await expect(tiles.last()).toHaveText('16')
  })

  test('hovering or focusing a tile shows its hint', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const pane = page.getByRole('dialog', { name: 'Developer console' })

    await pane.locator('.tiles button').nth(1).focus()
    await expect(pane.locator('.ach-line')).toContainText('Perfectly Balanced')
    await expect(pane.locator('.ach-line')).toContainText('Scroll to exactly 50% of the page')
  })

  test('the readout reports scene, scroll, fps and keys', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const readout = page.getByRole('dialog', { name: 'Developer console' }).locator('.read')

    await expect(readout).toContainText('scene')
    await expect(readout).toContainText('hero')
    await expect(readout).toContainText('D · 0–3 · Esc')
    await expect(readout.locator('dd').nth(2)).toHaveText(/^\d+$/)
  })

  test('reset buttons have cursor:pointer', async ({ page }) => {
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const pane = page.getByRole('dialog', { name: 'Developer console' })

    for (const name of ['RESET TO DEFAULT', 'RESET ACHIEVEMENTS']) {
      const button = pane.getByRole('button', { name })
      await expect(button).toBeVisible()
      expect(await button.evaluate((element) => getComputedStyle(element).cursor)).toBe('pointer')
    }
  })

  test('the hero heading stays readable and clickable with the lights behind it', async ({ page }) => {
    const heading = page.getByRole('heading', { name: "Hey, I'm Lukáš Machala" })
    await expect(heading).toBeVisible()
    await expect(page.locator('.orb-a')).toBeAttached()

    const topIsHeading = await heading.evaluate((element) => {
      const rect = element.getBoundingClientRect()
      const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      return top === element || Boolean(top?.closest('h1'))
    })
    expect(topIsHeading).toBe(true)
  })
})
