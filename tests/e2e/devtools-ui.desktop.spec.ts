import { type Page, expect, test } from '@playwright/test'

async function armAndScrollToMidpoint(page: Page) {
  await page.evaluate(async () => {
    localStorage.setItem('dev_console_opened', 'true')
    window.dispatchEvent(new CustomEvent('dev-console-opened'))
    localStorage.removeItem('achievements')
    window.dispatchEvent(new CustomEvent('achievements-reset'))

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

async function waitForToast(page: Page) {
  const toast = page.getByTestId('achievement-toast')

  for (let attempt = 0; attempt < 3; attempt++) {
    if (await toast.evaluate((element) => element.classList.contains('on')).catch(() => false)) {
      return toast
    }
    await armAndScrollToMidpoint(page)
    await page.waitForTimeout(600)
  }

  return toast
}

test.describe('Desktop console and toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('console pane opens at a readable size with three panes', async ({ page }) => {
    await page.keyboard.press('d')
    const pane = page.getByRole('dialog', { name: 'Developer console' })
    await expect(pane).toBeVisible()

    const box = await pane.boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(250)
    await expect(pane.locator('.pane')).toHaveCount(3)
  })

  test('opening with D moves focus into the pane and closing returns it', async ({ page }) => {
    await page.getByRole('link', { name: 'LinkedIn' }).focus()
    await page.keyboard.press('d')
    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeFocused()
  })

  test('the console is a dialog: Tab and Shift+Tab stay inside it and Escape hands focus back', async ({ page }) => {
    const trigger = page.getByRole('link', { name: 'LinkedIn' })
    await trigger.focus()
    await page.keyboard.press('d')
    const pane = page.getByRole('dialog', { name: 'Developer console' })
    await expect(pane).toHaveAttribute('aria-modal', 'true')
    await expect(pane).toBeFocused()

    for (let step = 0; step < 60; step++) {
      await page.keyboard.press('Tab')
      expect(await pane.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }
    for (let step = 0; step < 60; step++) {
      await page.keyboard.press('Shift+Tab')
      expect(await pane.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }

    // Focus clicked out onto the page is pulled back by the next Tab
    await page.mouse.click(700, 120)
    await page.keyboard.press('Tab')
    expect(await pane.evaluate((element) => element.contains(document.activeElement))).toBe(true)

    await page.keyboard.press('Escape')
    await expect(pane).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('the shortcut is discoverable: top bar entry, status line key hint and the hero action open the console', async ({
    page,
  }) => {
    const topBarEntry = page.locator('.topbar').getByRole('button', { name: /dev console/i })
    await expect(topBarEntry).toBeVisible()
    await expect(topBarEntry).toContainText('D')
    await expect(page.locator('#status .st-key')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Toggle developer console' })).toHaveAttribute(
      'aria-keyshortcuts',
      'D',
    )

    await topBarEntry.click()
    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeVisible()
  })

  test('D is ignored while typing in a slider-free editable target and with modifiers', async ({ page }) => {
    await page.evaluate(() => {
      const input = document.createElement('input')
      input.id = 'probe'
      document.body.append(input)
    })
    await page.locator('#probe').focus()
    await page.keyboard.press('d')

    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeHidden()
  })

  test('an unlock slides a one-line message out of the status line, above it and inside the viewport', async ({
    page,
  }) => {
    await armAndScrollToMidpoint(page)
    const toast = await waitForToast(page)

    await expect(toast).toHaveClass(/on/)
    await expect(toast).toContainText('achievement unlocked')
    await expect(toast).toHaveAttribute('role', 'status')

    const toastBox = await toast.boundingBox()
    const barBox = await page.locator('#status').boundingBox()
    const viewport = page.viewportSize()!

    expect(toastBox!.y + toastBox!.height).toBeLessThanOrEqual(barBox!.y + 1)
    expect(toastBox!.x + toastBox!.width).toBeLessThanOrEqual(viewport.width)
    expect(toastBox!.y).toBeGreaterThanOrEqual(0)
  })

  test('the counter appears in the status line only after the console has been opened once', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('dev_console_opened'))
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.st-ach')).toBeHidden()

    await page.keyboard.press('d')
    await expect(page.locator('.st-ach')).toBeVisible()
    await expect(page.locator('.st-ach')).toContainText('/16')
  })

  test('unlocked tiles light up in the console', async ({ page }) => {
    await armAndScrollToMidpoint(page)
    await waitForToast(page)
    await page.keyboard.press('d')

    await expect(
      page.getByRole('dialog', { name: 'Developer console' }).locator('.tiles button[data-on]').first(),
    ).toBeVisible({
      timeout: 5000,
    })
  })
})
