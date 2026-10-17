import { expect, test } from '@playwright/test'

/**
 * Local-only visual regression net for the refactor. Snapshots are platform specific, so CI skips it.
 * Update intentionally with: pnpm exec playwright test visual-baseline --update-snapshots
 */
const SECTION_IDS = ['hero', 'featured-projects', 'experience', 'contact'] as const

const FREEZE_CSS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`

test.describe('Visual baseline', () => {
  test.skip(Boolean(process.env.CI), 'Snapshots are generated on macOS only')

  for (const sectionId of SECTION_IDS) {
    test(`section ${sectionId}`, async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.addStyleTag({ content: FREEZE_CSS })

      await page.evaluate((id) => {
        const target = document.getElementById(id)
        if (target) {
          window.scrollTo({ top: target.offsetTop, behavior: 'instant' })
        }
      }, sectionId)

      // The background eases toward the scroll position frame by frame; wait until it has fully arrived.
      await page.waitForFunction(() => {
        const { scrollHeight } = document.documentElement
        const maxScroll = scrollHeight - window.innerHeight
        const expected = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0
        const actual = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-percent'))
        return Math.abs(actual - expected) < 0.06
      })
      await page.waitForTimeout(300)

      await expect(page).toHaveScreenshot(`${sectionId}.png`, {
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      })
    })
  }
})
