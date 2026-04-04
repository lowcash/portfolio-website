import type { MetadataRoute } from 'next'

import { getProductionSiteUrl, isProductionLikeEnvironment } from './seo-env'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getProductionSiteUrl('https://lowcash.dev')
  const isProductionLike = isProductionLikeEnvironment()

  return {
    rules: isProductionLike
      ? {
          userAgent: '*',
          allow: '/',
        }
      : {
          userAgent: '*',
          disallow: '/',
        },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
