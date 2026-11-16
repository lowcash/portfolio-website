import { expect, test } from '@playwright/test'

/**
 * One spacing scale: every section rule has the same space above (previous content to rule) and below (rule to
 * title, and head to body), every ledger hairline (entries, aside) has the same space on both sides, and heads sit the same distance
 * from their body. Measured with getBoundingClientRect at three widths.
 */
for (const width of [1440, 1024, 390]) {
  test(`dividers and block gaps are consistent (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const m = await page.evaluate(() => {
      const top = (e: Element) => e.getBoundingClientRect().top + scrollY
      const bottom = (e: Element) => e.getBoundingClientRect().bottom + scrollY
      const heads = Array.from(document.querySelectorAll<HTMLElement>('section .sec-head')).map((head) => {
        const section = head.closest('section')!
        const body = Array.from(section.children).find((child) => child !== head)!
        return {
          above: top(head) - top(section),
          headToBody: top(body) - bottom(head),
          ruleToTitle: top(head.querySelector('.idx')!) - top(head),
          left: head.querySelector('.idx')!.getBoundingClientRect().left,
        }
      })
      const hairlines = Array.from(document.querySelectorAll<HTMLElement>('.entry, .aside')).map((element) => {
        const style = getComputedStyle(element)
        return {
          above: parseFloat(style.paddingTop),
          below: parseFloat(style.paddingBottom),
          aside: element.matches('.aside'),
        }
      })
      return { heads, hairlines }
    })

    expect(m.heads.length).toBe(3)
    for (const key of ['above', 'headToBody', 'ruleToTitle', 'left'] as const) {
      const values = m.heads.map((head) => head[key])
      expect(Math.max(...values) - Math.min(...values), `${key}: ${values.join(', ')}`).toBeLessThanOrEqual(1)
    }
    // One step above the rule, below it and between head and body (--sec-gap), and it is more generous than a hairline
    for (const head of m.heads) {
      expect(Math.abs(head.above - head.ruleToTitle)).toBeLessThanOrEqual(1)
      expect(Math.abs(head.above - head.headToBody)).toBeLessThanOrEqual(1)
      expect(head.above).toBeGreaterThanOrEqual(48)
    }
    for (const line of m.hairlines.filter((item) => !item.aside)) {
      expect(line.above).toBe(line.below)
    }
    const spaces = new Set(m.hairlines.map((line) => line.above))
    expect(spaces.size, `hairline spacing: ${[...spaces].join(', ')}`).toBe(1)
  })
}
