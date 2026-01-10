import { Briefcase } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { TechTag } from '../shared/TechTag';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';

export function WorkExperience() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(2);

  const experiences = [
    {
      icon: Briefcase,
      title: 'Game Development',
      period: '4 years',
      description: 'Professional game development work building interactive experiences. Deepened expertise in JavaScript, TypeScript, and modern web technologies while shipping production projects.',
      technologies: ['JavaScript', 'TypeScript', 'Phaser (2D Games)', 'Game Engines', 'Performance Optimization'],
      iconColor: 'text-cyan-400'
    },
    {
      icon: Briefcase,
      title: 'CRM & Fullstack Systems',
      period: '3 years (Part-time)',
      description: 'Built and maintained CRM information systems during university. Worked with ASP.NET MVC, JavaScript, and database design - learning fullstack development, Prisma ORM, and design patterns.',
      technologies: ['ASP.NET MVC', 'JavaScript', 'SQL', 'C#', 'Prisma', 'Fullstack'],
      iconColor: 'text-blue-400'
    }
  ];

  return (
    <SectionWrapper id="work-experience">
      <SectionHeader
        title="Work Experience"
        subtitle="Building production software across gaming and fullstack systems"
        {...SECTION_STYLES.workExperience}
      />

      <div ref={cardsRef} className="space-y-3 max-w-5xl mx-auto">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="rounded-2xl p-8 transition-all duration-500 flex flex-col"
            style={getItemStyle(index) as React.CSSProperties}
          >
            <div className="flex items-start gap-4 mb-4">
              <exp.icon className={`w-10 h-10 ${exp.iconColor} shrink-0`} />
              <div className="grow">
                <h3 className="text-xl mb-1 text-white">{exp.title}</h3>
                <span className="text-sm text-gray-500">{exp.period}</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech, techIndex) => (
                <TechTag key={techIndex}>{tech}</TechTag>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-500 max-w-2xl mx-auto">
          These experiences taught me to ship production code, work in teams, and balance technical excellence with business needs. 
          Now combining these lessons with modern fullstack tools and AI-assisted workflows.
        </p>
      </div>
    </SectionWrapper>
  );
}