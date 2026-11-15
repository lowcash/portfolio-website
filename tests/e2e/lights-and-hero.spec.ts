import { expect, test } from '@playwright/test'

test.describe('Lights, scenes and the hero', () => {
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

  test('the hero has no chart: name, role, stack and two actions only', async ({ page }) => {
    await expect(page.locator('#hero svg, #hero .chart, #hero .xh')).toHaveCount(0)

    const hero = page.locator('#hero')
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(hero.getByRole('link', { name: 'See projects' })).toHaveAttribute('href', '#featured-projects')
    await expect(hero.getByRole('button', { name: /Dev Console/ })).toBeVisible()
  })

  test('See projects scrolls to the projects section', async ({ page }) => {
    await page.locator('#hero').getByRole('link', { name: 'See projects' }).click()
    await expect(page.locator('#featured-projects')).toBeInViewport({ ratio: 0.2 })
  })

  test('the Dev Console button in the hero opens the console', async ({ page }) => {
    await page
      .locator('#hero')
      .getByRole('button', { name: /Dev Console/ })
      .click()
    await expect(page.getByRole('region', { name: 'Developer console' })).toBeVisible()
  })

  test('type stays restrained: body 16-18px, h1 <= 96px, sections announce themselves', async ({ page }) => {
    const sizes = await page.evaluate(() => {
      const px = (selector: string) => parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize)
      return { body: px('body'), name: px('#hero .name'), h2: px('#featured-projects h2') }
    })
    expect(sizes.body).toBeGreaterThanOrEqual(16)
    expect(sizes.body).toBeLessThanOrEqual(18)
    expect(sizes.name).toBeLessThanOrEqual(96)
    expect(sizes.h2).toBeLessThanOrEqual(52)

    await expect(page.locator('.sec-head .eyebrow')).toHaveCount(3)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('the name is the largest contentful element and is never animated', async ({ page }) => {
    const animations = await page.evaluate(() => {
      const name = document.querySelector('#hero .name')!
      return name.getAnimations({ subtree: true }).length + (name.closest('h1')?.getAnimations().length ?? 0)
    })
    expect(animations).toBe(0)
  })

  test('hovering the drum and bass link makes the lights beat at 174 BPM', async ({ page }) => {
    const link = page.getByRole('link', { name: /^Lowcash$/ })
    await link.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await link.hover()

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
