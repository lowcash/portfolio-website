import { expect, test } from '@playwright/test'

test.describe('Devtools and layered UI interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('devtools egg is clickable and opening console does not block page UI', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await expect(toggleButton).toBeVisible()

    await toggleButton.click()
    await expect(page.getByRole('region', { name: 'Developer debug console' })).toBeVisible()

    const mobileMenuTrigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    if (await mobileMenuTrigger.isVisible()) {
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

  test('achievement popup is rendered above side dots navigation on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop rail assertions are desktop-only')

    await page.evaluate(() => {
      localStorage.setItem('dev_console_opened', 'true')
      window.dispatchEvent(new CustomEvent('dev-console-opened'))
      localStorage.removeItem('achievements')
      window.dispatchEvent(new CustomEvent('achievements-reset'))

      document.documentElement.classList.add('no-scroll-snap')
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: maxScroll * 0.5, behavior: 'instant' })
      window.dispatchEvent(new Event('scroll'))
    })

    await page.waitForTimeout(900)

    const popup = page.getByRole('alert').filter({ hasText: 'Achievement Unlocked!' }).first()
    await expect(popup).toBeVisible()

    const popupBox = await popup.boundingBox()
    const navBox = await page.getByRole('navigation', { name: 'Page navigation' }).boundingBox()

    expect(popupBox).not.toBeNull()
    expect(navBox).not.toBeNull()

    if (popupBox && navBox) {
      const popupCenterY = popupBox.y + popupBox.height / 2
      const navTop = navBox.y
      const navBottom = navBox.y + navBox.height
      const popupRight = popupBox.x + popupBox.width
      const navCenterX = navBox.x + navBox.width / 2

      expect(popupCenterY).toBeGreaterThanOrEqual(navTop - 40)
      expect(popupCenterY).toBeLessThanOrEqual(navBottom + 40)
      expect(popupRight).toBeLessThan(navCenterX + 10)
    }

    const zLayerCheck = await page.evaluate(() => {
      const popupContainer = document.querySelector('[data-testid="achievement-popup-layer"]')
      const navContainer = document.querySelector('nav[aria-label="Page navigation"]')?.closest('.fixed')

      const popupZ = popupContainer ? Number(getComputedStyle(popupContainer).zIndex || 0) : -1
      const navZ = navContainer ? Number(getComputedStyle(navContainer).zIndex || 0) : -1

      return { popupZ, navZ }
    })

    expect(zLayerCheck.popupZ).toBeGreaterThan(zLayerCheck.navZ)

    await page.evaluate(() => {
      document.documentElement.classList.remove('no-scroll-snap')
    })
  })

  test('orbs keep content readable and clickable', async ({ page }) => {
    const heading = page.getByRole('heading', { name: "Hey, I'm Lukáš Machala" })
    await expect(heading).toBeVisible()
    await expect(page.locator('.orb-1')).toBeVisible()

    const headingIsTopClickableTarget = await heading.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const topElement = document.elementFromPoint(x, y)
      return topElement === el || !!topElement?.closest('h1')
    })

    expect(headingIsTopClickableTarget).toBe(true)

    const mobileMenuTrigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    if (await mobileMenuTrigger.isVisible()) {
      await mobileMenuTrigger.click()
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
    } else {
      const navButton = page.getByRole('button', { name: 'Navigate to Notable Work' })
      await navButton.click()
      await page.waitForTimeout(800)
      await expect(page.locator('#notable-work')).toBeInViewport({ ratio: 0.15 })
    }
  })
})
