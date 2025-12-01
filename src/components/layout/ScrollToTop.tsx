import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  currentSection: number;
  onGoToFirst: () => void;
}

export function ScrollToTop({ currentSection, onGoToFirst }: ScrollToTopProps) {
  // Show button when not on first section
  const isVisible = currentSection > 0;

  return (
    <button
      onClick={onGoToFirst}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onGoToFirst();
        }
      }}
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top of page"
      aria-hidden={!isVisible}
    >
      <div className="relative group">
        {/* Shimmer glow layer - CSS CLASS */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl animate-glow-shimmer -z-10 scroll-to-top-glow" aria-hidden="true" />
        
        {/* Button - CSS CLASS */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 transition-all duration-500 hover:scale-105 scroll-to-top-inner">
          <ChevronUp className="w-6 h-6 scroll-to-top-icon" aria-hidden="true" />
        </div>
      </div>
    </button>
  );
}