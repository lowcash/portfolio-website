import { expect, test } from '@playwright/test'

const SECTION_IDS = ['hero', 'featured-projects', 'experience', 'contact'] as const

test.describe('Portfolio smoke baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('all primary sections are rendered exactly once', async ({ page }) => {
    for (const sectionId of SECTION_IDS) {
      await expect(page.locator(`#${sectionId}`)).toHaveCount(1)
    }
  })

  test('hero copy is visible on first paint', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero.getByRole('heading', { name: "Hey, I'm Lukáš Machala" })).toBeVisible()
    await expect(
      hero.getByText(/Software Engineer building quantitative data pipelines,\s*time[\u2011-]series systems/i),
    ).toBeVisible()
  })

  test('headings are solid, readable ink on the dark page', async ({ page }) => {
    const colors = await page.evaluate(() => {
      const read = (selector: string) => {
        const element = document.querySelector(selector)
        return element ? getComputedStyle(element).color : ''
      }
      return { hero: read('#hero h1 .name'), section: read('#featured-projects h2') }
    })

    for (const color of Object.values(colors)) {
      expect(color).not.toBe('')
      expect(color).not.toBe('rgba(0, 0, 0, 0)')
    }
    await expect(page.locator('#featured-projects h2')).toHaveText('Projects')
  })

  test('contact section exposes primary external links', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)

    await expect(page.getByRole('link', { name: /Connect with me on GitHub/i })).toHaveAttribute(
      'href',
      'https://github.com/lowcash',
    )
    await expect(page.getByRole('link', { name: /Connect with me on LinkedIn/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/lukáš-machala-00549114a',
    )
    await expect(page.getByRole('link', { name: 'lukas.lowcash@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:lukas.lowcash@gmail.com',
    )
  })

  test('debug console toggles from keyboard and button without breaking layout', async ({ page }) => {
    const consolePane = page.getByRole('region', { name: 'Developer console' })
    await expect(page.getByRole('button', { name: 'Toggle developer console' })).toBeVisible()
    await page.mouse.click(640, 400)

    await page.keyboard.press('d')
    await expect(consolePane).toBeVisible()
    await page.keyboard.press('d')
    await expect(consolePane).toBeHidden()

    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    await expect(consolePane).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(consolePane).toBeHidden()

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true)
  })

  test('includes canonical and person schema metadata', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lowcash.dev')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /opengraph-image/)
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)
    const schemaContent = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((el) => el.textContent ?? '')
    expect(schemaContent).toContain('"@type":"Person"')
  })
})
