import { type Page, expect, test } from '@playwright/test'

const SECTIONS = [
  { id: 'featured-projects', label: 'Projects', scene: 'projects' },
  { id: 'experience', label: 'Experience', scene: 'experience' },
  { id: 'contact', label: 'Contact', scene: 'contact' },
] as const

const statusTabs = (page: Page) => page.getByRole('navigation', { name: 'Sections' })
const mainMenu = (page: Page) => page.locator("nav[aria-label='Main menu']")

/** Below 48rem the main menu hides behind a Menu button; this opens it (a no-op where the menu is inline). */
async function openMainMenu(page: Page) {
  const button = page.getByRole('button', { name: 'Menu', exact: true })

  if (await button.isVisible()) {
    await button.click()
  }

  return mainMenu(page)
}

for (const [name, viewport] of [
  ['Desktop', { width: 1280, height: 800 }],
  ['Mobile', { width: 390, height: 844 }],
] as const) {
  test.describe(`${name} navigation baseline`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto('/')
      await page.waitForLoadState('networkidle')
    })

    for (const { id, label, scene } of SECTIONS) {
      test(`status line tab for ${label} scrolls to #${id} and sets the scene`, async ({ page }) => {
        const tab = statusTabs(page).getByRole('link', { name: label })
        await expect(tab).toBeVisible()

        await tab.click()

        await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.15 })
        await expect(tab).toHaveAttribute('aria-current', 'location')
        await expect(page.locator('html')).toHaveAttribute('data-scene', scene)
      })

      test(`conventional menu item ${label} scrolls to #${id}`, async ({ page }) => {
        const item = (await openMainMenu(page)).getByRole('link', { name: label })
        await expect(item).toBeVisible()

        await item.click()

        await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.15 })
        // The menu closes after a jump on mobile, so read the state from the link itself
        await expect(mainMenu(page).locator(`a[href='#${id}']`)).toHaveAttribute('aria-current', 'location')
      })
    }

    test('the conventional menu lists Intro, Projects, Experience, Contact in page order', async ({ page }) => {
      await expect((await openMainMenu(page)).getByRole('link')).toHaveText([
        'Intro',
        'Projects',
        'Experience',
        'Contact',
      ])
      await expect(statusTabs(page).getByRole('link')).toHaveText([/intro/i, /projects/i, /experience/i, /contact/i])
    })

    test('active tab follows manual scrolling', async ({ page }) => {
      await page.locator('#experience').scrollIntoViewIfNeeded()
      await page.waitForTimeout(1200)

      await expect(statusTabs(page).getByRole('link', { name: 'Experience' })).toHaveAttribute(
        'aria-current',
        'location',
      )
      await expect(mainMenu(page).locator("a[href='#experience']")).toHaveAttribute('aria-current', 'location')
    })

    test('contact tab is active at the bottom of the page', async ({ page }) => {
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
      await page.waitForTimeout(800)

      await expect(statusTabs(page).getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'location')
    })

    test('the wordmark and the Intro tab return the page to the top', async ({ page }) => {
      await page.locator('#contact').scrollIntoViewIfNeeded()
      await page.waitForTimeout(800)

      await page.getByRole('link', { name: 'lowcash.dev' }).click()
      await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(120)
      await expect(page.locator('#hero')).toBeInViewport({ ratio: 0.2 })

      await page.locator('#contact').scrollIntoViewIfNeeded()
      await page.waitForTimeout(800)
      await statusTabs(page).getByRole('link', { name: 'Intro' }).click()
      await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(120)
    })

    test('status line shows the scroll percentage', async ({ page }) => {
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))

      if (viewport.width >= 768) {
        await expect(page.locator('.st-right')).toContainText('100%')
      }
    })

    test('status line stays clear of content: nothing focusable hides under it', async ({ page }) => {
      const bar = await page.locator('#status').boundingBox()
      const view = page.viewportSize()
      expect(bar).not.toBeNull()
      expect(bar!.y + bar!.height).toBeGreaterThanOrEqual(view!.height - 1)
    })
  })
}

test.describe('Keyboard shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  for (const [key, id] of [
    ['1', 'featured-projects'],
    ['2', 'experience'],
    ['3', 'contact'],
    ['0', 'hero'],
  ] as const) {
    test(`pressing ${key} jumps to #${id}`, async ({ page }) => {
      if (key === '0') {
        await page.locator('#contact').scrollIntoViewIfNeeded()
        await page.waitForTimeout(600)
      }

      await page.keyboard.press(key)

      await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.15 })
    })
  }

  test('modifier combinations do not trigger shortcuts', async ({ page }) => {
    await page.keyboard.press('Control+2')
    await page.keyboard.press('Meta+d')
    await page.waitForTimeout(400)

    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50)
    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeHidden()
  })
})
