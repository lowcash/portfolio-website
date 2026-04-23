import type { MetadataRoute } from 'next'

import { SITE_IDENTITY } from '@/lib/site-config'

import { getCanonicalSiteUrl, isProductionLikeEnvironment } from './seo-env'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getCanonicalSiteUrl(SITE_IDENTITY.url)
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
