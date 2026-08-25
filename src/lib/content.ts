export type ContactIconKey = 'github' | 'linkedin'
export type FeaturedProjectIconKey = 'trendingUp' | 'globe' | 'eye'

export const siteContent = {
  navigation: {
    sections: [
      { name: 'Intro', id: 'hero' },
      { name: 'Projects', id: 'featured-projects' },
      { name: 'Experience', id: 'experience' },
      { name: 'Contact', id: 'contact' },
    ],
  },
  hero: {
    heading: "Hey, I'm Lukáš Machala",
    role: 'Software Engineer building quantitative data pipelines, time-series systems, and modern web applications.',
    summary: 'Python · TypeScript · Next.js · PostgreSQL',
  },
  contact: {
    title: 'Contact',
    email: 'lukas.lowcash@gmail.com',
    hint: "Press 'D' or tap >_ to open Interactive Dev Console",
    socials: [
      {
        icon: 'github' as ContactIconKey,
        label: 'GitHub',
        href: 'https://github.com/lowcash',
      },
      {
        icon: 'linkedin' as ContactIconKey,
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/lukáš-machala-00549114a',
      },
    ],
  },
  featuredProjects: {
    title: 'Projects',
    projects: [
      {
        icon: 'trendingUp' as FeaturedProjectIconKey,
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
            description: 'Backtesting engine modeling realistic slippage, fee structures, and execution risk constraints.',
          },
        ],
        tech: ['Python', 'Data Pipelines', 'Time-Series', 'Machine Learning'],
        iconColor: 'text-pink-400',
        layout: 'featured' as const,
      },
      {
        icon: 'globe' as FeaturedProjectIconKey,
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
        iconColor: 'text-emerald-400',
        layout: 'half' as const,
      },
      {
        icon: 'eye' as FeaturedProjectIconKey,
        title: 'Collaborative AR System',
        badges: ['MSc Thesis'],
        bullets: [
          'Video-based spatial tracking and annotation synchronization framework using OpenCV.',
          'Feature point extraction pipeline utilizing Lucas-Kanade optical flow.',
          'Multi-user coordinate calibration and offline spatial alignment.',
        ],
        tech: ['C++', 'OpenCV', 'Computer Vision', 'OpenGL'],
        demoUrl: 'https://youtu.be/8PpEFLIw7TY',
        iconColor: 'text-blue-400',
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
        iconColor: 'text-cyan-400',
      },
      {
        title: 'Fullstack Business Systems',
        period: 'Part-time, 3 years',
        bullets: [
          'Contributed to ASP.NET MVC platforms, implementing Razor views, jQuery UI components, and service-layer logic.',
          'Handled relational database queries (SQL), basic schema maintenance, and internal API endpoints.',
        ],
        technologies: ['C# / .NET', 'ASP.NET MVC', 'SQL', 'REST APIs'],
        iconColor: 'text-blue-400',
      },
    ],
    education: {
      institution: 'VŠB – Technical University of Ostrava',
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
      iconColor: 'text-green-400',
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
