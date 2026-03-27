import { Briefcase } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { TechTag } from '../shared/TechTag';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent } from '../../lib/content';

export function WorkExperience() {
  const { title, subtitle, experiences, closing } = siteContent.workExperience;

  return (
    <SectionWrapper id="work-experience">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        {...SECTION_STYLES.workExperience}
      />

      <div className="space-y-3 max-w-5xl mx-auto">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="rounded-2xl p-8 transition-all duration-500 flex flex-col"
           
          >
            <div className="flex items-start gap-4 mb-4">
              <Briefcase className={`w-10 h-10 ${exp.iconColor} shrink-0`} />
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
        <p className="text-gray-500 max-w-2xl mx-auto">{closing}</p>
      </div>
    </SectionWrapper>
  );
}