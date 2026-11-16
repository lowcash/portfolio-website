import { type Page, expect, test } from '@playwright/test'

const rootVar = (page: Page, name: string) =>
  page.evaluate((cssVar) => getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim(), name)

/** The physics loop writes the individual `translate` property inline: "x y" in px, empty at rest from the start */
const orbOffset = (page: Page, selector = '.orb-a') =>
  page.locator(selector).evaluate((element) => {
    const [x = '0', y = '0'] = ((element as HTMLElement).style.translate || '0px 0px').split(' ')
    return { x: parseFloat(x), y: parseFloat(y) }
  })

async function openConsole(page: Page) {
  await page.getByRole('button', { name: 'Toggle developer console' }).click()
  await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeVisible()
}

async function setSlider(page: Page, key: string, value: number) {
  await page.locator(`#orb-setting-${key}`).evaluate((element, nextValue) => {
    const input = element as HTMLInputElement
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, String(nextValue))
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, value)
}

/** Waits until the three lights stopped moving (the preview shove of a settings change has died down). */
async function waitForRest(page: Page) {
  let previous = { x: Infinity, y: Infinity }

  await expect
    .poll(
      async () => {
        const current = await orbOffset(page)
        const isStill = Math.abs(current.x - previous.x) < 0.3 && Math.abs(current.y - previous.y) < 0.3
        previous = current
        return isStill
      },
      { timeout: 25_000, intervals: [400] },
    )
    .toBe(true)
}

/** Samples the x offset of the first light every frame for `ms`. */
const sampleOffsetX = (page: Page, ms: number) =>
  page.evaluate(
    (duration) =>
      new Promise<number[]>((resolve) => {
        const values: number[] = []
        const start = performance.now()
        const sample = () => {
          const raw = (document.querySelector('.orb-a') as HTMLElement).style.translate || '0px 0px'
          values.push(parseFloat(raw.split(' ')[0]))
          if (performance.now() - start < duration) requestAnimationFrame(sample)
          else resolve(values)
        }
        sample()
      }),
    ms,
  )

