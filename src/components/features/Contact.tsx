import { Github, Linkedin, Send } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';

export function Contact() {
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
    <SectionWrapper id="contact" containerClassName="max-w-4xl">
      <div className="text-center">
        <SectionHeader
          title="Let's Connect"
          subtitle=""
          {...SECTION_STYLES.contact}
        />
        
        <p className="text-base md:text-lg text-gray-400 mb-16 max-w-2xl mx-auto -mt-8">
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
              aria-label={`Connect with me on ${social.label}: ${social.username}`}
            >
              {/* Link card */}
              <div
                className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500"
                style={getItemStyle(index) as React.CSSProperties}
              >
                <social.icon className="w-6 h-6 text-purple-400 flex-shrink-0 transition-all duration-500 group-hover:text-pink-400" aria-hidden="true" />
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
        
        {/* Easter Egg Hint - for curious developers */}
        <p className="text-xs text-gray-700 mt-4 font-mono hidden md:block">
          <span className="opacity-50 hover:opacity-100 transition-opacity cursor-default">
            💡 Hint for devs: Check the console or press 'D'
          </span>
        </p>
      </div>
    </SectionWrapper>
  );
}