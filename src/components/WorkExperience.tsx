import { Briefcase } from 'lucide-react';
import { useSimpleScrollReveal } from '../hooks/useSimpleScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function WorkExperience() {
  const sectionReveal = useSimpleScrollReveal();
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(2);

  const experiences = [
    {
      icon: Briefcase,
      title: 'Game Development',
      period: '4 years',
      description: 'Professional game development work building interactive experiences. Deepened expertise in JavaScript, TypeScript, and modern web technologies while shipping production projects.',
      technologies: ['JavaScript', 'TypeScript', 'WebGL', 'Game Engines', 'Performance Optimization'],
      iconColor: 'text-cyan-400',
      glowColor: 'rgba(34,211,238,0.5)',
      innerGlow: 'rgba(34,211,238,0.08)'
    },
    {
      icon: Briefcase,
      title: 'CRM & Fullstack Systems',
      period: '3 years (Part-time)',
      description: 'Built and maintained CRM information systems during university. Worked with ASP.NET MVC, JavaScript, and database design - learning fullstack development, Prisma ORM, and design patterns.',
      technologies: ['ASP.NET MVC', 'JavaScript', 'SQL', 'C#', 'Prisma', 'Fullstack'],
      iconColor: 'text-blue-400',
      glowColor: 'rgba(59,130,246,0.5)',
      innerGlow: 'rgba(59,130,246,0.08)'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 md:px-8 relative">
      <div 
        ref={sectionReveal.ref}
        style={sectionReveal.style}
        className="max-w-6xl mx-auto"
      >
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.6)) drop-shadow(0 0 24px rgba(20, 184, 166, 0.4))'
            }}
          >
            Experience
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            Building production software across gaming and fullstack systems
          </p>
        </div>

        {/* JOBS */}
        <div ref={cardsRef} className="space-y-3 max-w-5xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div
                className="rounded-2xl p-8 transition-all duration-500 flex flex-col"
                style={{
                  ...getItemStyle(index),
                } as React.CSSProperties}
              >
                <div className="flex items-start gap-4 mb-4">
                  <exp.icon className={`w-10 h-10 ${exp.iconColor} flex-shrink-0`} />
                  <div className="flex-grow">
                    <h3 className="text-xl mb-1 text-white">{exp.title}</h3>
                    <span className="text-sm text-gray-500">{exp.period}</span>
                  </div>
                </div>
                <p className="text-gray-400 mb-6">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 rounded-full text-xs text-gray-300 bg-white/5 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
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
      </div>
    </section>
  );
}