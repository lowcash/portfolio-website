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

  test('desktop devtools panel opens at readable default size', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop size assertion is desktop-only')

    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await toggleButton.evaluate((btn: HTMLElement) => btn.click())

    const panel = page.getByRole('region', { name: 'Developer debug console' })
    await expect(panel).toBeVisible()

    const panelContent = page.getByTestId('devtools-panel-content')
    const contentStyle = await panelContent.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        minWidth: Number.parseFloat(style.minWidth),
        maxHeight: Number.parseFloat(style.maxHeight),
      }
    })

    expect(contentStyle.minWidth).toBeGreaterThanOrEqual(420)
    expect(contentStyle.maxHeight).toBeGreaterThanOrEqual(500)
  })

  test('achievement popup is rendered above side dots navigation on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Desktop rail assertions are desktop-only')

    await page.evaluate(async () => {
      localStorage.setItem('dev_console_opened', 'true')
      window.dispatchEvent(new CustomEvent('dev-console-opened'))
      localStorage.removeItem('achievements')
      window.dispatchEvent(new CustomEvent('achievements-reset'))

      document.documentElement.style.scrollSnapType = 'none'
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight

      // Probe around 50% in multiple passes to avoid timing flakes.
      for (let pass = 0; pass < 3; pass++) {
        await new Promise((resolve) => setTimeout(resolve, 90))
        for (const ratio of [0.5, 0.501, 0.499, 0.502, 0.498]) {
          window.scrollTo({ top: maxScroll * ratio, behavior: 'instant' })
          window.dispatchEvent(new Event('scroll'))
        }
      }
    })

    const popup = page.getByRole('alert').filter({ hasText: 'Achievement Unlocked!' }).first()

    for (let attempt = 0; attempt < 3; attempt++) {
      const isVisible = await popup.isVisible().catch(() => false)
      if (isVisible) {
        break
      }

      await page.evaluate(async () => {
        localStorage.setItem('dev_console_opened', 'true')
        window.dispatchEvent(new CustomEvent('dev-console-opened'))

        document.documentElement.style.scrollSnapType = 'none'
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        for (const ratio of [0.5, 0.501, 0.499, 0.502, 0.498]) {
          window.scrollTo({ top: maxScroll * ratio, behavior: 'instant' })
          window.dispatchEvent(new Event('scroll'))
        }
      })
      await page.waitForTimeout(600)
    }

    await expect(popup).toBeVisible()

    const popupBox = await popup.boundingBox()
    const navBox = await page.getByRole('navigation', { name: 'Page navigation' }).boundingBox()

    expect(popupBox).not.toBeNull()
    expect(navBox).not.toBeNull()

    if (popupBox && navBox) {
      // Popup is horizontally left-of-center of the nav dots so it never overlaps them.
      const popupRight = popupBox.x + popupBox.width
      const navCenterX = navBox.x + navBox.width / 2
      expect(popupRight).toBeLessThan(navCenterX + 10)

      // Popup is within vertical viewport bounds.
      const viewportSize = page.viewportSize()
      if (viewportSize) {
        expect(popupBox.y).toBeGreaterThanOrEqual(0)
        expect(popupBox.y + popupBox.height).toBeLessThanOrEqual(viewportSize.height)
      }
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
      document.documentElement.style.scrollSnapType = ''
    })
  })

  test('achievement popup is fully visible within viewport on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'Viewport assertions are desktop-only')

    await page.evaluate(async () => {
      localStorage.setItem('dev_console_opened', 'true')
      window.dispatchEvent(new CustomEvent('dev-console-opened'))
      localStorage.removeItem('achievements')
      window.dispatchEvent(new CustomEvent('achievements-reset'))

      document.documentElement.style.scrollSnapType = 'none'
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight

      // Probe around 50% in multiple passes to avoid timing flakes.
      for (let pass = 0; pass < 3; pass++) {
        await new Promise((resolve) => setTimeout(resolve, 90))
        for (const ratio of [0.5, 0.501, 0.499, 0.502, 0.498]) {
          window.scrollTo({ top: maxScroll * ratio, behavior: 'instant' })
          window.dispatchEvent(new Event('scroll'))
        }
      }
    })

    const popup = page.getByRole('alert').filter({ hasText: 'Achievement Unlocked!' }).first()

    for (let attempt = 0; attempt < 3; attempt++) {
      const isVisible = await popup.isVisible().catch(() => false)
      if (isVisible) {
        break
      }

      await page.evaluate(async () => {
        localStorage.setItem('dev_console_opened', 'true')
        window.dispatchEvent(new CustomEvent('dev-console-opened'))

        document.documentElement.style.scrollSnapType = 'none'
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        for (const ratio of [0.5, 0.501, 0.499, 0.502, 0.498]) {
          window.scrollTo({ top: maxScroll * ratio, behavior: 'instant' })
          window.dispatchEvent(new Event('scroll'))
        }
      })
      await page.waitForTimeout(600)
    }

    await expect(popup).toBeVisible()

    const popupBox = await popup.boundingBox()
    expect(popupBox).not.toBeNull()

    const viewportSize = page.viewportSize()
    expect(viewportSize).not.toBeNull()

    if (popupBox && viewportSize) {
      expect(popupBox.x).toBeGreaterThanOrEqual(0)
      expect(popupBox.y).toBeGreaterThanOrEqual(0)
      expect(popupBox.x + popupBox.width).toBeLessThanOrEqual(viewportSize.width)
      expect(popupBox.y + popupBox.height).toBeLessThanOrEqual(viewportSize.height)
    }

    await page.evaluate(() => {
      document.documentElement.style.scrollSnapType = ''
    })
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

  test('mobile orb centers are spread across viewport width', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-safari', 'Orb spread check is mobile-only')

    await page.waitForTimeout(1800)

    const orbSpread = await page.evaluate(() => {
      const orbElements = Array.from(document.querySelectorAll('.orb-1, .orb-2, .orb-3, .orb-4, .orb-5, .orb-6'))
      const centers = orbElements
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return ((rect.left + rect.width / 2) / window.innerWidth) * 100
        })
        .filter((value) => Number.isFinite(value))

      const leftCount = centers.filter((x) => x < 40).length
      const rightCount = centers.filter((x) => x > 60).length

      const minX = centers.length > 0 ? Math.min(...centers) : 0
      const maxX = centers.length > 0 ? Math.max(...centers) : 0

      return { leftCount, rightCount, centers, minX, maxX }
    })

    expect(orbSpread.leftCount).toBeGreaterThanOrEqual(1)
    expect(orbSpread.rightCount).toBeGreaterThanOrEqual(2)
    expect(orbSpread.maxX - orbSpread.minX).toBeGreaterThanOrEqual(35)
  })
})
