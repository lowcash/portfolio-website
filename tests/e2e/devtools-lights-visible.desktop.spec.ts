import { type Page, expect, test } from '@playwright/test'

/**
 * Does every preset and every slider extreme visibly change the page? Measured on real pixels of the strip above the
 * open console: mean absolute RGB difference (0-255) and the share of pixels that moved by at least 2 levels.
 */
const CLIP = { x: 0, y: 0, width: 1440, height: 320 }

async function freezeDrift(page: Page) {
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      if (animation instanceof CSSAnimation && animation.animationName.startsWith('drift')) {
        animation.pause()
        animation.currentTime = 0
      }
    }
  })
}

async function settle(page: Page) {
  // Physics demo shove (physics sliders) dies down well within this
  await page.waitForTimeout(3500)
  await freezeDrift(page)
  await page.waitForTimeout(200)
}

const shot = async (page: Page) => (await page.screenshot({ clip: CLIP })).toString('base64')

async function diff(page: Page, a: string, b: string) {
  return page.evaluate(
    async ({ a, b }) => {
      const pixels = async (png: string) => {
        const image = new Image()
        image.src = `data:image/png;base64,${png}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')!
        context.drawImage(image, 0, 0)
        return context.getImageData(0, 0, image.width, image.height).data
      }
      const [first, second] = await Promise.all([pixels(a), pixels(b)])
      let sum = 0
      let moved = 0
      let max = 0

      for (let index = 0; index < first.length; index += 4) {
        const delta =
          (Math.abs(first[index] - second[index]) +
            Math.abs(first[index + 1] - second[index + 1]) +
            Math.abs(first[index + 2] - second[index + 2])) /
          3
        sum += delta
        max = Math.max(max, delta)
        if (delta >= 2) moved += 1
      }

      const count = first.length / 4

      return { mean: sum / count, moved: moved / count, max }
    },
    { a, b },
  )
}

async function setSlider(page: Page, key: string, value: number) {
  await page.locator(`#orb-setting-${key}`).evaluate((element, nextValue) => {
    const input = element as HTMLInputElement
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, String(nextValue))
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }, value)
}

const report: string[] = []

test.describe('Dev console effects are visible', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    await expect(page.getByRole('dialog', { name: 'Developer console' })).toBeVisible()
    await page.getByRole('button', { name: 'RESET TO DEFAULT' }).click()
    await settle(page)
  })

  test.afterAll(() => console.log(`\n${report.join('\n')}`))

  for (const preset of ['Still', 'Lively', 'Vivid', 'Mono']) {
    test(`preset ${preset} changes the picture`, async ({ page }) => {
      const base = await shot(page)
      await page.getByRole('button', { name: preset, exact: true }).click()
      await settle(page)
      const result = await diff(page, base, await shot(page))
      report.push(
        `preset ${preset}: mean ${result.mean.toFixed(2)} moved ${(result.moved * 100).toFixed(1)}% max ${result.max.toFixed(0)}`,
      )
      expect(result.mean).toBeGreaterThan(0.3)
    })
  }

  test('preset Lively also moves the lights further than Calm when the cursor moves', async ({ page }) => {
    const reach = async () => {
      await page.mouse.move(1400, 880, { steps: 10 })
      await page.waitForTimeout(3000)
      const offset = await page.locator('.orb-a').evaluate((element) => {
        const [x = '0', y = '0'] = ((element as HTMLElement).style.translate || '0px 0px').split(' ')
        return Math.hypot(parseFloat(x), parseFloat(y))
      })
      await page.mouse.move(720, 450)
      return offset
    }
    const calm = await reach()
    await page.getByRole('button', { name: 'Lively', exact: true }).click()
    await page.waitForTimeout(3000)
    const lively = await reach()
    report.push(`preset Lively motion: cursor reach ${calm.toFixed(1)}px (Calm) -> ${lively.toFixed(1)}px`)
    expect(lively).toBeGreaterThan(calm * 2)
  })

  const extremes: Array<[string, number, number]> = [
    ['orbSize', 0.5, 1.6],
    ['orbOpacity', 0, 2],
    ['orbBlur', 0.1, 0.1],
    ['hue', 180, 180],
    ['saturation', 0, 2],
  ]

  for (const [key, low, high] of extremes) {
    for (const value of [...new Set([low, high])]) {
      test(`slider ${key} at ${value}`, async ({ page }) => {
        const base = await shot(page)
        await setSlider(page, key, value)
        await settle(page)
        const result = await diff(page, base, await shot(page))
        report.push(
          `slider ${key}=${value}: mean ${result.mean.toFixed(2)} moved ${(result.moved * 100).toFixed(1)}% max ${result.max.toFixed(0)}`,
        )
        expect(result.mean).toBeGreaterThan(0.3)
      })
    }
  }
})
