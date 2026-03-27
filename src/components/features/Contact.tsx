import { Github, Linkedin, Send } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent } from '../../lib/content';

export function Contact() {

  const content = siteContent.contact;
  const iconMap = {
    github: Github,
    linkedin: Linkedin,
    send: Send,
  } as const;

  return (
    <SectionWrapper id="contact" containerClassName="max-w-4xl">
      <div className="text-center">
        <SectionHeader
          title={content.title}
          subtitle=""
          {...SECTION_STYLES.contact}
        />
        
        <p className="text-base md:text-lg text-gray-400 mb-16 max-w-2xl mx-auto -mt-8">
          {content.intro} <span className="text-purple-400">{content.highlightEmail}</span>
          <br /><br />
          <span className="text-sm text-gray-500">{content.note}</span>
        </p>

        {/* SOCIALS - WITH HOVER EFFECTS AND STAGGER */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {content.socials.map((social, index) => {
            const Icon = iconMap[social.icon];

            return (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
             
              aria-label={`Connect with me on ${social.label}: ${social.username}`}
            >
              {/* Link card */}
              <div
                className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500"
               
              >
                <Icon className="w-6 h-6 text-purple-400 shrink-0 transition-all duration-500 group-hover:text-pink-400" aria-hidden="true" />
                <div className="text-left">
                  <div className="text-xs text-gray-500 transition-colors duration-500 group-hover:text-gray-400">{social.label}</div>
                  <div className="text-sm text-gray-300 transition-colors duration-500 group-hover:text-white">{social.username}</div>
                </div>
              </div>
            </a>
            );
          })}
        </div>

        <p className="text-sm text-gray-600">
          {content.techLine}
        </p>
        
        {/* Easter Egg Hint - for curious developers */}
        <p className="text-xs text-gray-700 mt-4 font-mono hidden md:block">
          <span className="opacity-50 hover:opacity-100 transition-opacity cursor-default">
            💡 {content.hint}
          </span>
        </p>
      </div>
    </SectionWrapper>
  );
}