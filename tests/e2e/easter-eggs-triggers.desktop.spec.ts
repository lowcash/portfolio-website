import { type Page, expect, test } from '@playwright/test'

/** Every achievement has a working trigger. (Triple-click, copy, navigation and the sections are in easter-eggs.desktop.spec.ts.) */
const readUnlocked = (page: Page) =>
  page.evaluate(() => {
    const saved = localStorage.getItem('achievements')
    return saved
      ? (JSON.parse(saved) as Array<{ id: string; unlocked: boolean }>).filter((a) => a.unlocked).map((a) => a.id)
      : []
  })

const isUnlocked = async (page: Page, id: string) => (await readUnlocked(page)).includes(id)

async function open(page: Page, init?: () => void) {
  await page.addInitScript(() => localStorage.setItem('dev_console_opened', 'true'))
  if (init) await page.addInitScript(init)
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('button', { name: 'Toggle developer console' })).toBeVisible()
  // The achievement layer mounts when the browser is idle
  await expect(page.locator('.st-ach')).toBeVisible()
  await page.waitForTimeout(500)
}

const scrollTo = async (page: Page, top: number | 'max') => {
  await page.evaluate((target) => {
    const max = document.documentElement.scrollHeight - innerHeight
    window.scrollTo({ top: target === 'max' ? max : target, behavior: 'instant' })
  }, top)
  await page.waitForTimeout(350)
}

test.describe('Every achievement has a working trigger', () => {
  test('Perfectly Balanced: resting at 50% of the page', async ({ page }) => {
    await open(page)
    const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
    await scrollTo(page, max / 2)
    await expect.poll(() => isUnlocked(page, 'perfectly-balanced')).toBe(true)
  })

  test('Patience is a Virtue: 60 s of idle after the first interaction', async ({ page }) => {
    await page.clock.install()
    await open(page)
    await page.mouse.click(5, 400)
    await page.clock.fastForward(61_000)
    await expect.poll(() => isUnlocked(page, 'patience')).toBe(true)
  })

  test('Click Master: ten clicks in two seconds', async ({ page }) => {
    await open(page)
    for (let index = 0; index < 10; index += 1) await page.mouse.click(5, 400)
    await expect.poll(() => isUnlocked(page, 'rapid-clicker')).toBe(true)
  })

  test('Shake It Off: swinging the mouse side to side with real-mouse sized steps', async ({ page }) => {
    await open(page)
    await page.mouse.move(400, 400)
    for (let swing = 0; swing < 8; swing += 1) {
      await page.mouse.move(swing % 2 === 0 ? 700 : 400, 400, { steps: 12 })
    }
    await expect.poll(() => isUnlocked(page, 'shake')).toBe(true)
  })

  test('Shake It Off does not fire on a plain mouse move', async ({ page }) => {
    await open(page)
    await page.mouse.move(100, 100)
    await page.mouse.move(1200, 700, { steps: 30 })
    await page.waitForTimeout(300)
    expect(await isUnlocked(page, 'shake')).toBe(false)
  })

  test('Marathon Runner: ten thousand pixels scrolled in total', async ({ page }) => {
    await open(page)
    const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
    for (let lap = 0; lap < Math.ceil(10_500 / max) + 1; lap += 1) {
      await scrollTo(page, 'max')
      await scrollTo(page, 0)
    }
    await expect.poll(() => isUnlocked(page, 'marathon-runner')).toBe(true)
  })

  test('Speed Reader: reaching the bottom quickly', async ({ page }) => {
    await open(page)
    await scrollTo(page, 'max')
    await expect.poll(() => isUnlocked(page, 'speed-reader')).toBe(true)
  })

  test('Repeat Visitor: the third visit unlocks it', async ({ page }) => {
    await open(page, () => {
      if (!localStorage.getItem('visit_count')) localStorage.setItem('visit_count', '2')
    })
    await expect.poll(() => isUnlocked(page, 'repeat-visitor')).toBe(true)
  })

  test('Settings Tinkerer: five separate changes', async ({ page }) => {
    await open(page)
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const dialog = page.getByRole('dialog', { name: 'Developer console' })
    for (const name of ['Vivid', 'Mono', 'Still', 'Lively', 'Calm']) {
      await dialog.getByRole('button', { name, exact: true }).click()
      await page.waitForTimeout(500)
    }
    await expect.poll(() => isUnlocked(page, 'settings-tinkerer')).toBe(true)
  })

  test('Back to Origin: contact, then back to the intro', async ({ page }) => {
    await open(page)
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }))
    await page.waitForTimeout(350)
    await scrollTo(page, 0)
    await expect.poll(() => isUnlocked(page, 'back-to-origin')).toBe(true)
  })

  test('the toast shows the progress and the status line counter opens the console', async ({ page }) => {
    await open(page)
    await page.evaluate(() => document.dispatchEvent(new Event('copy')))
    await expect(page.getByTestId('achievement-toast')).toContainText(/Copy Cat · 1\/16/)
    await expect(page.locator('.st-ach')).toContainText('1/16')

    await page.locator('.st-ach').click()
    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeVisible()
  })

  test('collected achievements survive a reload and show in the console', async ({ page }) => {
    await open(page)
    await page.evaluate(() => document.dispatchEvent(new Event('copy')))
    await expect.poll(() => isUnlocked(page, 'copy-cat')).toBe(true)

    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.st-ach')).toContainText('1/16')
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    await expect(page.locator('.tiles button[data-on]')).toHaveCount(1)
  })
})
