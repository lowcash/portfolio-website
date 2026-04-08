import { expect, test } from '@playwright/test'

function getAlphaFromColor(color: string): number {
  const rgbaMatch = color.match(/rgba?\(([^)]+)\)/i)
  if (!rgbaMatch) return 1
  const parts = rgbaMatch[1].split(',').map((part) => part.trim())
  if (parts.length < 4) return 1
  const alpha = Number(parts[3])
  return Number.isFinite(alpha) ? alpha : 1
}

test.describe('Devtools and layered UI interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('devtools egg is clickable and opening console does not block page UI', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await expect(toggleButton).toBeVisible()

    // Use evaluate-based click to bypass Next.js dev overlay pointer interception.
    await toggleButton.evaluate((btn: HTMLElement) => btn.click())
    const consoleRegion = page.getByRole('region', { name: 'Developer debug console' })
    await expect(consoleRegion).toBeVisible()

    const mobileMenuTrigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    if (await mobileMenuTrigger.isVisible()) {
      await consoleRegion.getByRole('button', { name: 'Close console' }).click()
      await expect(consoleRegion).not.toBeVisible()
      await mobileMenuTrigger.click()
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
      await page.getByLabel('Close menu backdrop').click()
      await page.waitForTimeout(300)
    } else {
      const navButton = page.getByRole('button', { name: 'Navigate to Tech Stack' })
      await navButton.click()
      await page.waitForTimeout(800)
      await expect(page.locator('#tech-journey')).toBeInViewport({ ratio: 0.15 })
    }
  })

  test('devtools egg has no visible background and no border', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await expect(toggleButton).toBeVisible()

    const visualStyle = await toggleButton.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        backgroundColor: style.backgroundColor,
        borderTopWidth: style.borderTopWidth,
        borderTopStyle: style.borderTopStyle,
      }
    })

    const alpha = getAlphaFromColor(visualStyle.backgroundColor)
    expect(alpha).toBeLessThanOrEqual(0.1)
    expect(Number.parseFloat(visualStyle.borderTopWidth)).toBe(0)
    expect(visualStyle.borderTopStyle).toBe('none')
  })

  test('devtools egg stays anchored to bottom-left corner', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await expect(toggleButton).toBeVisible()

    const viewport = page.viewportSize()
    const box = await toggleButton.boundingBox()

    expect(viewport).not.toBeNull()
    expect(box).not.toBeNull()

    if (viewport && box) {
      const distanceFromLeft = box.x
      const distanceFromBottom = viewport.height - (box.y + box.height)

      expect(distanceFromLeft).toBeLessThanOrEqual(20)
      expect(distanceFromBottom).toBeLessThanOrEqual(20)
    }
  })

  test('devtools achievement grid renders 16 slots', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('achievements')
      window.dispatchEvent(new CustomEvent('achievements-reset'))
    })

    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await toggleButton.evaluate((btn: HTMLElement) => btn.click())

    const consoleRegion = page.getByRole('region', { name: 'Developer debug console' })
    await expect(consoleRegion).toBeVisible()
    await expect(consoleRegion.locator('div.grid.grid-cols-4 > div')).toHaveCount(16)
  })

  test('orbs keep content readable and clickable', async ({ page }) => {
    const heading = page.getByRole('heading', { name: "Hey, I'm Lukáš Machala" })
    await expect(heading).toBeVisible()
    await expect(page.locator('.orb-1')).toBeVisible()

    const mobileMenuTrigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    if (await mobileMenuTrigger.isVisible()) {
      const headingIsReadableOnMobile = await heading.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })

      expect(headingIsReadableOnMobile).toBe(true)
      await mobileMenuTrigger.click()
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
    } else {
      const headingIsTopClickableTarget = await heading.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2
        const topElement = document.elementFromPoint(x, y)
        return topElement === el || !!topElement?.closest('h1')
      })

      expect(headingIsTopClickableTarget).toBe(true)
      const navButton = page.getByRole('button', { name: 'Navigate to Notable Work' })
      await navButton.click()
      await page.waitForTimeout(800)
      await expect(page.locator('#notable-work')).toBeInViewport({ ratio: 0.15 })
    }
  })

  test('DevTools reset buttons have cursor:pointer', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await toggleButton.evaluate((btn: HTMLElement) => btn.click())

    const consoleRegion = page.getByRole('region', { name: 'Developer debug console' })
    await expect(consoleRegion).toBeVisible()

    for (const name of ['RESET TO DEFAULT', 'RESET ACHIEVEMENTS']) {
      const btn = consoleRegion.getByRole('button', { name })
      await expect(btn).toBeVisible()
      const cursor = await btn.evaluate((el) => getComputedStyle(el).cursor)
      expect(cursor).toBe('pointer')
    }
  })
})
