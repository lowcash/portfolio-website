import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center px-6">
      {/* Removed background gradient - AnimatedBackground handles it */}

      <div 
        className="relative z-10 text-center px-4"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: 'none' // Remove transition for smooth parallax
        }}
      >
        {/* TITLE - WITH GRADIENT + MASIVNÍ GLOW */}
        <div className="py-8">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-6 pb-[5px] bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 24px rgba(244, 114, 182, 0.4))',
            }}
          >
            Hey, I'm Lukáš Machala
          </h1>
        </div>

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
        <div className="mt-16 animate-bounce">
          <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
        </div>
      </div>
    </section>
  );
}