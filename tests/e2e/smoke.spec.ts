import { expect, test } from '@playwright/test'

const SECTION_IDS = [
  'hero',
  'who-i-am',
  'tech-journey',
  'notable-work',
  'work-experience',
  'education',
  'beyond-code',
  'whats-next',
  'contact',
] as const

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
    await expect(hero.getByText('Fullstack Developer', { exact: true })).toBeVisible()
  })

  test('contact section exposes primary external links', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)

    await expect(page.getByRole('link', { name: /Connect with me on GitHub/i })).toHaveAttribute(
      'href',
      'https://github.com/Lowcash',
    )
    await expect(page.getByRole('link', { name: /Connect with me on LinkedIn/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/lukáš-machala-00549114a',
    )
    await expect(page.getByRole('link', { name: /Connect with me on Email/i })).toHaveAttribute(
      'href',
      'mailto:lukas.lowcash@gmail.com',
    )
  })

  test('debug console toggles from keyboard without breaking layout', async ({ page }) => {
    await page.keyboard.press('d')
    await expect(page.getByRole('region', { name: 'Developer debug console' })).toBeVisible()

    await page.keyboard.press('d')
    await expect(page.getByRole('region', { name: 'Developer debug console' })).not.toBeVisible()
  })

  test('includes canonical and person schema metadata', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lowcash.dev')
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)
    const schemaContent = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((el) => el.textContent ?? '')
    expect(schemaContent).toContain('"@type":"Person"')
  })
})
