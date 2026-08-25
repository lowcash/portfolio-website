import { expect, test } from '@playwright/test'

const SECTIONS = [
  { id: 'featured-projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

test.describe('Desktop navigation baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  for (const { id, label } of SECTIONS) {
    test(`navigation dot for ${label} scrolls to #${id}`, async ({ page }) => {
      const navButton = page.getByRole('button', { name: `Navigate to ${label}` })
      await expect(navButton).toBeVisible()
      await navButton.scrollIntoViewIfNeeded()

      await navButton.click()
      await page.waitForTimeout(1500)

      await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.15 })
    })
  }

  test('active navigation state follows manual section scroll', async ({ page }) => {
    await page.locator('#experience').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)

    await expect(page.getByRole('button', { name: 'Navigate to Experience' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  test('contact navigation dot activates at bottom of page', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await page.waitForTimeout(800)

    await expect(page.getByRole('button', { name: 'Navigate to Contact' })).toHaveAttribute('aria-current', 'true')
  })

  test('navigation order keeps Projects before Experience', async ({ page }) => {
    const projectsButton = page.getByRole('button', { name: 'Navigate to Projects' })
    const experienceButton = page.getByRole('button', { name: 'Navigate to Experience' })

    await expect(projectsButton).toBeVisible()
    await expect(experienceButton).toBeVisible()

    const projectsY = await projectsButton.evaluate((el) => el.getBoundingClientRect().top)
    const experienceY = await experienceButton.evaluate((el) => el.getBoundingClientRect().top)

    expect(projectsY).toBeLessThanOrEqual(experienceY)
  })

  test('scroll-to-top appears after leaving hero and returns page to top', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1500)

    const scrollToTop = page.getByRole('button', { name: 'Scroll to top of page' })
    await expect(scrollToTop).toBeVisible()

    await scrollToTop.click()
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(120)
    await expect(page.locator('#hero')).toBeInViewport({ ratio: 0.2 })
  })
})

test.describe('Mobile navigation baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('hamburger menu opens and closes the mobile navigation', async ({ page }) => {
    const trigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()

    const drawer = page.getByRole('navigation', { name: 'Mobile navigation' })
    await expect(drawer).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await page.getByLabel('Close menu backdrop').click()
    await page.waitForTimeout(400)

    await expect(drawer).not.toBeVisible()
  })

  test('mobile menu button scrolls to target section and closes drawer', async ({ page }) => {
    await page.locator('button[aria-controls="mobile-navigation-menu"]').click()

    const drawer = page.getByRole('navigation', { name: 'Mobile navigation' })
    const contactButton = drawer.getByRole('button', { name: 'Contact' })
    await expect(contactButton).toBeVisible()

    await contactButton.click()
    await page.waitForTimeout(1500)

    await expect(drawer).not.toBeVisible()
    await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.15 })
  })

  test('mobile menu suppresses devtools trigger interactions', async ({ page }) => {
    const menuTrigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    await menuTrigger.click()

    const drawer = page.getByRole('navigation', { name: 'Mobile navigation' })
    await expect(drawer).toBeVisible()

    const devtoolsTrigger = page.getByRole('button', { name: 'Toggle debug console' })
    await expect(devtoolsTrigger).toBeVisible()

    await expect
      .poll(async () => {
        return devtoolsTrigger.evaluate((el) => {
          const style = getComputedStyle(el)
          return {
            pointerEvents: style.pointerEvents,
            opacity: Number(style.opacity),
            zIndex: Number(style.zIndex || '0'),
          }
        })
      })
      .toEqual({
        pointerEvents: 'none',
        opacity: 0,
        zIndex: 40,
      })

    await page.getByLabel('Close menu backdrop').click()
    await page.waitForTimeout(400)

    await expect(drawer).not.toBeVisible()
  })

  test('mobile menu marks the current section as active after manual scroll', async ({ page }) => {
    await page.locator('#experience').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)

    const trigger = page.locator('button[aria-controls="mobile-navigation-menu"]')
    await trigger.click()

    const drawer = page.getByRole('navigation', { name: 'Mobile navigation' })
    await expect(drawer).toBeVisible()

    const activeItem = drawer.getByRole('button', { name: 'Experience' })
    await expect(activeItem).toHaveAttribute('aria-current', 'page')
  })
})
