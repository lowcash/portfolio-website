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
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 cursor-pointer scroll-to-top-animated ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Go to first section"
      data-section={currentSection}
      style={{
        animation: isVisible ? 'gentle-bounce 2s ease-in-out infinite' : 'none'
      }}
    >
      <div className="relative group">
        {/* Shimmer glow layer - behind button - CSS ANIMATED */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl animate-glow-shimmer -z-10 scroll-glow"
        />
        
        {/* Button - static - CSS ANIMATED */}
        <div 
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 transition-all duration-500 hover:scale-105 scroll-inner"
        >
          <ChevronUp className="w-6 h-6 scroll-icon" />
        </div>
      </div>
    </button>
  );
}
