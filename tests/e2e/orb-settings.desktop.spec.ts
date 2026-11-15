import { type Page, expect, test } from '@playwright/test'

const rootVar = (page: Page, name: string) =>
  page.evaluate((cssVar) => getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim(), name)

const countOrbWaapiAnimations = (page: Page) =>
  page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((animation) => !(animation instanceof CSSAnimation) && !(animation instanceof CSSTransition))
        .filter((animation) => (animation.effect as KeyframeEffect | null)?.target?.classList.contains('orb')).length,
  )

async function openConsole(page: Page) {
  await page.getByRole('button', { name: 'Toggle developer console' }).click()
  await expect(page.getByRole('region', { name: 'Developer console' })).toBeVisible()
}

async function setSlider(page: Page, key: string, value: number) {
  await page.locator(`#orb-setting-${key}`).evaluate((element, nextValue) => {
    const input = element as HTMLInputElement
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, String(nextValue))
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, value)
}

test.describe('Orb settings and effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await openConsole(page)
  })

  test('size slider resizes the lights and the value survives a reload without opening the console', async ({
    page,
  }) => {
    const orb = page.locator('.orb-a')
    const defaultWidth = await orb.evaluate((element) => element.getBoundingClientRect().width)

    await setSlider(page, 'orbSize', 1.7)
    await expect.poll(() => rootVar(page, '--orb-size')).toBe('1.7')
    // The scale glides with the scene transition, so wait for it to arrive
    await expect
      .poll(() => orb.evaluate((element) => element.getBoundingClientRect().width), { timeout: 4000 })
      .toBeGreaterThan(defaultWidth * 1.5)

    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect.poll(() => rootVar(page, '--orb-size')).toBe('1.7')
  })

  test('hue shift recolors the status line, accents and lights', async ({ page }) => {
    const accentOf = () => page.evaluate(() => getComputedStyle(document.querySelector('.st-session')!).backgroundColor)
    const before = await accentOf()

    await setSlider(page, 'hue', 180)
    await expect.poll(() => rootVar(page, '--hue-shift')).toBe('180')
    await expect.poll(accentOf).not.toBe(before)
  })

  test('low blur turns the lights into crisp discs', async ({ page }) => {
    await setSlider(page, 'orbBlur', 0.2)

    // 0.2x blur gives the gradient a solid core: the first colour stop moves out to 80%
    const gradient = await page.locator('.orb-a i').evaluate((element) => getComputedStyle(element).backgroundImage)
    expect(gradient).toMatch(/\) 80%/)
  })

  test('animation speed changes the playback rate without restarting the animation', async ({ page }) => {
    const readRates = () =>
      page.evaluate(() =>
        document
          .getAnimations()
          .filter((animation) => animation instanceof CSSAnimation && animation.animationName.startsWith('drift'))
          .map((animation) => animation.playbackRate),
      )

    await setSlider(page, 'animationSpeed', 3)
    await expect.poll(async () => (await readRates()).length).toBe(3)
    await expect.poll(async () => (await readRates()).every((rate) => rate === 3)).toBe(true)
  })

  test('only sliders with a clearly visible effect are shown', async ({ page }) => {
    const consoleRegion = page.getByRole('region', { name: 'Developer console' })

    for (const key of [
      'animationSpeed',
      'orbSize',
      'orbOpacity',
      'orbBlur',
      'orbBrightness',
      'hue',
      'saturation',
      'magnetism',
      'burst',
    ]) {
      await expect(consoleRegion.locator(`#orb-setting-${key}`)).toHaveCount(1)
    }
    for (const key of ['scatter', 'grain', 'colorVariation']) {
      await expect(consoleRegion.locator(`#orb-setting-${key}`)).toHaveCount(0)
    }
  })

  test('changing burst plays a preview pulse on the orbs', async ({ page }) => {
    await setSlider(page, 'burst', 60)

    await expect.poll(() => countOrbWaapiAnimations(page)).toBeGreaterThan(0)
  })

  test('changing magnetism plays a preview swing', async ({ page }) => {
    // The swing is brief, so sample the pointer variable every frame instead of polling
    const peak = page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let max = 0
          const start = performance.now()
          const sample = () => {
            const x = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--orb-pointer-x')) || 0
            max = Math.max(max, Math.abs(x))
            if (performance.now() - start < 1600) requestAnimationFrame(sample)
            else resolve(max)
          }
          sample()
        }),
    )

    await setSlider(page, 'magnetism', 80)

    expect(await peak).toBeGreaterThan(0.2)
  })

  test('turning ripples on plays a preview ring', async ({ page }) => {
    await page
      .getByRole('region', { name: 'Developer console' })
      .getByRole('switch', { name: /CLICK RIPPLES/ })
      .click()

    await expect(page.locator('.orb-ripple')).toHaveCount(1)
  })

  test('presets apply a bundle of settings and reset restores the original look', async ({ page }) => {
    const consoleRegion = page.getByRole('region', { name: 'Developer console' })

    await consoleRegion.getByRole('button', { name: 'Neon' }).click()
    await expect.poll(() => rootVar(page, '--orb-blur')).toBe('0.45')
    await expect(consoleRegion.getByRole('switch', { name: /CLICK RIPPLES/ })).toHaveAttribute('aria-checked', 'true')

    await consoleRegion.getByRole('button', { name: 'RESET TO DEFAULT' }).click()
    await expect.poll(() => rootVar(page, '--orb-blur')).toBe('1')
    await expect.poll(() => rootVar(page, '--orb-size')).toBe('1')
    await expect(consoleRegion.getByRole('button', { name: 'Calm' })).toHaveAttribute('aria-pressed', 'true')
  })

  test('magnetism makes the orbs follow the cursor', async ({ page }) => {
    await setSlider(page, 'magnetism', 100)

    await page.mouse.move(100, 100)
    await page.mouse.move(1200, 700, { steps: 5 })

    await expect.poll(async () => parseFloat(await rootVar(page, '--orb-pointer-x'))).toBeGreaterThan(0.2)
  })

  test('click ripples spawn a ring on the background but not on interactive elements', async ({ page }) => {
    await page
      .getByRole('region', { name: 'Developer console' })
      .getByRole('button', { name: 'Close developer console' })
      .first()
      .click()

    await page.evaluate(() => localStorage.setItem('orb_ripples', '1'))
    await page.reload()
    await page.waitForLoadState('networkidle')

    await page.mouse.click(640, 700)
    await expect(page.locator('.orb-ripple')).toHaveCount(1)
    await expect(page.locator('.orb-ripple')).toHaveCount(0)

    await page.getByRole('link', { name: 'Projects' }).first().click()
    await expect(page.locator('.orb-ripple')).toHaveCount(0)
  })

  test('section burst pulses the orbs when a new section becomes active', async ({ page }) => {
    await setSlider(page, 'burst', 100)

    await page.evaluate(() => {
      const target = document.getElementById('featured-projects')
      window.scrollTo({ top: target ? target.offsetTop : 0, behavior: 'instant' })
    })

    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((animation) => !(animation instanceof CSSAnimation) && !(animation instanceof CSSTransition))
              .filter((animation) => (animation.effect as KeyframeEffect | null)?.target?.classList.contains('orb'))
              .length,
        ),
      )
      .toBeGreaterThan(0)
  })
})
