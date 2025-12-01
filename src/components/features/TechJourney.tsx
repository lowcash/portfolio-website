import { Code, Database, Cpu, Globe, Box } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { Card } from '../shared/Card';
import { TechTag } from '../shared/TechTag';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';

export function TechJourney() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(5);

  const skills = [
    { 
      icon: Code,
      category: 'Frontend', 
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Electron.js'], 
      description: 'Building responsive, modern UIs with type-safe code and smooth user experiences',
      iconColor: 'text-orange-400'
    },
    { 
      icon: Database,
      category: 'Backend', 
      items: ['Node.js', 'tRPC', 'Prisma', 'REST APIs', 'PostgreSQL'], 
      description: 'End-to-end type safety with tRPC, building scalable APIs and server-side logic with Prisma ORM',
      iconColor: 'text-pink-400'
    },
    { 
      icon: Box,
      category: 'Computer Graphics', 
      items: ['Unity', 'VR Development', 'Shader Programming (Cg)', 'OpenCV'], 
      description: 'University projects with VR, custom shaders, and computer vision',
      iconColor: 'text-orange-400'
    },
    { 
      icon: Cpu,
      category: 'AI & ML', 
      items: ['Machine Learning', 'Computer Vision', 'XGBoost', 'Reinforcement Learning', 'Python'], 
      description: 'Currently building Forex ML/RL system, experienced with OpenCV and Lucas-Kanade optical flow',
      iconColor: 'text-pink-400'
    },
    { 
      icon: Globe,
      category: 'Agentic & Design', 
      items: ['AI-Assisted Workflows', 'Claude, Copilot', 'Figma', 'System Architecture'], 
      description: 'Leveraging AI tools to ship faster, architect better systems, and bridge design-to-code gap',
      iconColor: 'text-orange-400'
    },
  ];

  return (
    <SectionWrapper id="tech-journey">
      <SectionHeader
        title="Tech Stack"
        subtitle="A diverse toolkit built over years of exploration and real-world projects"
        {...SECTION_STYLES.techJourney}
      />

      <div ref={cardsRef} className="grid md:grid-cols-2 gap-3">
        {skills.map((skillGroup, index) => (
          <Card
            key={index}
            icon={skillGroup.icon}
            iconColor={skillGroup.iconColor}
            title={skillGroup.category}
            description={skillGroup.description}
            style={getItemStyle(index) as React.CSSProperties}
            className="h-full"
          >
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((item, itemIndex) => (
                <TechTag key={itemIndex}>{item}</TechTag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}