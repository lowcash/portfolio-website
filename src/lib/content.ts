export type WhatsNextIconKey = 'rocket' | 'trendingUp' | 'target'
export type IconTone = 'yellow' | 'amber' | 'cyan' | 'emerald'
export type ContactIconKey = 'github' | 'linkedin' | 'send'
export type BeyondCodeIconKey = 'music2' | 'plane' | 'bookOpen' | 'trendingUp'
export type WhoIAmIconKey = 'zap' | 'sparkles' | 'brain'
export type TechJourneyIconKey = 'code' | 'database' | 'box' | 'cpu' | 'globe'
export type NotableWorkIconKey = 'eye' | 'glasses' | 'trendingUp' | 'globe'

export const siteContent = {
  navigation: {
    sections: [
      { name: 'Hey There', id: 'hero' },
      { name: 'Who I Am', id: 'who-i-am' },
      { name: 'Tech Stack', id: 'tech-journey' },
      { name: 'Notable Work', id: 'notable-work' },
      { name: 'Work Experience', id: 'work-experience' },
      { name: 'Academic Journey', id: 'education' },
      { name: 'Beyond Code', id: 'beyond-code' },
      { name: "What's Next", id: 'whats-next' },
      { name: "Let's Connect", id: 'contact' },
    ],
  },
  hero: {
    heading: "Hey, I'm Lukáš Machala",
    role: 'Fullstack Developer',
    summary:
      'Building end-to-end web applications with TypeScript, React, and modern tools - powered by curiosity and AI-assisted development',
  },
  contact: {
    title: "Let's Connect",
    intro:
      'Whether you need a fullstack developer, want to collaborate on an ML project, or just want to chat about agentic workflows, music, or building meaningful tech - reach out at',
    highlightEmail: 'lukas.lowcash@gmail.com',
    note: 'Currently focusing on Forex ML project, but open to interesting opportunities.',
    techLine: 'Built with React, TypeScript, Tailwind CSS, and Motion',
    hint: "Hint for devs: Check the console or press 'D'",
    socials: [
      {
        icon: 'github' as ContactIconKey,
        label: 'GitHub',
        href: 'https://github.com/Lowcash',
        username: '@Lowcash',
      },
      {
        icon: 'linkedin' as ContactIconKey,
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/lukáš-machala-00549114a',
        username: 'Lukáš Machala',
      },
      {
        icon: 'send' as ContactIconKey,
        label: 'Email',
        href: 'mailto:lukas.lowcash@gmail.com',
        username: 'lukas.lowcash@gmail.com',
      },
    ],
  },
  beyondCode: {
    title: 'Beyond Code',
    subtitle: "Life is more than just programming - here's what else drives me",
    items: [
      {
        icon: 'music2' as BeyondCodeIconKey,
        title: 'Music Production',
        description:
          'As DJ Lowcash, I explore electronic music production and live DJ sets. From house to techno, music is where creativity meets technical precision - just like coding.',
        tags: ['Electronic Music', 'DJing', 'Live Performance'],
        link: 'https://youtube.com/@ltdlowcash?si=WTPwh27LfNIW1Q_K',
        linkText: 'Check out my mixes',
        iconColor: 'text-lime-400',
      },
      {
        icon: 'plane' as BeyondCodeIconKey,
        title: 'Digital Nomad Life',
        description:
          'Embracing location independence and exploring the world while building software. Remote work enables experiencing different cultures and perspectives.',
        tags: ['Remote Work', 'Travel', 'Cultural Exploration'],
        iconColor: 'text-green-400',
      },
      {
        icon: 'bookOpen' as BeyondCodeIconKey,
        title: 'Audiobooks & Hiking',
        description:
          'Combining long hikes with audiobooks - learning while moving. Nature provides clarity, books provide knowledge, together they create space for thinking.',
        tags: ['Continuous Learning', 'Nature', 'Deep Thinking'],
        iconColor: 'text-emerald-400',
      },
      {
        icon: 'trendingUp' as BeyondCodeIconKey,
        title: 'Biohacking & Optimization',
        description:
          'Exploring how to optimize physical and mental performance through data-driven experimentation. From sleep tracking to nutrition, I approach health like debugging code.',
        tags: ['Sleep Optimization', 'Nutrition', 'Performance Tracking'],
        iconColor: 'text-teal-400',
      },
    ],
  },
  whoIAm: {
    title: 'Who I Am',
    subtitle: 'From computer graphics to modern web development - a journey of continuous learning',
    items: [
      {
        icon: 'zap' as WhoIAmIconKey,
        title: 'Fullstack Development',
        description: 'TypeScript, React, Next.js, tRPC - building complete web applications from frontend to backend',
        iconColor: 'text-cyan-400',
      },
      {
        icon: 'sparkles' as WhoIAmIconKey,
        title: 'Agentic Workflow',
        description:
          'Leveraging AI agents and prompt engineering to architect and build systems faster - the future of software development',
        iconColor: 'text-blue-400',
      },
      {
        icon: 'brain' as WhoIAmIconKey,
        title: 'ML & Computer Vision',
        description:
          "Master's in Computer Vision, currently experimenting with ML models and planning to dive deeper into OpenCV and AI systems",
        iconColor: 'text-indigo-400',
      },
    ],
  },
  techJourney: {
    title: 'Tech Stack',
    subtitle: 'A diverse toolkit built over years of exploration and real-world projects',
    items: [
      {
        icon: 'code' as TechJourneyIconKey,
        category: 'Frontend',
        items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Electron.js'],
        description: 'Building responsive, modern UIs with type-safe code and smooth user experiences',
        iconColor: 'text-orange-400',
      },
      {
        icon: 'database' as TechJourneyIconKey,
        category: 'Backend',
        items: ['Node.js', 'tRPC', 'Prisma', 'REST APIs', 'PostgreSQL'],
        description: 'End-to-end type safety with tRPC, building scalable APIs and server-side logic with Prisma ORM',
        iconColor: 'text-pink-400',
      },
      {
        icon: 'box' as TechJourneyIconKey,
        category: 'Computer Graphics',
        items: ['Unity', 'VR Development', 'Shader Programming (Cg)', 'OpenCV'],
        description: 'University projects with VR, custom shaders, and computer vision',
        iconColor: 'text-orange-400',
      },
      {
        icon: 'cpu' as TechJourneyIconKey,
        category: 'AI & ML',
        items: ['Machine Learning', 'Computer Vision', 'XGBoost', 'Reinforcement Learning', 'Python'],
        description: 'Currently building Forex ML/RL system, experienced with OpenCV and Lucas-Kanade optical flow',
        iconColor: 'text-pink-400',
      },
      {
        icon: 'globe' as TechJourneyIconKey,
        category: 'Agentic & Design',
        items: ['AI-Assisted Workflows', 'Claude, Copilot', 'Figma', 'System Architecture'],
        description: 'Leveraging AI tools to ship faster, architect better systems, and bridge design-to-code gap',
        iconColor: 'text-orange-400',
      },
    ],
  },
  notableWork: {
    title: 'Notable Work',
    subtitle: 'Projects that pushed my technical boundaries',
    projects: [
      {
        icon: 'eye' as NotableWorkIconKey,
        title: 'Collaborative AR System',
        period: "Master's Thesis",
        description:
          'Developed a collaborative augmented reality system with real-time object tracking using OpenCV and Lucas-Kanade optical flow. Focused on multi-user synchronization and computer vision algorithms.',
        tech: ['OpenCV', 'C++', 'Computer Vision', 'Optical Flow'],
        link: 'https://youtu.be/8PpEFLIw7TY',
        iconColor: 'text-blue-400',
      },
      {
        icon: 'glasses' as NotableWorkIconKey,
        title: 'VR Shader Programming',
        period: "Bachelor's Thesis",
        description:
          'Created immersive VR experiences with custom shader programming in Cg. Explored real-time rendering techniques and visual effects in virtual reality environments.',
        tech: ['Cg', 'Unity', 'VR', 'Shader Programming'],
        iconColor: 'text-cyan-400',
      },
      {
        icon: 'trendingUp' as NotableWorkIconKey,
        title: 'Forex ML/RL System',
        period: 'Current',
        description:
          'Building an experimental trading system using machine learning and reinforcement learning with bio-inspired algorithms. Exploring technical analysis, pattern recognition, and adaptive strategies.',
        tech: ['Python', 'Machine Learning', 'XGBoost', 'Reinforcement Learning'],
        link: 'https://github.com/lowcash/QuantWise-Demo',
        linkText: 'View on GitHub',
        iconColor: 'text-pink-400',
      },
      {
        icon: 'globe' as NotableWorkIconKey,
        title: 'Professional Web Development',
        period: 'Client Projects',
        description:
          'Crafted modern, responsive websites for small businesses with focus on performance, accessibility, and beautiful design. From massage therapy to luxury yachting services.',
        tech: ['Next.js', 'Server Actions', 'TypeScript', 'Responsive Design'],
        multipleLinks: [
          { url: 'https://pohlazenipoteleadusi.cz', text: 'Massage Therapy Site' },
          { url: 'https://pinkladyyachtingservices.com', text: 'Yachting Services Site' },
        ],
        iconColor: 'text-emerald-400',
      },
    ],
  },
  education: {
    title: 'Academic Journey',
    subtitle: 'Academic foundation in computer graphics and visual computing',
    degrees: [
      {
        degree: "Inženýr (Ing.) - Master's Degree",
        field: 'Computer Graphics',
        institution: 'VŠB - Technical University of Ostrava',
        years: '2017 - 2020',
        description:
          "Master's thesis focused on user collaboration through augmented reality tools and image processing (SLAM, spatial reconstruction, C++). Semester project: AR navigation using Microsoft HoloLens (C#, Unity).",
        iconColor: 'text-green-400',
      },
      {
        degree: "Bakalář (Bc.) - Bachelor's Degree",
        field: 'Computer Graphics',
        institution: 'VŠB - Technical University of Ostrava',
        years: '2013 - 2017',
        description:
          "Bachelor's internship at Craneballs s.r.o. (game development studio) - gained hands-on experience in game development and real-world software engineering.",
        iconColor: 'text-emerald-400',
      },
    ],
  },
  workExperience: {
    title: 'Work Experience',
    subtitle: 'Building production software across gaming and fullstack systems',
    experiences: [
      {
        title: 'Game Development',
        period: '4 years',
        description:
          'Professional game development work building interactive experiences. Deepened expertise in JavaScript, TypeScript, and modern web technologies while shipping production projects.',
        technologies: ['JavaScript', 'TypeScript', 'Phaser (2D Games)', 'Game Engines', 'Performance Optimization'],
        iconColor: 'text-cyan-400',
      },
      {
        title: 'CRM & Fullstack Systems',
        period: '3 years (Part-time)',
        description:
          'Built and maintained CRM information systems during university. Worked with ASP.NET MVC, JavaScript, and database design - learning fullstack development, Prisma ORM, and design patterns.',
        technologies: ['ASP.NET MVC', 'JavaScript', 'SQL', 'C#', 'Prisma', 'Fullstack'],
        iconColor: 'text-blue-400',
      },
    ],
    closing:
      'These experiences taught me to ship production code, work in teams, and balance technical excellence with business needs. Now combining these lessons with modern fullstack tools and AI-assisted workflows.',
  },
  whatsNext: {
    title: "What's Next?",
    subtitle: 'Looking forward to building meaningful projects and collaborating with interesting people',
    items: [
      {
        icon: 'rocket' as WhatsNextIconKey,
        title: 'Freelance Projects',
        description: 'Open to building web applications with modern fullstack tools and AI-assisted workflows',
        iconTone: 'yellow' as IconTone,
      },
      {
        icon: 'trendingUp' as WhatsNextIconKey,
        title: 'ML Experiments',
        description: 'Currently focused on Forex ML/RL system, eager to collaborate on innovative AI projects',
        iconTone: 'amber' as IconTone,
      },
      {
        icon: 'target' as WhatsNextIconKey,
        title: 'Networking',
        description: 'Always happy to connect with fellow developers, entrepreneurs, and tech enthusiasts',
        iconTone: 'yellow' as IconTone,
      },
    ],
  },
} as const
