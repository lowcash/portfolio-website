import { ChevronDown } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent } from '../../lib/content';

export function Hero() {
  const { gradient, glowColors } = SECTION_STYLES.hero;
  const content = siteContent.hero;

  return (
    <SectionWrapper id="hero" className="h-screen" containerClassName="max-w-5xl">
      <div className="text-center px-4">
        {/* TITLE - WITH GRADIENT + MASIVNÍ GLOW */}
        <header className="py-8">
          <h1 
            className={`mb-6 pb-[5px] ${gradient} bg-clip-text text-transparent`}
            style={{
              fontSize: 'clamp(2.5rem, 6.2vw, 4.75rem)',
              lineHeight: 1.05,
              filter: `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})`,
            }}
          >
            {content.heading}
          </h1>
        </header>

        {/* SUBTITLE - NO EFFECTS */}
        <div>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            {content.role}
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            {content.summary}
          </p>
        </div>

        {/* SCROLL INDICATOR - WITH BOUNCE ANIMATION */}
        <div className="mt-16 animate-bounce" aria-hidden="true">
          <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
        </div>
      </div>
    </SectionWrapper>
  );
}