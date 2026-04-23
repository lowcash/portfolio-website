import type { MetadataRoute } from 'next'

import { MANIFEST_METADATA } from '@/app/site-metadata'

export default function manifest(): MetadataRoute.Manifest {
  return MANIFEST_METADATA
}
