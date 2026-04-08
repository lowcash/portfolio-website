import { expect, test } from '@playwright/test'

async function triggerMidpointAchievement(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    localStorage.setItem('dev_console_opened', 'true')
    window.dispatchEvent(new CustomEvent('dev-console-opened'))
    localStorage.removeItem('achievements')
    window.dispatchEvent(new CustomEvent('achievements-reset'))

    document.documentElement.style.scrollSnapType = 'none'
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    for (let pass = 0; pass < 3; pass++) {
      await new Promise((resolve) => setTimeout(resolve, 90))
      for (const ratio of [0.5, 0.501, 0.499, 0.502, 0.498]) {
        window.scrollTo({ top: maxScroll * ratio, behavior: 'instant' })
        window.dispatchEvent(new Event('scroll'))
      }
    }
  })
}

async function waitForAchievementPopup(page: import('@playwright/test').Page) {
  const popup = page.getByRole('alert').filter({ hasText: 'Achievement Unlocked!' }).first()

  for (let attempt = 0; attempt < 3; attempt++) {
    const isVisible = await popup.isVisible().catch(() => false)
    if (isVisible) {
      return popup
    }

    await triggerMidpointAchievement(page)
    await page.waitForTimeout(600)
  }

  return popup
}

test.describe('Desktop devtools and overlays', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('devtools panel opens at readable default size', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle debug console' })
    await toggleButton.evaluate((btn: HTMLElement) => btn.click())

    const panel = page.getByRole('region', { name: 'Developer debug console' })
    await expect(panel).toBeVisible()

    const panelContent = page.getByTestId('devtools-panel-content')
    const contentStyle = await panelContent.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        minWidth: Number.parseFloat(style.minWidth),
        maxWidth: Number.parseFloat(style.maxWidth),
        maxHeight: Number.parseFloat(style.maxHeight),
      }
    })

    expect(contentStyle.minWidth).toBeGreaterThanOrEqual(420)
    expect(contentStyle.maxWidth).toBeGreaterThanOrEqual(850)
    expect(contentStyle.maxHeight).toBeGreaterThanOrEqual(600)
  })

  test('achievement popup is rendered above side dots navigation', async ({ page }) => {
    await triggerMidpointAchievement(page)

    const popup = await waitForAchievementPopup(page)
    await expect(popup).toBeVisible()

    const popupBox = await popup.boundingBox()
    const navBox = await page.getByRole('navigation', { name: 'Page navigation' }).boundingBox()

    expect(popupBox).not.toBeNull()
    expect(navBox).not.toBeNull()

    if (popupBox && navBox) {
      const popupRight = popupBox.x + popupBox.width
      const navCenterX = navBox.x + navBox.width / 2
      expect(popupRight).toBeLessThan(navCenterX + 10)

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

  test('achievement popup is fully visible within viewport', async ({ page }) => {
    await triggerMidpointAchievement(page)

    const popup = await waitForAchievementPopup(page)
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
})