test.describe('Orb controls: every one has a visible effect', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await openConsole(page)
  })

  test('the console offers exactly the ten controls that do something', async ({ page }) => {
    const consoleDialog = page.getByRole('dialog', { name: 'Developer console' })

    for (const key of [
      'animationSpeed',
      'orbSize',
      'orbOpacity',
      'orbBlur',
      'hue',
      'saturation',
      'pointer',
      'damping',
      'parallax',
    ]) {
      await expect(consoleDialog.locator(`#orb-setting-${key}`)).toHaveCount(1)
    }
    await expect(consoleDialog.getByRole('switch', { name: /CLICK NUDGE/ })).toHaveCount(1)
    await expect(consoleDialog.locator('.knob')).toHaveCount(10)

    for (const key of ['orbBrightness', 'magnetism', 'burst', 'scatter', 'grain']) {
      await expect(consoleDialog.locator(`#orb-setting-${key}`)).toHaveCount(0)
    }
  })

  test('drift speed changes the playback rate without restarting the animation', async ({ page }) => {
    const readRates = () =>
      page.evaluate(() =>
        document
          .getAnimations()
          .filter((animation) => animation instanceof CSSAnimation && animation.animationName.startsWith('drift'))
          .map((animation) => animation.playbackRate),
      )

    await setSlider(page, 'animationSpeed', 3)
    await expect.poll(async () => (await readRates()).length).toBe(6)
    await expect.poll(async () => (await readRates()).every((rate) => rate === 3)).toBe(true)
  })

  test('size resizes the lights and the value survives a reload without opening the console', async ({ page }) => {
    const orb = page.locator('.orb-a')
    const defaultWidth = await orb.evaluate((element) => element.getBoundingClientRect().width)

    await setSlider(page, 'orbSize', 1.5)
    await expect.poll(() => rootVar(page, '--orb-size')).toBe('1.5')
    // The scale glides with the scene transition, so wait for it to arrive
    await expect
      .poll(() => orb.evaluate((element) => element.getBoundingClientRect().width), { timeout: 4000 })
      .toBeGreaterThan(defaultWidth * 1.4)

    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect.poll(() => rootVar(page, '--orb-size')).toBe('1.5')
  })

  test('intensity fades the lights out and lifts the light colour above 100%', async ({ page }) => {
    const readOpacity = () =>
      page.locator('.orb-a').evaluate((element) => parseFloat(getComputedStyle(element).opacity))
    const readGradient = () => page.locator('.orb-a i').evaluate((element) => getComputedStyle(element).backgroundImage)

    await expect.poll(readOpacity, { timeout: 8000 }).toBeGreaterThan(0.5)
    const defaultGradient = await readGradient()

    await setSlider(page, 'orbOpacity', 0)
    await expect.poll(readOpacity, { timeout: 9000 }).toBe(0)

    await setSlider(page, 'orbOpacity', 2)
    await expect.poll(readGradient).not.toBe(defaultGradient)
  })

  test('softness turns the lights into crisp discs when lowered', async ({ page }) => {
    await setSlider(page, 'orbBlur', 0.2)

    // 0.2x softness gives the gradient a solid core: the first colour stop moves out to 80%
    const gradient = await page.locator('.orb-a i').evaluate((element) => getComputedStyle(element).backgroundImage)
    expect(gradient).toMatch(/\) 80%/)
  })

  test('hue shift recolours the status line, accents and the lights', async ({ page }) => {
    const accentOf = () => page.evaluate(() => getComputedStyle(document.querySelector('.st-session')!).backgroundColor)
    const gradientOf = () => page.locator('.orb-b i').evaluate((element) => getComputedStyle(element).backgroundImage)
    const [accent, gradient] = [await accentOf(), await gradientOf()]

    await setSlider(page, 'hue', 180)
    await expect.poll(() => rootVar(page, '--hue-shift')).toBe('180')
    await expect.poll(accentOf).not.toBe(accent)
    await expect.poll(gradientOf).not.toBe(gradient)
  })

  test('saturation drains the colour: 0% makes the accent and the lights grey', async ({ page }) => {
    await setSlider(page, 'saturation', 0)
    await expect.poll(() => rootVar(page, '--sat')).toBe('0')

    const accentSpread = () =>
      page.evaluate(() => {
        const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
        probe.fillStyle = getComputedStyle(document.querySelector('.st-session')!).backgroundColor
        probe.fillRect(0, 0, 1, 1)
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
        return Math.max(r, g, b) - Math.min(r, g, b)
      })

    // The accent glides there with a colour transition
    await expect.poll(accentSpread).toBeLessThanOrEqual(3)
    expect(await page.locator('.orb-a i').evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(
      ' 0 ',
    )
  })

  test('pointer push: the lights give way to the cursor, and not at 0%', async ({ page }) => {
    await setSlider(page, 'parallax', 0)
    await setSlider(page, 'pointer', 100)
    await waitForRest(page)

    await page.mouse.move(640, 400)
    await page.mouse.move(1260, 400, { steps: 6 })
    await expect.poll(async () => (await orbOffset(page)).x, { timeout: 4000 }).toBeLessThan(-30)

    await setSlider(page, 'pointer', 0)
    await expect.poll(async () => Math.abs((await orbOffset(page)).x), { timeout: 8000 }).toBeLessThan(1)
  })

  test('spring damping: a loose spring overshoots, a heavy one glides in', async ({ page }) => {
    test.setTimeout(90_000)
    await setSlider(page, 'parallax', 0)
    await setSlider(page, 'pointer', 100)

    const overshootAt = async (damping: number) => {
      await setSlider(page, 'damping', damping)
      await page.mouse.move(640, 400)
      await waitForRest(page)
      const samples = sampleOffsetX(page, 3000)
      await page.mouse.move(1260, 400)
      const values = await samples
      const final = values[values.length - 1]

      return Math.min(...values) - final
    }

    expect(await overshootAt(1.5)).toBeGreaterThan(-1)
    expect(await overshootAt(0.15)).toBeLessThan(-6)
  })

  test('scroll parallax: the lights trail the scroll position, and not at 0%', async ({ page }) => {
    await setSlider(page, 'pointer', 0)
    await setSlider(page, 'parallax', 100)
    await waitForRest(page)
    const top = await orbOffset(page)

    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await expect.poll(async () => (await orbOffset(page)).y, { timeout: 4000 }).toBeLessThan(top.y - 40)

    await setSlider(page, 'parallax', 0)
    await expect.poll(async () => Math.abs((await orbOffset(page)).y), { timeout: 8000 }).toBeLessThan(1)
  })

  test('click nudge: a click on the background shoves the lights, a click on a control does not', async ({ page }) => {
    await setSlider(page, 'pointer', 0)
    await setSlider(page, 'parallax', 0)
    await page.getByRole('button', { name: 'Close developer console' }).click()
    await waitForRest(page)

    const peakAfter = async (click: () => Promise<void>) => {
      const samples = sampleOffsetX(page, 1200)
      await click()
      return Math.max(...(await samples).map(Math.abs))
    }

    expect(await peakAfter(() => page.mouse.click(1100, 300))).toBeGreaterThan(8)
    await waitForRest(page)
    expect(
      await peakAfter(() =>
        page
          .locator('#hero')
          .getByRole('link', { name: 'See projects' })
          .evaluate((element) => {
            element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
          }),
      ),
    ).toBeLessThan(1)
  })

  test('presets apply a bundle of settings and reset restores the calm look', async ({ page }) => {
    const consoleDialog = page.getByRole('dialog', { name: 'Developer console' })

    await consoleDialog.getByRole('button', { name: 'Vivid' }).click()
    await expect.poll(() => rootVar(page, '--sat')).toBe('1.6')
    await expect.poll(() => rootVar(page, '--orb-size')).toBe('1.3')

    await expect(consoleDialog.locator('.preset-note')).toContainText('saturation 160%')
    await consoleDialog.getByRole('button', { name: 'Still' }).hover()
    await expect(consoleDialog.locator('.preset-note')).toContainText('intensity 35%')

    await consoleDialog.getByRole('button', { name: 'Still' }).click()
    await expect(consoleDialog.getByRole('switch', { name: /CLICK NUDGE/ })).toHaveAttribute('aria-checked', 'false')

    await consoleDialog.getByRole('button', { name: 'RESET TO DEFAULT' }).click()
    await expect.poll(() => rootVar(page, '--orb-blur')).toBe('1')
    await expect.poll(() => rootVar(page, '--orb-size')).toBe('1')
    await expect(consoleDialog.getByRole('button', { name: 'Calm' })).toHaveAttribute('aria-pressed', 'true')
  })
})

