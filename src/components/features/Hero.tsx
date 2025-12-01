import { ChevronDown } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SECTION_STYLES } from '../../lib/section-config';

export function Hero() {
  const { gradient, glowColors } = SECTION_STYLES.hero;

  return (
    <SectionWrapper id="hero" className="h-screen" containerClassName="max-w-6xl">
      <div className="text-center px-4">
        {/* TITLE - WITH GRADIENT + MASIVNÍ GLOW */}
        <header className="py-8">
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-6 pb-[5px] ${gradient} bg-clip-text text-transparent`}
            style={{
              filter: `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})`,
            }}
          >
            Hey, I'm Lukáš Machala
          </h1>
        </header>

        {/* SUBTITLE - NO EFFECTS */}
        <div>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Fullstack Developer
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Building end-to-end web applications with TypeScript, React, and modern tools - powered by curiosity and AI-assisted development
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