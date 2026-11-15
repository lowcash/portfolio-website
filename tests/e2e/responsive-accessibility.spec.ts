import { type Page, expect, test } from '@playwright/test'

async function getEntryBoxes(page: Page) {
  await page.locator('#featured-projects article').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  const entries = page.locator('#featured-projects article')
  await expect(entries).toHaveCount(4)

  const lead = entries.nth(0)
  const second = entries.nth(1)

  return {
    leadMain: await lead.locator('.e-main').boundingBox(),
    leadDetail: await lead.locator('.e-detail').boundingBox(),
    secondMain: await second.locator('.e-main').boundingBox(),
    secondDetail: await second.locator('.e-detail').boundingBox(),
    secondBox: await second.boundingBox(),
    leadBox: await lead.boundingBox(),
  }
}

test.describe('Responsive and accessibility baseline', () => {
  test('entries stack to one column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { secondMain, secondDetail } = await getEntryBoxes(page)

    expect(secondMain).not.toBeNull()
    expect(secondDetail).not.toBeNull()
    expect(Math.abs(secondMain!.x - secondDetail!.x)).toBeLessThan(10)
    expect(secondDetail!.y).toBeGreaterThan(secondMain!.y + secondMain!.height - 1)
  })

  test('entries are index, title and detail columns on desktop; the lead title runs wide', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { leadMain, secondMain, secondDetail } = await getEntryBoxes(page)

    expect(secondDetail!.x).toBeGreaterThan(secondMain!.x + secondMain!.width - 1)
    expect(leadMain!.width).toBeGreaterThan(secondMain!.width * 1.5)
  })

  test('entries use the index plus content split on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1112 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const { secondBox, secondMain, secondDetail } = await getEntryBoxes(page)

    expect(secondMain!.x).toBeGreaterThan(secondBox!.x + 100)
    expect(Math.abs(secondMain!.x - secondDetail!.x)).toBeLessThan(10)
  })

  test('skip link targets main content landmark', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: 'Skip to content' })
    await expect(skipLink).toBeVisible()

    await skipLink.press('Enter')

    await expect(page.locator('main#main-content')).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#main-content')
  })

  test('reduced motion disables smooth scrolling, drift, wipe and the crosshair', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const state = await page.evaluate(() => ({
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      drift: document.getAnimations().filter((a) => a instanceof CSSAnimation && a.animationName.startsWith('drift'))
        .length,
      wipe: getComputedStyle(document.querySelector('.chart svg')!).animationName,
      reveal: getComputedStyle(document.querySelector('.reveal')!).animationName,
    }))

    expect(state.scrollBehavior).toBe('auto')
    expect(state.drift).toBe(0)
    expect(state.wipe).toBe('none')
    expect(state.reveal).toBe('none')
  })

  test('focused elements are not hidden under the status line', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: 'LinkedIn' }).focus()

    // Focus scrolls smoothly; wait until the link has settled above the status line
    await expect
      .poll(async () => {
        const link = await page.getByRole('link', { name: 'LinkedIn' }).boundingBox()
        const bar = await page.locator('#status').boundingBox()
        return link!.y + link!.height <= bar!.y + 1 && link!.y >= 0
      })
      .toBe(true)
  })
})
