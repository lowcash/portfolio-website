import { type Page, expect, test } from '@playwright/test'

/**
 * AA text contrast over the lights, measured on real pixels: the page is screenshotted with all text made
 * transparent (so only the background, lights and grain remain), then every visible text element is compared with the
 * worst (lightest or darkest) background pixel inside its box. Worst-case frames: every scene, the lights at rest and
 * pushed to the physics limit towards each corner, at 100% intensity (the guaranteed range). Sections that are not
 * the active one are dimmed (opacity), which is taken into account: the inactive sections are measured too.
 */

const SCENES = ['hero', 'featured-projects', 'experience', 'contact'] as const
const PUSHES = ['0px 0px', '90px 90px', '-90px -90px', '90px -90px', '-90px 90px']

type TextInfo = { label: string; color: number[]; size: number; weight: number; box: [number, number, number, number] }

async function collectTexts(page: Page): Promise<TextInfo[]> {
  return page.evaluate(() => {
    const toRgba = (color: string) => {
      const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
      probe.fillStyle = '#000'
      probe.fillStyle = color
      probe.fillRect(0, 0, 1, 1)
      return Array.from(probe.getImageData(0, 0, 1, 1).data)
    }
    const top = document.querySelector('.topbar')!.getBoundingClientRect().bottom
    const bottom = document.querySelector('#status')!.getBoundingClientRect().top
    const found: TextInfo[] = []

    for (const element of document.querySelectorAll<HTMLElement>('#hero *, section.section *')) {
      const own = Array.from(element.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent!.trim())
        .join(' ')
      const style = getComputedStyle(element)
      // Section dimming (opacity) lowers the text colour's alpha towards whatever is behind it
      const fade = parseFloat(getComputedStyle(element.closest('#hero, section.section')!).opacity)

      if (!own || style.visibility === 'hidden' || style.display === 'none') continue

      const rect = element.getBoundingClientRect()
      // A decorative ::before marker (the badge square) sits in the box but is not part of the text
      const before = getComputedStyle(element, '::before')
      const marker =
        before.content !== 'none' && before.content !== 'normal'
          ? (parseFloat(before.width) || 0) +
            (parseFloat(before.marginRight) || 0) +
            (parseFloat(before.marginLeft) || 0)
          : 0
      const x0 = Math.max(0, Math.floor(rect.left + marker) + 2)
      const x1 = Math.min(window.innerWidth, Math.ceil(rect.right) - 2)
      const y0 = Math.max(top, Math.floor(rect.top) + 2)
      const y1 = Math.min(bottom, Math.ceil(rect.bottom) - 2)

      if (x1 - x0 < 4 || y1 - y0 < 4) continue

      found.push({
        label: `${element.tagName.toLowerCase()}.${element.className || '-'} "${own.slice(0, 28)}"`,
        color: toRgba(style.color).map((value, index) => (index === 3 ? value * fade : value)),
        size: parseFloat(style.fontSize),
        weight: parseInt(style.fontWeight, 10),
        box: [x0, y0, x1, y1],
      })
    }

    return found
  })
}

async function measure(page: Page) {
  const texts = await collectTexts(page)
  const hide = await page.addStyleTag({
    content: `body *:not(.orbs):not(.orb):not(.orb *) { color: transparent !important; text-shadow: none !important; text-decoration: none !important; -webkit-text-fill-color: transparent !important; }`,
  })
  const shot = (await page.screenshot()).toString('base64')
  await hide.evaluate((node) => (node as Element).remove())

  return page.evaluate(
    async ({ png, items }) => {
      const image = new Image()
      image.src = `data:image/png;base64,${png}`
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d', { willReadFrequently: true })!
      context.drawImage(image, 0, 0)

      const luminance = ([r, g, b]: number[]) => {
        const lin = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
      }
      const ratio = (l1: number, l2: number) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

      return items.map((item) => {
        const [x0, y0, x1, y1] = item.box
        const pixels = context.getImageData(x0, y0, x1 - x0, y1 - y0).data
        const lums: number[] = []
        for (let i = 0; i < pixels.length; i += 4 * 7) lums.push(luminance([pixels[i], pixels[i + 1], pixels[i + 2]]))
        lums.sort((a, b) => a - b)
        const lightest = lums[Math.floor(lums.length * 0.98)]
        const darkest = lums[Math.floor(lums.length * 0.02)]
        const alpha = item.color[3] / 255
        const textLum = luminance(item.color)
        // Alpha text is blended over the background it will sit on
        const blend = (bg: number) => alpha * textLum + (1 - alpha) * bg
        const worst = Math.min(ratio(blend(lightest), lightest), ratio(blend(darkest), darkest))
        const isLarge = item.size >= 24 || (item.size >= 18.66 && item.weight >= 700)

        return { text: item.label, ratio: worst, needed: isLarge ? 3 : 4.5 }
      })
    },
    { png: shot, items: texts },
  )
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`AA text contrast holds over the lights in every scene and push (${viewport.width}px)`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.addInitScript(() => localStorage.clear())

    const report: string[] = []
    let worstOverall = Infinity
    const failures: string[] = []

    for (const scene of SCENES) {
      await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }), scene)
      await expect(page.locator('html')).toHaveAttribute(
        'data-scene',
        scene === 'featured-projects' ? 'projects' : scene,
      )
      await page.waitForTimeout(3600)

      for (const push of PUSHES) {
        await page.evaluate((offset) => {
          document.querySelectorAll<HTMLElement>('.orb').forEach((orb) => (orb.style.translate = offset))
        }, push)
        await page.waitForTimeout(100)

        const results = await measure(page)
        const worst = results.reduce((min, entry) =>
          entry.ratio / entry.needed < min.ratio / min.needed ? entry : min,
        )
        worstOverall = Math.min(worstOverall, worst.ratio / worst.needed)
        report.push(
          `${scene} push ${push}: ${results.length} texts, worst ${worst.ratio.toFixed(2)} (need ${worst.needed}) ${worst.text}`,
        )
        failures.push(
          ...results
            .filter((entry) => entry.ratio < entry.needed)
            .map((entry) => `${scene} ${push} ${entry.text} ${entry.ratio.toFixed(2)}<${entry.needed}`),
        )
      }
    }

    console.log(`contrast ${viewport.width}px\n${report.join('\n')}`)
    expect(failures.slice(0, 10)).toEqual([])
  })
}
