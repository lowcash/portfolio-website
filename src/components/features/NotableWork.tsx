import { Eye, Glasses, TrendingUp, ExternalLink, Globe, type LucideIcon } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { Card } from '../shared/Card';
import { TechTag } from '../shared/TechTag';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';

interface Project {
  icon: LucideIcon;
  title: string;
  period: string;
  description: string;
  tech: string[];
  link?: string;
  linkText?: string;
  iconColor: string;
  multipleLinks?: { url: string; text: string }[];
}

export function NotableWork() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(4);

  const projects: Project[] = [
    {
      icon: Eye,
      title: 'Collaborative AR System',
      period: 'Master\'s Thesis',
      description: 'Developed a collaborative augmented reality system with real-time object tracking using OpenCV and Lucas-Kanade optical flow. Focused on multi-user synchronization and computer vision algorithms.',
      tech: ['OpenCV', 'C++', 'Computer Vision', 'Optical Flow'],
      link: 'https://youtu.be/8PpEFLIw7TY',
      iconColor: 'text-blue-400'
    },
    {
      icon: Glasses,
      title: 'VR Shader Programming',
      period: 'Bachelor\'s Thesis',
      description: 'Created immersive VR experiences with custom shader programming in Cg. Explored real-time rendering techniques and visual effects in virtual reality environments.',
      tech: ['Cg', 'Unity', 'VR', 'Shader Programming'],
      iconColor: 'text-cyan-400'
    },
    {
      icon: TrendingUp,
      title: 'Forex ML/RL System',
      period: 'Current',
      description: 'Building an experimental trading system using machine learning and reinforcement learning with bio-inspired algorithms. Exploring technical analysis, pattern recognition, and adaptive strategies.',
      tech: ['Python', 'Machine Learning', 'XGBoost', 'Reinforcement Learning'],
      link: 'https://github.com/lowcash/QuantWise-Demo',
      linkText: 'View on GitHub',
      iconColor: 'text-pink-400'
    },
    {
      icon: Globe,
      title: 'Professional Web Development',
      period: 'Client Projects',
      description: 'Crafted modern, responsive websites for small businesses with focus on performance, accessibility, and beautiful design. From massage therapy to luxury yachting services.',
      tech: ['Next.js', 'Server Actions', 'TypeScript', 'Responsive Design'],
      multipleLinks: [
        { url: 'https://pohlazenipoteleadusi.cz', text: 'Massage Therapy Site' },
        { url: 'https://pinkladyyachtingservices.com', text: 'Yachting Services Site' }
      ],
      iconColor: 'text-emerald-400'
    }
  ];

  return (
    <SectionWrapper id="notable-work">
      <SectionHeader
        title="Notable Work"
        subtitle="Projects that pushed my technical boundaries"
        {...SECTION_STYLES.notableWork}
      />

      <div ref={cardsRef} className="grid md:grid-cols-2 gap-3">
        {projects.map((project, index) => (
          <Card
            key={index}
            icon={project.icon}
            iconColor={project.iconColor}
            title={project.title}
            subtitle={project.period}
            description={project.description}
            style={getItemStyle(index) as React.CSSProperties}
            className="h-full"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech, techIndex) => (
                <TechTag key={techIndex}>{tech}</TechTag>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm section-link"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{project.linkText || 'Watch Demo Video'}</span>
              </a>
            )}
            {project.multipleLinks && (
              <div className="flex flex-col gap-2">
                {project.multipleLinks.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm section-link"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{link.text}</span>
                  </a>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}