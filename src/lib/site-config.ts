export type PortfolioSiteConfig = {
  readonly site: {
    readonly category: string
    readonly description: string
    readonly language: string
    readonly locale: string
    readonly name: string
    readonly shortName: string
    readonly themeColor: `#${string}`
    readonly title: string
    readonly url: `https://${string}`
  }
  readonly person: {
    readonly alternateName: string
    readonly email: string
    readonly githubUrl: `https://${string}`
    readonly jobTitle: string
    readonly knowsAbout: readonly string[]
    readonly linkedinUrl: `https://${string}`
    readonly name: string
  }
  readonly manifest: {
    readonly categories: readonly string[]
    readonly description: string
    readonly path: `/${string}`
  }
  readonly openGraphImage: {
    readonly alt: string
    readonly description: string
    readonly footerLabel: string
    readonly headline: string
    readonly path: `/${string}`
    readonly siteLabel: string
    readonly size: {
      readonly width: number
      readonly height: number
    }
    readonly subheadline: string
    readonly techItems: readonly string[]
  }
}

export const SITE_CONFIG = {
  site: {
    url: 'https://lowcash.dev',
    name: 'lowcash.dev',
    shortName: 'lowcash.dev',
    title: 'Lukáš Machala (lowcash) • Fullstack Developer & AI Architect',
    description:
      'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development. Building modern web applications with agentic workflows.',
    category: 'technology',
    language: 'en',
    locale: 'en_US',
    themeColor: '#0f172a',
  },
  person: {
    name: 'Lukáš Machala',
    alternateName: 'lowcash',
    jobTitle: 'Fullstack Developer & AI Architect',
    email: 'lukas.lowcash@gmail.com',
    githubUrl: 'https://github.com/Lowcash',
    linkedinUrl: 'https://linkedin.com/in/lukáš-machala-00549114a',
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
  },
  manifest: {
    path: '/manifest.webmanifest',
    description: 'Fullstack developer specializing in TypeScript, React, Next.js, and AI-assisted development.',
    categories: ['technology', 'portfolio'],
  },
  openGraphImage: {
    path: '/opengraph-image',
    size: {
      width: 1200,
      height: 630,
    },
    alt: 'Lukáš Machala - Fullstack Developer & AI Architect',
    siteLabel: 'lowcash.dev',
    headline: 'Lukáš Machala',
    subheadline: 'Fullstack Developer & AI Architect',
    description:
      'Building modern web products with TypeScript, React, Next.js, and AI-assisted workflows for deliberate, high-velocity delivery.',
    techItems: ['TypeScript', 'React 19', 'Next.js 16', 'AI Workflows'],
    footerLabel: 'Portfolio • Systems • Product Thinking',
  },
} as const satisfies PortfolioSiteConfig

export const SITE_IDENTITY = SITE_CONFIG.site
export const PERSON_PROFILE = SITE_CONFIG.person
export const APP_MANIFEST = SITE_CONFIG.manifest
export const OPEN_GRAPH_IMAGE = SITE_CONFIG.openGraphImage
