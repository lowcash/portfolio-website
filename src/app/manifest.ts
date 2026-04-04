import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lukáš Machala (lowcash)',
    short_name: 'lowcash.dev',
    description: 'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    lang: 'en',
    categories: ['technology', 'portfolio'],
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  }
}
