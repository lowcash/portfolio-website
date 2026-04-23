import type { MetadataRoute } from 'next'

import { SITE_IDENTITY } from '@/lib/site-config'

import { getCanonicalSiteUrl, isProductionLikeEnvironment } from './seo-env'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionLikeEnvironment()) {
    return []
  }

  const base = getCanonicalSiteUrl(SITE_IDENTITY.url)

  return [
    {
      url: base,
      lastModified: new Date(),
      priority: 1,
    },
  ]
}
