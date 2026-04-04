import type { MetadataRoute } from 'next'

import { getProductionSiteUrl, isProductionLikeEnvironment } from './seo-env'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProductionLikeEnvironment()) {
    return []
  }

  const base = getProductionSiteUrl('https://lowcash.dev')

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
