import { GraduationCap } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';

export function Education() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(2);

  const degrees = [
    {
      degree: 'Inženýr (Ing.) - Master\'s Degree',
      field: 'Computer Graphics',
      institution: 'VŠB - Technical University of Ostrava',
      years: '2017 - 2020',
      description: 'Master\'s thesis focused on user collaboration through augmented reality tools and image processing (SLAM, spatial reconstruction, C++). Semester project: AR navigation using Microsoft HoloLens (C#, Unity).',
      iconColor: 'text-green-400'
    },
    {
      degree: 'Bakalář (Bc.) - Bachelor\'s Degree',
      field: 'Computer Graphics',
      institution: 'VŠB - Technical University of Ostrava',
      years: '2013 - 2017',
      description: 'Bachelor\'s internship at Craneballs s.r.o. (game development studio) - gained hands-on experience in game development and real-world software engineering.',
      iconColor: 'text-emerald-400'
    }
  ];

  return (
    <SectionWrapper id="education" containerClassName="max-w-4xl">
      <SectionHeader
        title="Academic Journey"
        subtitle="Academic foundation in computer graphics and visual computing"
        {...SECTION_STYLES.education}
      />

      <div ref={cardsRef} className="space-y-3 max-w-5xl mx-auto">
        {degrees.map((edu, index) => (
          <div 
            key={index}
            className="rounded-2xl p-8 transition-all duration-500 flex flex-col"
            style={getItemStyle(index) as React.CSSProperties}
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