test.describe('Calm defaults and motion preferences', () => {
  test('the default lights are barely there: low alpha, muted colour, a slow drift cycle of 44 to 60 seconds', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const look = await page.evaluate(() => {
      const gradient = getComputedStyle(document.querySelector('.orb-a i')!).backgroundImage
      const alphas = [...gradient.matchAll(/\/ ([\d.]+)\)/g)].map((match) => parseFloat(match[1]))
      const chroma = [...gradient.matchAll(/oklch\(([\d.]+) ([\d.]+)/g)].map((match) => parseFloat(match[2]))
      const timings = document
        .getAnimations()
        .filter((animation) => animation instanceof CSSAnimation && animation.animationName.startsWith('drift'))
        .map((animation) => animation.effect!.getTiming())
      // One cycle is the full way out and back: twice the duration when the animation alternates
      const cycles = timings.map(
        (timing) => ((timing.duration as number) / 1000) * (timing.direction === 'alternate' ? 2 : 1),
      )

      return {
        peakAlpha: Math.max(...alphas),
        peakChroma: Math.max(...chroma),
        shortestCycle: Math.min(...cycles),
        longestCycle: Math.max(...cycles),
        count: cycles.length,
      }
    })

    expect(look.peakAlpha).toBeLessThanOrEqual(0.25)
    expect(look.peakChroma).toBeLessThanOrEqual(0.14)
    expect(look.count).toBe(6)
    // Subconscious: one full drift cycle takes 44 to 60 seconds
    expect(look.shortestCycle).toBeGreaterThanOrEqual(40)
    expect(look.longestCycle).toBeLessThanOrEqual(60)
  })

  test('with reduced motion there is no physics: the lights stay put and the physics sliders are disabled', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.mouse.move(100, 100)
    await page.mouse.move(1200, 700, { steps: 8 })
    await page.mouse.click(900, 300)
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }))
    await page.waitForTimeout(600)

    expect(await page.locator('.orb-a').evaluate((element) => (element as HTMLElement).style.translate)).toBe('')
    const driftAnimations = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation instanceof CSSAnimation && animation.animationName.startsWith('drift'))
          .length,
    )
    expect(driftAnimations).toBe(0)

    await openConsole(page)
    for (const key of ['pointer', 'damping', 'parallax']) {
      await expect(page.locator(`#orb-setting-${key}`)).toBeDisabled()
    }
    await expect(page.locator('#orb-setting-orbSize')).toBeEnabled()
  })
})

test.describe('Physics cost', () => {
  test('one rAF loop, sleeping at rest, a fraction of a millisecond per frame while moving', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __raf: { durations: number[]; calls: number } }
      w.__raf = { durations: [], calls: 0 }
      const original = window.requestAnimationFrame.bind(window)

      window.requestAnimationFrame = (callback) =>
        original((time) => {
          const start = performance.now()
          callback(time)
          w.__raf.durations.push(performance.now() - start)
          w.__raf.calls += 1
        })
    })
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(4000)

    // At rest only the (idle) page-level loops may run: the physics loop sleeps
    const readCalls = () => page.evaluate(() => (window as unknown as { __raf: { calls: number } }).__raf.calls)
    const before = await readCalls()
    await page.waitForTimeout(1000)
    const idleCallsPerSecond = (await readCalls()) - before

    await page.evaluate(() => {
      ;(window as unknown as { __raf: { durations: number[] } }).__raf.durations = []
    })
    const movingBefore = await readCalls()
    for (let step = 0; step < 60; step++) {
      await page.mouse.move(200 + step * 15, 150 + Math.sin(step / 5) * 200)
      await page.mouse.wheel(0, 12)
      await page.waitForTimeout(16)
    }
    const movingCalls = (await readCalls()) - movingBefore
    const durations = await page.evaluate(
      () => (window as unknown as { __raf: { durations: number[] } }).__raf.durations,
    )
    const sorted = [...durations].sort((a, b) => a - b)
    const stats = {
      idleCallsPerSecond,
      movingCalls,
      callbacks: durations.length,
      meanMs: +(durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(3),
      p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(3),
      maxMs: +sorted[sorted.length - 1].toFixed(3),
    }
    console.log(`orb rAF cost: ${JSON.stringify(stats)}`)

    expect(idleCallsPerSecond).toBeLessThanOrEqual(2)
    expect(stats.p95Ms).toBeLessThan(2)
  })
})
