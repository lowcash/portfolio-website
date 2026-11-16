import { type Page, expect, test } from '@playwright/test'

/**
 * Orientation while scrolling: the active section rests at full strength,
 * the others sit a touch dimmer. Opacity and colour only: nothing moves, so there is no layout shift.
 */
const SECTIONS = [
  ['hero', 'hero'],
  ['featured-projects', 'projects'],
  ['experience', 'experience'],
  ['contact', 'contact'],
] as const

const sectionState = (page: Page) =>
  page.evaluate(
    (ids) =>
      ids.map((id) => {
        const section = document.getElementById(id)!
        const head = section.querySelector('.sec-head, .hero-body > .idx') as HTMLElement
        return {
          id,
          opacity: parseFloat(getComputedStyle(section).opacity),
          idxColor: getComputedStyle(head.querySelector('.idx') ?? head).color,
        }
      }),
    SECTIONS.map(([id]) => id),
  )

test.describe('Section orientation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  for (const [id, scene] of SECTIONS) {
    test(`${id}: lit while active, the others a touch dimmer but readable`, async ({ page }) => {
      await page.evaluate((target) => document.getElementById(target)?.scrollIntoView({ behavior: 'instant' }), id)
      await expect(page.locator('html')).toHaveAttribute('data-scene', scene)
      // The fade takes about a second
      await page.waitForTimeout(1400)

      const states = await sectionState(page)
      for (const state of states) {
        if (state.id === id) {
          expect(state.opacity, `${state.id} active`).toBe(1)
        } else {
          expect(state.opacity, `${state.id} inactive`).toBeLessThan(1)
          expect(state.opacity, `${state.id} inactive`).toBeGreaterThanOrEqual(0.75)
        }
      }

      // The index number of the active section is the accent, the others are the quiet ink
      const lit = states.find((state) => state.id === id)!
      const quiet = states.filter((state) => state.id !== id && state.id !== 'hero')
      for (const state of quiet) {
        expect(state.idxColor).not.toBe(lit.idxColor)
      }
    })
  }

  test('no layout shift: section boxes are identical whichever section is active', async ({ page }) => {
    const boxes = () =>
      page.evaluate(() =>
        ['hero', 'featured-projects', 'experience', 'contact'].map((id) => {
          const rect = document.getElementById(id)!.getBoundingClientRect()
          return [rect.width, rect.height, Math.round(rect.top + window.scrollY)]
        }),
      )

    const atTop = await boxes()
    await page.evaluate(() => document.getElementById('experience')?.scrollIntoView({ behavior: 'instant' }))
    await expect(page.locator('html')).toHaveAttribute('data-scene', 'experience')
    await page.waitForTimeout(1400)

    expect(await boxes()).toEqual(atTop)
  })

  test('only opacity and colour change: no section or heading has a transform transition', async ({ page }) => {
    const properties = await page.evaluate(() =>
      ['#hero', '#experience', '#experience .idx'].map(
        (selector) => getComputedStyle(document.querySelector(selector)!).transitionProperty,
      ),
    )

    for (const property of properties) {
      expect(property).not.toMatch(/transform|margin|padding|width|height|top|left|font/)
    }
  })
})

test.describe('Section orientation with reduced motion or without JavaScript', () => {
  test('reduced motion: the state is the same but it does not fade', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.getElementById('experience')?.scrollIntoView({ behavior: 'instant' }))
    await expect(page.locator('html')).toHaveAttribute('data-scene', 'experience')

    const duration = await page.evaluate(
      () => getComputedStyle(document.getElementById('experience')!).transitionDuration,
    )
    expect(parseFloat(duration)).toBeLessThan(0.001)
    await expect.poll(async () => (await sectionState(page))[2].opacity).toBe(1)
    expect((await sectionState(page))[1].opacity).toBeLessThan(1)
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('every section stays at full strength', async ({ page }) => {
      await page.goto('/')

      const opacities = await page.evaluate(() =>
        ['hero', 'featured-projects', 'experience', 'contact'].map(
          (id) => getComputedStyle(document.getElementById(id)!).opacity,
        ),
      )
      expect(opacities).toEqual(['1', '1', '1', '1'])
    })
  })
})
