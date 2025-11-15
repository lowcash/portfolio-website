import { Code2, Laptop, Brain, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function TechJourney() {
  const sectionReveal = useScrollReveal();
  const { ref: skillsRef, getItemStyle } = useStaggerFadeIn(4);

  const skills = [
    { 
      icon: Laptop,
      category: 'Frontend', 
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Electron.js'], 
      description: 'Building responsive, modern UIs with type-safe code and smooth user experiences',
      iconColor: 'text-orange-400',
      glowColor: 'rgba(251,146,60,0.5)',
      innerGlow: 'rgba(251,146,60,0.08)'
    },
    { 
      icon: Code2,
      category: 'Backend', 
      items: ['Node.js', 'tRPC', 'GraphQL', 'Express', 'REST APIs'], 
      description: 'End-to-end type safety with tRPC, building scalable APIs and server-side logic',
      iconColor: 'text-pink-400',
      glowColor: 'rgba(244,114,182,0.5)',
      innerGlow: 'rgba(244,114,182,0.08)'
    },
    { 
      icon: Brain,
      category: 'AI & ML', 
      items: ['Machine Learning', 'Computer Vision', 'OpenCV', 'XGBoost', 'Python'], 
      description: 'Currently building Forex ML/RL system, experienced with OpenCV and Lucas-Kanade optical flow',
      iconColor: 'text-orange-400',
      glowColor: 'rgba(251,146,60,0.5)',
      innerGlow: 'rgba(251,146,60,0.08)'
    },
    { 
      icon: Sparkles,
      category: 'Agentic & Design', 
      items: ['GitHub Copilot', 'AI-Assisted Dev', 'Figma', 'System Architecture'], 
      description: 'Leveraging AI tools to ship faster, architect better systems, and bridge design-to-code gap',
      iconColor: 'text-pink-400',
      glowColor: 'rgba(244,114,182,0.5)',
      innerGlow: 'rgba(244,114,182,0.08)'
    },
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-orange-400 via-amber-500 to-red-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(251, 146, 60, 0.6)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.4))'
            }}
          >
            My Tech Journey
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            A diverse toolkit built over years of exploration and real-world projects
          </p>
        </div>

        {/* CARDS */}
        <div ref={skillsRef} className="grid md:grid-cols-2 gap-3">
          {skills.map((skillGroup, groupIndex) => (
            <div key={groupIndex} className="relative h-full">
              {/* Card */}
              <div
                className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col"
                style={{
                  ...getItemStyle(groupIndex),
                } as React.CSSProperties}
              >
                <div className="flex items-start gap-4 mb-4">
                  <skillGroup.icon className={`w-10 h-10 ${skillGroup.iconColor} flex-shrink-0`} />
                  <div className="flex-grow">
                    <h3 className="text-xl mb-1 text-white">
                      {skillGroup.category}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 flex-grow">
                  {skillGroup.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      className="px-3 py-1 rounded-full text-xs text-gray-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}