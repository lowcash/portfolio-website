import type { Metadata, MetadataRoute, Viewport } from 'next'

import type { Person, WithContext } from 'schema-dts'

import { APP_MANIFEST, OPEN_GRAPH_IMAGE, PERSON_PROFILE, SITE_IDENTITY } from '@/lib/site-config'

export const ROOT_VIEWPORT: Viewport = {
  themeColor: SITE_IDENTITY.themeColor,
  viewportFit: 'cover',
}

export const ROOT_OPEN_GRAPH = {
  type: 'website',
  locale: SITE_IDENTITY.locale,
  url: SITE_IDENTITY.url,
  title: SITE_IDENTITY.title,
  description: SITE_IDENTITY.description,
  siteName: SITE_IDENTITY.name,
  images: [
    {
      url: OPEN_GRAPH_IMAGE.path,
      width: OPEN_GRAPH_IMAGE.size.width,
      height: OPEN_GRAPH_IMAGE.size.height,
      alt: OPEN_GRAPH_IMAGE.alt,
    },
  ],
} satisfies NonNullable<Metadata['openGraph']>

export const ROOT_TWITTER = {
  card: 'summary_large_image',
  title: SITE_IDENTITY.title,
  description: SITE_IDENTITY.description,
  images: [OPEN_GRAPH_IMAGE.path],
} satisfies NonNullable<Metadata['twitter']>

export const ROOT_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
} satisfies NonNullable<Metadata['robots']>

export const ROOT_APPLE_WEB_APP = {
  title: SITE_IDENTITY.shortName,
  capable: true,
  statusBarStyle: 'black-translucent',
} satisfies NonNullable<Metadata['appleWebApp']>

export const ROOT_METADATA: Metadata = {
  metadataBase: new URL(SITE_IDENTITY.url),
  applicationName: SITE_IDENTITY.name,
  category: SITE_IDENTITY.category,
  manifest: APP_MANIFEST.path,
  title: SITE_IDENTITY.title,
  description: SITE_IDENTITY.description,
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: ROOT_OPEN_GRAPH,
  twitter: ROOT_TWITTER,
  robots: ROOT_ROBOTS,
  appleWebApp: ROOT_APPLE_WEB_APP,
}

export const PERSON_JSON_LD: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: PERSON_PROFILE.name,
  alternateName: PERSON_PROFILE.alternateName,
  url: SITE_IDENTITY.url,
  jobTitle: PERSON_PROFILE.jobTitle,
  description: SITE_IDENTITY.description,
  email: PERSON_PROFILE.email,
  sameAs: [PERSON_PROFILE.githubUrl, PERSON_PROFILE.linkedinUrl],
  knowsAbout: [...PERSON_PROFILE.knowsAbout],
}

export const MANIFEST_METADATA: MetadataRoute.Manifest = {
  name: `${PERSON_PROFILE.name} (${PERSON_PROFILE.alternateName})`,
  short_name: SITE_IDENTITY.shortName,
  description: APP_MANIFEST.description,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: SITE_IDENTITY.themeColor,
  lang: SITE_IDENTITY.language,
  categories: [...APP_MANIFEST.categories],
  icons: [
    {
      src: '/icon.svg',
      type: 'image/svg+xml',
      sizes: 'any',
    },
  ],
}
