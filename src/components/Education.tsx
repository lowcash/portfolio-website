import { GraduationCap, Award } from 'lucide-react';
import { useSimpleScrollReveal } from '../hooks/useSimpleScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function Education() {
  const sectionReveal = useSimpleScrollReveal();
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(2);

  const degrees = [
    {
      degree: 'Inženýr (Ing.) - Master\'s Degree',
      field: 'Computer Graphics',
      institution: 'VŠB - Technical University of Ostrava',
      years: '2017 - 2020',
      description: 'Master\'s thesis focused on user collaboration through augmented reality tools and image processing (SLAM, spatial reconstruction, C++). Semester project: AR navigation using Microsoft HoloLens (C#, Unity).',
      iconColor: 'text-green-400',
      titleColor: 'text-green-400',
      glowColor: 'rgba(34,197,94,0.5)',
      innerGlow: 'rgba(34,197,94,0.08)'
    },
    {
      degree: 'Bakalář (Bc.) - Bachelor\'s Degree',
      field: 'Computer Graphics',
      institution: 'VŠB - Technical University of Ostrava',
      years: '2013 - 2017',
      description: 'Bachelor\'s internship at Craneballs s.r.o. (game development studio) - gained hands-on experience in game development and real-world software engineering.',
      iconColor: 'text-emerald-400',
      titleColor: 'text-emerald-400',
      glowColor: 'rgba(16,185,129,0.5)',
      innerGlow: 'rgba(16,185,129,0.08)'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 md:px-8 relative">
      <div 
        ref={sectionReveal.ref}
        style={sectionReveal.style}
        className="max-w-4xl mx-auto"
      >
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 24px rgba(16, 185, 129, 0.4))'
            }}
          >
            Education
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            Academic foundation in computer graphics and visual computing
          </p>
        </div>

        {/* EDUCATION CARDS */}
        <div ref={cardsRef} className="space-y-3 max-w-5xl mx-auto">
          {degrees.map((edu, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div 
                className="rounded-2xl p-8 transition-all duration-500 flex flex-col"
                style={{
                  ...getItemStyle(index),
                } as React.CSSProperties}
              >
                <div className="flex items-start gap-4 mb-4">
                  <GraduationCap className={`w-10 h-10 ${edu.iconColor} flex-shrink-0`} />
                  <div className="flex-grow">
                    <h3 className="text-xl mb-1 text-white">{edu.degree}</h3>
                    <p className="text-lg text-gray-300 mb-1">{edu.field}</p>
                    <span className="text-sm text-gray-500">{edu.institution} | {edu.years}</span>
                  </div>
                </div>
                <p className="text-gray-400">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}