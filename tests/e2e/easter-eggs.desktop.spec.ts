import { type Page, expect, test } from '@playwright/test'

const SECTION_IDS = ['hero', 'featured-projects', 'experience', 'contact'] as const

const readAchievements = (page: Page) =>
  page.evaluate(() => {
    const saved = localStorage.getItem('achievements')
    return saved ? (JSON.parse(saved) as Array<{ id: string; unlocked: boolean }>) : []
  })

const isUnlocked = async (page: Page, id: string) =>
  (await readAchievements(page)).find((achievement) => achievement.id === id)?.unlocked === true

async function openPageWithAchievements(page: Page, seed?: { id: string; unlocked: boolean }[]) {
  await page.addInitScript((seedValue) => {
    localStorage.setItem('dev_console_opened', 'true')
    if (seedValue && !localStorage.getItem('achievements')) {
      localStorage.setItem('achievements', JSON.stringify(seedValue))
    }
  }, seed)

  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('button', { name: 'Toggle debug console' })).toBeAttached()
}

async function scrollToSection(page: Page, id: string) {
  await page.evaluate((sectionId) => {
    const section = document.getElementById(sectionId)
    window.scrollTo({ top: section ? section.offsetTop : 0, behavior: 'instant' })
  }, id)
  await page.waitForTimeout(250)
}

test.describe('Easter eggs and achievements', () => {
  test('triple-clicking the hero heading unlocks Speed Clicker', async ({ page }) => {
    await openPageWithAchievements(page)

    // One gesture with three clicks; separate Playwright clicks are slower than the 500ms triple-click window
    await page.locator('#hero h1').click({ clickCount: 3 })

    await expect.poll(() => isUnlocked(page, 'triple-click')).toBe(true)
  })

  test('copying text unlocks Copy Cat', async ({ page }) => {
    await openPageWithAchievements(page)

    await page.evaluate(() => document.dispatchEvent(new Event('copy')))

    await expect.poll(() => isUnlocked(page, 'copy-cat')).toBe(true)
  })

  test('visiting sections unlocks Section Hopper and World Tour', async ({ page }) => {
    await openPageWithAchievements(page)

    for (const id of SECTION_IDS) {
      await scrollToSection(page, id)
    }

    await expect.poll(() => isUnlocked(page, 'section-hopper')).toBe(true)
    await expect.poll(() => isUnlocked(page, 'world-tour')).toBe(true)
  })

  test('Enlightenment is reachable: unlocking the last achievement lights up the page', async ({ page }) => {
    const ids = [
      'triple-click',
      'perfectly-balanced',
      'patience',
      'rapid-clicker',
      'copy-cat',
      'shake',
      'marathon-runner',
      'speed-reader',
      'repeat-visitor',
      'world-tour',
      'settings-tinkerer',
      'nav-master',
      'round-trip',
      'back-to-origin',
    ]
    // Everything except Section Hopper (the one that used to be impossible) and Enlightenment itself
    await openPageWithAchievements(page, [
      ...ids.map((id) => ({ id, name: id, description: id, icon: '*', unlocked: true })),
      { id: 'section-hopper', name: 'Section Hopper', description: '', icon: '*', unlocked: false },
      { id: 'enlightenment', name: 'Enlightenment', description: '', icon: '*', unlocked: false },
    ])

    for (const id of SECTION_IDS) {
      await scrollToSection(page, id)
    }

    await expect.poll(() => isUnlocked(page, 'enlightenment')).toBe(true)
    await expect(page.locator('html')).toHaveAttribute('data-enlightened', 'true')
  })

  test('nothing is tracked until the developer console has been opened once', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('button', { name: 'Toggle debug console' })).toBeAttached()

    await page.evaluate(() => document.dispatchEvent(new Event('copy')))
    await page.waitForTimeout(300)

    expect(await isUnlocked(page, 'copy-cat')).toBe(false)
  })
})
