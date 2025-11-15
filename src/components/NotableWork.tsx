import { Eye, Glasses, TrendingUp, ExternalLink } from 'lucide-react';
import { useSimpleScrollReveal } from '../hooks/useSimpleScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function NotableWork() {
  const sectionReveal = useSimpleScrollReveal();
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(3);

  const projects = [
    {
      icon: Eye,
      title: 'Collaborative AR System',
      period: 'Master\'s Thesis',
      description: 'Developed a collaborative augmented reality system with real-time object tracking using OpenCV and Lucas-Kanade optical flow. Focused on multi-user synchronization and computer vision algorithms.',
      tech: ['OpenCV', 'C++', 'Computer Vision', 'Optical Flow'],
      link: 'https://youtu.be/8PpEFLIw7TY',
      iconColor: 'text-blue-400',
      glowColor: 'rgba(59,130,246,0.5)',
      innerGlow: 'rgba(59,130,246,0.08)'
    },
    {
      icon: Glasses,
      title: 'VR Shader Programming',
      period: 'Bachelor\'s Thesis',
      description: 'Created immersive VR experiences with custom shader programming in Cg. Explored real-time rendering techniques and visual effects in virtual reality environments.',
      tech: ['Cg', 'Unity', 'VR', 'Shader Programming'],
      iconColor: 'text-cyan-400',
      glowColor: 'rgba(34,211,238,0.5)',
      innerGlow: 'rgba(34,211,238,0.08)'
    },
    {
      icon: TrendingUp,
      title: 'Forex ML/RL System',
      period: 'Current',
      description: 'Building an experimental trading system using machine learning and reinforcement learning with bio-inspired algorithms. Exploring technical analysis, pattern recognition, and adaptive strategies.',
      tech: ['Python', 'Machine Learning', 'XGBoost', 'Reinforcement Learning'],
      iconColor: 'text-pink-400',
      glowColor: 'rgba(236,72,153,0.5)',
      innerGlow: 'rgba(236,72,153,0.08)'
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 24px rgba(99, 102, 241, 0.4))'
            }}
          >
            Notable Work
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            Projects that pushed my technical boundaries
          </p>
        </div>

        {/* PROJECTS */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-3">
          {projects.map((project, index) => (
            <div key={index} className="relative h-full">
              {/* Card */}
              <div
                className="rounded-2xl p-8 flex flex-col transition-all duration-500 h-full"
                style={{
                  ...getItemStyle(index),
                } as React.CSSProperties}
              >
                <div className="flex items-start gap-4 mb-4">
                  <project.icon className={`w-10 h-10 ${project.iconColor} flex-shrink-0`} />
                  <div className="flex-grow">
                    <h3 className="text-xl mb-1 text-white">{project.title}</h3>
                    <span className="text-sm text-gray-500">{project.period}</span>
                  </div>
                </div>
                <p className="text-gray-400 mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 rounded-full text-xs text-gray-300 bg-white/5 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Watch Demo Video</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}