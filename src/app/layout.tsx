import type { Metadata } from 'next'

import { SkipToContentLink } from '@/components/ui/skip-to-content-link'

import '../styles/globals.css'

const siteUrl = 'https://lowcash.dev'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lukáš Machala',
  alternateName: 'lowcash',
  url: siteUrl,
  jobTitle: 'Fullstack Developer & AI Architect',
  description:
    'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.',
  sameAs: ['https://github.com/Lowcash', 'https://linkedin.com/in/lukáš-machala-00549114a'],
  knowsAbout: [
    'TypeScript',
    'React',
    'Next.js',
    'tRPC',
    'Prisma',
    'PostgreSQL',
    'AI Development',
    'Software Architecture',
    'Augmented Reality',
    'VR Development',
    'Shader Programming',
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lukáš Machala (lowcash) • Fullstack Developer & AI Architect',
  description:
    'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Lukáš Machala (lowcash) • Fullstack Developer & AI Architect',
    description:
      'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <SkipToContentLink />

        {children}

        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  )
}
