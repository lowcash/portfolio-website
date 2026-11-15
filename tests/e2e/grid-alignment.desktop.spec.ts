import { type Page, expect, test } from '@playwright/test'

/**
 * One layout system: a fixed rail (columns 1-2: index, number, badge) and one content column (columns 3-12), with
 * entries splitting the content column into main (3-7) and detail (8-12) from 64rem. Comparable elements in different
 * sections must share the same left edge, measured here, not eyeballed.
 */

const left = (page: Page, selector: string) =>
  page.evaluate(
    (css) => Array.from(document.querySelectorAll(css)).map((element) => element.getBoundingClientRect().left),
    selector,
  )

function expectOneEdge(edges: number[], label: string, expectedCount?: number) {
  if (expectedCount !== undefined) {
    expect(edges, `${label}: count`).toHaveLength(expectedCount)
  }
  expect(edges.length, `${label}: found`).toBeGreaterThan(0)
  for (const edge of edges) {
    expect(
      Math.abs(edge - edges[0]),
      `${label}: ${edges.map((value) => value.toFixed(1)).join(', ')}`,
    ).toBeLessThanOrEqual(1)
  }
}

test.describe('Grid consistency', () => {
  for (const width of [1440, 1280, 834]) {
    test(`rail, content column and detail column share their left edges (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      const rail = await left(page, '.hero-body > .idx, .sec-head .idx, .e-idx')
      expectOneEdge(rail, 'rail')

      // The rail starts exactly on the page gutter
      const gutterEdge = await page.evaluate(() => {
        const wrap = document.querySelector('.hero-body')!
        return wrap.getBoundingClientRect().left + parseFloat(getComputedStyle(wrap).paddingLeft)
      })
      expect(Math.abs(rail[0] - gutterEdge)).toBeLessThanOrEqual(1)

      // Everything that is not rail or detail starts on the content column
      const content = await left(
        page,
        [
          '#hero h1',
          '#hero .role',
          '#hero .tags',
          '#hero .actions',
          '.sec-title',
          '.entry h3',
          '.entry--lead .lead',
          '.entry--lead .flow',
          '.e-main .tags',
          '.aside p',
          '.mail',
          '#contact .rows',
          '#contact .hint',
        ].join(', '),
      )
      expectOneEdge(content, 'content column')

      // The rail and the content column are different columns
      expect(content[0] - rail[0]).toBeGreaterThan(100)

      // Cross-section, same role: titles, tag rows, list rows
      for (const selector of ['#hero .name, .sec-head h2, .entry h3', '.entry .tags', '#contact .rows']) {
        expectOneEdge(await left(page, selector), selector)
      }
    })
  }

  test('on desktop the detail column and every list marker share one edge across projects and experience', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const details = await left(page, '.entry:not(.entry--lead) .e-detail')
    expect(details).toHaveLength(6)
    expectOneEdge(details, 'detail column')

    const rows = await left(page, '.entry .rows')
    expect(rows.length).toBeGreaterThanOrEqual(5)
    expectOneEdge(rows, 'rows in the detail column')

    // Row text starts one marker gutter (1.5rem) inside the list, in every list
    const textEdges = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.rows > li')).map(
        (item) => item.getBoundingClientRect().left - item.parentElement!.getBoundingClientRect().left,
      ),
    )
    expectOneEdge(textEdges, 'li offset inside rows')
  })

  test('on mobile every block starts on the gutter', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const edges = await left(
      page,
      '.idx, .e-idx, .e-main, .e-detail, #hero h1, #hero .role, #hero .tags, .sec-title, .entry h3, .e-main .tags, .mail, #contact .rows, .aside p, .hint',
    )
    expectOneEdge(edges, 'mobile gutter')
    expect(Math.round(edges[0])).toBe(16)
  })

  test('every list uses one of the two patterns: no slash or dash separators in text', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const lists = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main ul')).map((list) => list.className.split(' ')[0]),
    )
    for (const name of lists) {
      expect(['tags', 'rows'], name).toContain(name)
    }

    const text = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.tags li, .meta span')).map((item) => item.textContent ?? ''),
    )
    for (const item of text) {
      expect(item).not.toMatch(/ \/ | · |^[-–—]/)
    }
  })

  test('the contact email is one colour, the link colour, with no separate "@" element', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const mail = page.locator('a.mail')
    await expect(mail).toHaveText('lukas.lowcash@gmail.com')
    expect(await mail.locator('*').count()).toBe(0)

    const colours = await page.evaluate(() => {
      const email = document.querySelector('a.mail')!
      const link = document.querySelector('#contact .rows a')!
      return { mail: getComputedStyle(email).color, link: getComputedStyle(link).color }
    })
    expect(colours.mail).toBe(colours.link)
  })
})
