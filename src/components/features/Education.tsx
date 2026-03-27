import { GraduationCap } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent } from '../../lib/content';

export function Education() {
  const { title, subtitle, degrees } = siteContent.education;

  return (
    <SectionWrapper id="education" containerClassName="max-w-4xl">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        {...SECTION_STYLES.education}
      />

      <div className="space-y-3 max-w-5xl mx-auto">
        {degrees.map((edu, index) => (
          <div 
            key={index}
            className="rounded-2xl p-8 transition-all duration-500 flex flex-col"
           
          >
            <div className="flex items-start gap-4 mb-4">
              <GraduationCap className={`w-10 h-10 ${edu.iconColor} shrink-0`} />
              <div className="grow">
                <h3 className="text-xl mb-1 text-white">{edu.degree}</h3>
                <p className="text-lg text-gray-300 mb-1">{edu.field}</p>
                <span className="text-sm text-gray-500">{edu.institution} | {edu.years}</span>
              </div>
            </div>
            <p className="text-gray-400">{edu.description}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}