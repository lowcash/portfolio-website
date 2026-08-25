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
    title: 'Lukáš Machala – Software Engineer',
    description:
      'Software Engineer building quantitative data pipelines, time-series systems, and modern web applications with Python, TypeScript, Next.js, and PostgreSQL.',
    category: 'technology',
    language: 'en',
    locale: 'en_US',
    themeColor: '#0f172a',
  },
  person: {
    name: 'Lukáš Machala',
    alternateName: 'lowcash',
    jobTitle: 'Software Engineer',
    email: 'lukas.lowcash@gmail.com',
    githubUrl: 'https://github.com/lowcash',
    linkedinUrl: 'https://linkedin.com/in/lukáš-machala-00549114a',
    knowsAbout: [
      'Python',
      'TypeScript',
      'Next.js',
      'PostgreSQL',
      'Data Pipelines',
      'Time-Series Systems',
      'Machine Learning',
      'Computer Vision',
      'Augmented Reality',
      'Software Architecture',
    ],
  },
  manifest: {
    path: '/manifest.webmanifest',
    description:
      'Software Engineer building quantitative data pipelines, time-series systems, and modern web applications.',
    categories: ['technology', 'portfolio'],
  },
  openGraphImage: {
    path: '/opengraph-image',
    size: {
      width: 1200,
      height: 630,
    },
    alt: 'Lukáš Machala – Software Engineer',
    siteLabel: 'lowcash.dev',
    headline: 'Lukáš Machala',
    subheadline: 'Software Engineer',
    description: 'Quantitative data pipelines, time-series systems, and modern web applications.',
    techItems: ['Python', 'TypeScript', 'Next.js', 'PostgreSQL'],
    footerLabel: 'Portfolio • Systems • Product Thinking',
  },
} as const satisfies PortfolioSiteConfig

export const SITE_IDENTITY = SITE_CONFIG.site
export const PERSON_PROFILE = SITE_CONFIG.person
export const APP_MANIFEST = SITE_CONFIG.manifest
export const OPEN_GRAPH_IMAGE = SITE_CONFIG.openGraphImage
