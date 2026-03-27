export type WhatsNextIconKey = 'rocket' | 'trendingUp' | 'target';
export type IconTone = 'yellow' | 'amber' | 'cyan' | 'emerald';
export type ContactIconKey = 'github' | 'linkedin' | 'send';
export type BeyondCodeIconKey = 'music2' | 'plane' | 'bookOpen' | 'trendingUp';

export const siteContent = {
  navigation: {
    sections: [
      { name: 'Hey There', id: 'hero' },
      { name: 'Who I Am', id: 'who-i-am' },
      { name: 'Tech Stack', id: 'tech-journey' },
      { name: 'Notable Work', id: 'notable-work' },
      { name: 'Academic Journey', id: 'education' },
      { name: 'Work Experience', id: 'work-experience' },
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
} as const;
