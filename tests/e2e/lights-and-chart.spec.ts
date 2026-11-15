import { expect, test } from '@playwright/test'

test.describe('Lights, scenes and the hero chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('three lights, no blur filter and no backdrop filter anywhere', async ({ page }) => {
    await expect(page.locator('.orb')).toHaveCount(3)

    const filtered = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll('*')).filter((element) => {
          const style = getComputedStyle(element)
          return style.filter.includes('blur') || style.backdropFilter.includes('blur')
        }).length,
    )
    expect(filtered).toBe(0)
  })

  test('the scene follows the section', async ({ page }) => {
    for (const [id, scene] of [
      ['featured-projects', 'projects'],
      ['experience', 'experience'],
      ['contact', 'contact'],
    ] as const) {
      await page.evaluate((target) => document.getElementById(target)?.scrollIntoView({ behavior: 'instant' }), id)
      await expect(page.locator('html')).toHaveAttribute('data-scene', scene)
    }
  })

  test('the lights move with transform only: positions change with the scene', async ({ page }) => {
    const first = await page.locator('.orb-a').evaluate((element) => getComputedStyle(element).transform)
    await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }))
    await expect(page.locator('html')).toHaveAttribute('data-scene', 'contact')
    await expect
      .poll(() => page.locator('.orb-a').evaluate((element) => getComputedStyle(element).transform), { timeout: 4000 })
      .not.toBe(first)
  })

  test('the chart is in the server HTML: 160 points, seed caption, grid lines', async ({ request }) => {
    const html = await (await request.get('/')).text()

    expect(html).toContain('fig. 0 — a random walk, seed ')
    expect(html).toMatch(/id="series"[^>]*points="([^"]+)"/)
    const points = html
      .match(/id="series"[^>]*points="([^"]+)"/)![1]
      .trim()
      .split(' ')
    expect(points).toHaveLength(160)
    expect(html).toContain('class="gl"')
  })

  test('the crosshair snaps a readout to the series on fine pointers', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The crosshair is for fine pointers only')
    const hero = await page.locator('#hero').boundingBox()
    await page.mouse.move(hero!.x + 400, hero!.y + 300)
    await page.mouse.move(hero!.x + 640, hero!.y + 320, { steps: 4 })

    await expect(page.locator('.xh')).toHaveClass(/on/)
    await expect(page.locator('.xh-read')).toHaveText(/^t\+\d{3}\s+\d\.\d{4}$/)
  })

  test('the name is the largest contentful element and is never animated', async ({ page }) => {
    const animations = await page.evaluate(() => {
      const name = document.querySelector('#hero .name')!
      return name.getAnimations({ subtree: true }).length + (name.closest('h1')?.getAnimations().length ?? 0)
    })
    expect(animations).toBe(0)
  })

  test('hovering the drum and bass link makes the lights beat at 174 BPM', async ({ page }) => {
    await page.locator('#experience').scrollIntoViewIfNeeded()
    await page.getByRole('link', { name: /^Lowcash$/ }).hover()

    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.querySelector('.orbs')!).animationName))
      .toBe('beat')
  })

  test('the scroll hairline is driven by a scroll timeline where supported, by --p elsewhere', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'instant' }))
    await page.waitForTimeout(400)

    const { timeline, scaleX } = await page.evaluate(() => {
      const bar = document.querySelector('.st-progress') as HTMLElement
      const style = getComputedStyle(bar)
      return {
        timeline: CSS.supports('animation-timeline: scroll()'),
        scaleX: new DOMMatrixReadOnly(style.transform).a,
      }
    })

    expect(scaleX).toBeGreaterThan(0.3)
    expect(scaleX).toBeLessThan(0.7)
    expect(typeof timeline).toBe('boolean')
  })
})

test.describe('Without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('content, anchor navigation and the console button still work', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: "Hey, I'm Lukáš Machala" })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Sections' }).getByRole('link')).toHaveCount(4)
    await expect(page.getByRole('button', { name: 'copy address' })).toBeHidden()

    await page.getByRole('button', { name: 'Toggle developer console' }).click()
    const pane = page.getByRole('region', { name: 'Developer console' })
    await expect(pane).toBeVisible()
    await expect(pane).toContainText('The controls need JavaScript')
  })
})
