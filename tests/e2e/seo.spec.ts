import { expect, test } from '@playwright/test'

test.describe('SEO outputs', () => {
  test('homepage exposes canonical, social, manifest and Person metadata', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://lowcash.dev')
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest')
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /https:\/\/lowcash\.dev\/opengraph-image(\?.+)?$/,
    )
    await expect(page.locator('meta[name="mobile-web-app-capable"]')).toHaveAttribute('content', 'yes')
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', 'lowcash.dev')

    const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}')
    expect(jsonLd['@type']).toBe('Person')
    expect(jsonLd.url).toBe('https://lowcash.dev')
    expect(jsonLd.sameAs).toContain('https://github.com/Lowcash')
  })

  test('robots.txt and sitemap.xml use the canonical production URL', async ({ request }) => {
    const robotsResponse = await request.get('/robots.txt')
    expect(robotsResponse.ok()).toBe(true)
    expect(await robotsResponse.text()).toContain('Sitemap: https://lowcash.dev/sitemap.xml')

    const sitemapResponse = await request.get('/sitemap.xml')
    expect(sitemapResponse.ok()).toBe(true)
    const sitemapBody = await sitemapResponse.text()
    expect(sitemapBody).toContain('<loc>https://lowcash.dev</loc>')
    expect(sitemapBody).not.toContain('changefreq')
  })

  test('manifest and generated og image routes are served', async ({ request }) => {
    const manifestResponse = await request.get('/manifest.webmanifest')
    expect(manifestResponse.ok()).toBe(true)

    const manifest = await manifestResponse.json()
    expect(manifest.name).toBe('Lukáš Machala (lowcash)')
    expect(manifest.theme_color).toBe('#0f172a')

    const imageResponse = await request.get('/opengraph-image')
    expect(imageResponse.ok()).toBe(true)
    expect(imageResponse.headers()['content-type']).toContain('image/png')
  })
})
