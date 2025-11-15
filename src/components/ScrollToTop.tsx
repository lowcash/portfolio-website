import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  currentSection: number;
  onGoToFirst: () => void;
}

export function ScrollToTop({ currentSection, onGoToFirst }: ScrollToTopProps) {
  // Show button when not on first section
  const isVisible = currentSection > 0;

  // Dynamic colors based on current section
  const sectionColors = [
    { glow: 'rgba(168,85,247,0.5)', inner: 'rgba(168,85,247,0.08)', icon: 'text-purple-400' }, // Hero
    { glow: 'rgba(244,114,182,0.5)', inner: 'rgba(244,114,182,0.08)', icon: 'text-pink-400' }, // Who I Am
    { glow: 'rgba(251,146,60,0.5)', inner: 'rgba(251,146,60,0.08)', icon: 'text-orange-400' }, // Tech Stack
    { glow: 'rgba(34,211,238,0.5)', inner: 'rgba(34,211,238,0.08)', icon: 'text-cyan-400' }, // Notable Work
    { glow: 'rgba(99,102,241,0.5)', inner: 'rgba(99,102,241,0.08)', icon: 'text-indigo-400' }, // Education
    { glow: 'rgba(20,184,166,0.5)', inner: 'rgba(20,184,166,0.08)', icon: 'text-teal-400' }, // Work Experience
    { glow: 'rgba(16,185,129,0.5)', inner: 'rgba(16,185,129,0.08)', icon: 'text-emerald-400' }, // Beyond Code
    { glow: 'rgba(250,204,21,0.5)', inner: 'rgba(250,204,21,0.08)', icon: 'text-yellow-400' }, // What's Next
  ];

  const currentColors = sectionColors[currentSection] || sectionColors[0];

  return (
    <button
      onClick={onGoToFirst}
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Go to first section"
      style={{
        animation: isVisible ? 'gentle-bounce 2s ease-in-out infinite' : 'none'
      }}
    >
      <div className="relative group">
        {/* Shimmer glow layer - behind button - DYNAMIC COLOR */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl animate-glow-shimmer -z-10 transition-all duration-500"
          style={{ boxShadow: `0 0 40px ${currentColors.glow}` } as React.CSSProperties}
        />
        
        {/* Button - static - DYNAMIC COLOR */}
        <div 
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 transition-all duration-500 hover:scale-105"
          style={{
            boxShadow: `inset 0 2px 20px rgba(0,0,0,0.5), inset 0 0 30px ${currentColors.inner}`,
          } as React.CSSProperties}
        >
          <ChevronUp className={`w-6 h-6 ${currentColors.icon} transition-all duration-500`} />
        </div>
      </div>
    </button>
  );
}