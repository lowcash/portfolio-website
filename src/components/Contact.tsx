import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { useSimpleScrollReveal } from '../hooks/useSimpleScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function Contact() {
  const sectionReveal = useSimpleScrollReveal();
  const { ref: socialsRef, getItemStyle } = useStaggerFadeIn(3);

  const socials = [
    { 
      icon: Github, 
      label: 'GitHub', 
      href: 'https://github.com/Lowcash',
      username: '@Lowcash'
    },
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      href: 'https://linkedin.com/in/lukáš-machala-00549114a',
      username: 'Lukáš Machala'
    },
    { 
      icon: Send, 
      label: 'Email', 
      href: 'mailto:lukas.lowcash@gmail.com',
      username: 'lukas.lowcash@gmail.com'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 md:px-8 relative">
      <div 
        ref={sectionReveal.ref}
        style={sectionReveal.style}
        className="max-w-4xl mx-auto text-center"
      >
        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-fuchsia-400 via-pink-500 to-purple-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(232, 121, 249, 0.6)) drop-shadow(0 0 24px rgba(244, 114, 182, 0.4))'
            }}
          >
            Let's Connect
          </h2>
          <p className="text-base md:text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
            Whether you need a fullstack developer, want to collaborate on an ML project, 
            or just want to chat about agentic workflows, music, or building meaningful tech - reach out at <span className="text-purple-400">lukas.lowcash@gmail.com</span>
            <br /><br />
            <span className="text-sm text-gray-500">Currently focusing on Forex ML project, but open to interesting opportunities.</span>
          </p>

          {/* SOCIALS - WITH HOVER EFFECTS AND STAGGER */}
          <div ref={socialsRef} className="flex flex-wrap justify-center gap-3 mb-16">
            {socials.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
                style={getItemStyle(index)}
              >
                {/* Link card */}
                <div
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500"
                  style={{
                    ...getItemStyle(index),
                  } as React.CSSProperties}
                >
                  <social.icon className="w-6 h-6 text-purple-400 flex-shrink-0 transition-all duration-500 group-hover:text-pink-400" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500 transition-colors duration-500 group-hover:text-gray-400">{social.label}</div>
                    <div className="text-sm text-gray-300 transition-colors duration-500 group-hover:text-white">{social.username}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-600">
            Built with React, TypeScript, Tailwind CSS, and Motion
          </p>
        </div>
      </div>
    </section>
  );
}