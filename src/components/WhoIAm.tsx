import { Brain, Sparkles, Zap, Target } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function WhoIAm() {
  const sectionReveal = useScrollReveal();
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(3);

  const highlights = [
    {
      icon: Zap,
      title: 'Fullstack Development',
      description: 'TypeScript, React, Next.js, tRPC - building complete web applications from frontend to backend',
      color: 'cyan',
      iconColor: 'text-cyan-400',
      glowColor: 'rgba(34,211,238,0.5)',
      innerGlow: 'rgba(34,211,238,0.08)'
    },
    {
      icon: Sparkles,
      title: 'Agentic Workflow',
      description: 'Leveraging AI agents and prompt engineering to architect and build systems faster - the future of software development',
      color: 'blue',
      iconColor: 'text-blue-400',
      glowColor: 'rgba(59,130,246,0.5)',
      innerGlow: 'rgba(59,130,246,0.08)'
    },
    {
      icon: Brain,
      title: 'ML & Computer Vision',
      description: "Master's in Computer Vision, currently experimenting with ML models and planning to dive deeper into OpenCV and AI systems",
      color: 'indigo',
      iconColor: 'text-indigo-400',
      glowColor: 'rgba(99,102,241,0.5)',
      innerGlow: 'rgba(99,102,241,0.08)'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 md:px-8 relative">
      <div 
        ref={sectionReveal.ref}
        style={sectionReveal.style}
        className="max-w-6xl mx-auto"
      >
        {/* HEADER - MASIVNÍ GLOW */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.6)) drop-shadow(0 0 24px rgba(59, 130, 246, 0.4))'
            }}
          >
            Who I Am
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            From computer graphics to modern web development - a journey of continuous learning
          </p>
        </div>

        {/* GRID - 3 ROWS VERTICAL LAYOUT */}
        <div ref={cardsRef} className="space-y-3 max-w-3xl mx-auto">
          {highlights.map((item, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div 
                className="rounded-2xl p-8 transition-all duration-500" 
                style={{
                  ...getItemStyle(index),
                } as React.CSSProperties}
              >
                <div className="flex items-start gap-4 mb-4">
                  <item.icon className={`w-10 h-10 ${item.iconColor} flex-shrink-0`} />
                  <div className="flex-grow">
                    <h3 className="text-2xl mb-1 text-white">{item.title}</h3>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}