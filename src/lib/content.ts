export type Tone = 'pink' | 'violet' | 'teal' | 'fuchsia' | 'mint' | 'sky' | 'amber'

/** Single source of truth for portfolio section ids, names, light scenes and accent tones */
export const PORTFOLIO_SECTIONS = [
  { name: 'Intro', id: 'hero', scene: 'hero', tone: 'pink' },
  { name: 'Projects', id: 'featured-projects', scene: 'projects', tone: 'violet' },
  { name: 'Experience', id: 'experience', scene: 'experience', tone: 'teal' },
  { name: 'Contact', id: 'contact', scene: 'contact', tone: 'fuchsia' },
] as const

export const SECTION_SCENES = PORTFOLIO_SECTIONS.map((section) => section.scene)

export type PortfolioSectionId = (typeof PORTFOLIO_SECTIONS)[number]['id']

export const SECTION_IDS = PORTFOLIO_SECTIONS.map((section) => section.id)

export const siteContent = {
  navigation: {
    sections: PORTFOLIO_SECTIONS.map(({ name, id }) => ({ name, id })),
  },
  hero: {
    greeting: "Hey, I'm",
    name: 'Lukáš Machala',
    role: 'Software Engineer building quantitative data pipelines, time-series systems, and modern web applications.',
    summary: 'Python · TypeScript · Next.js · PostgreSQL',
  },
  contact: {
    title: 'Contact',
    email: 'lukas.lowcash@gmail.com',
    hint: {
      mobile: 'Tap >_ to open Dev Console',
      desktop: "Press 'D' or tap >_ to open Interactive Dev Console",
    },
    socials: [
      {
        label: 'GitHub',
        href: 'https://github.com/lowcash',
      },
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/lukáš-machala-00549114a',
      },
    ],
  },
  featuredProjects: {
    title: 'Projects',
    projects: [
      {
        title: 'Quantitative Trading Engine',
        badges: ['Current'],
        lead: 'Event-driven quantitative framework engineered for cryptocurrency market data ingestion, time-series feature engineering, and robust strategy backtesting.',
        bullets: [
          {
            label: 'Data Pipeline',
            description: 'High-throughput streaming and historical tick data processing with custom aggregation.',
          },
          {
            label: 'Feature Engineering',
            description: 'Statistical signal extraction, volatility estimation, and walk-forward cross-validation.',
          },
          {
            label: 'Strategy Simulation',
            description:
              'Backtesting engine modeling realistic slippage, fee structures, and execution risk constraints.',
          },
        ],
        tech: ['Python', 'Data Pipelines', 'Time-Series', 'Machine Learning'],
        tone: 'pink' as Tone,
        layout: 'featured' as const,
      },
      {
        title: 'Client Web Platforms',
        badges: ['Client Work'],
        bullets: [
          {
            name: 'Pink Lady Yachting Services',
            url: 'https://pinkladyyachtingservices.com/',
            description: 'Agency platform for yacht clearance, berthing logistics, and client interface.',
          },
          {
            name: 'Pohlazení po těle a duši',
            url: 'https://pohlazenipoteleadusi.cz/',
            description: 'Presentation and booking interface for a private therapy studio.',
          },
          {
            name: 'Živé Sklo',
            url: 'https://akce.zivesklo.cz/',
            description: 'Showcase and event booking platform for live glassblowing exhibitions.',
          },
        ],
        tech: ['TypeScript', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
        tone: 'mint' as Tone,
        layout: 'half' as const,
      },
      {
        title: 'Collaborative AR System',
        badges: ['MSc Thesis'],
        bullets: [
          'Video-based spatial tracking and annotation synchronization framework using OpenCV.',
          'Feature point extraction pipeline utilizing Lucas-Kanade optical flow.',
          'Multi-user coordinate calibration and offline spatial alignment.',
        ],
        tech: ['C++', 'OpenCV', 'Computer Vision', 'OpenGL'],
        demoUrl: 'https://youtu.be/8PpEFLIw7TY',
        demoLabel: 'Watch Demo Video',
        tone: 'sky' as Tone,
        layout: 'half' as const,
      },
      {
        title: 'Initial D Racing',
        badges: ['Playable'],
        bullets: [
          'Hiring sample built to demonstrate Phaser skills for a previous role. Pick a car, choose controls, and chase the high score.',
          'Endless road with parallax scenery, lane-spawned traffic obstacles, coin pickup, and progressive speed.',
          'Keyboard on desktop; on-screen controls for mobile landscape play.',
        ],
        tech: ['TypeScript', 'Phaser 3'],
        demoUrl: 'https://lowcash.github.io/initial-d/',
        demoLabel: 'Play Game',
        tone: 'amber' as Tone,
        layout: 'half' as const,
      },
    ],
  },
  backgroundExperience: {
    title: 'Experience',
    experiences: [
      {
        title: 'Interactive Web Systems & Admin Tooling',
        period: '4 years',
        bullets: [
          'Developed 2D web game mechanics, custom canvas interactions, and asset integration pipelines.',
          'Engineered Next.js admin dashboards and interactive game galleries with role-based access control (RBAC).',
        ],
        technologies: ['TypeScript', 'Next.js', 'React', 'Phaser', 'RBAC'],
        tone: 'teal' as Tone,
      },
      {
        title: 'Fullstack Business Systems',
        period: 'Part-time, 3 years',
        bullets: [
          'Contributed to ASP.NET MVC platforms, implementing Razor views, jQuery UI components, and service-layer logic.',
          'Handled relational database queries (SQL), basic schema maintenance, and internal API endpoints.',
        ],
        technologies: ['C#', '.NET', 'ASP.NET MVC', 'SQL', 'REST APIs'],
        tone: 'sky' as Tone,
      },
    ],
    education: {
      institution: 'VŠB – Technical University of Ostrava',
      badge: 'Academic',
      degrees: [
        {
          label: "Master's Degree (Ing.)",
          field: 'Computer Graphics & Augmented Reality',
          years: '2017 – 2020',
        },
        {
          label: "Bachelor's Degree (Bc.)",
          field: 'Computer Graphics & Game Development',
          years: '2013 – 2017',
        },
      ],
      tone: 'mint' as Tone,
    },
    beyondCodeNote: {
      before: 'When not writing software, I mix drum & bass sets',
      link: {
        label: 'Lowcash',
        href: 'https://youtube.com/@ltdlowcash',
      },
      after: '.',
    },
  },
} as const
