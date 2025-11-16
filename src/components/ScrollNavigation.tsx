import { Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ScrollNavigationProps {
  currentSection: number;
  totalSections: number;
  sectionNames: string[];
  onSectionClick: (index: number) => void;
}

export function ScrollNavigation({ currentSection, totalSections, sectionNames, onSectionClick }: ScrollNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  
  const sections = Array.from({ length: totalSections }, (_, i) => ({
    id: i,
    label: sectionNames[i],
  }));

  const handleMobileClick = (index: number) => {
    onSectionClick(index);
    setMobileMenuOpen(false);
  };

  // Swipe to close functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY === null) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY;
    
    // Only allow dragging down
    if (diff > 0) {
      setDragCurrentY(currentY);
    }
  };

  const handleTouchEnd = () => {
    if (dragStartY === null || dragCurrentY === null) {
      setDragStartY(null);
      setDragCurrentY(null);
      return;
    }

    const diff = dragCurrentY - dragStartY;
    
    // Close if dragged down more than 100px
    if (diff > 100) {
      setMobileMenuOpen(false);
    }
    
    setDragStartY(null);
    setDragCurrentY(null);
  };

  // Calculate drag offset for visual feedback
  const getDragOffset = () => {
    if (dragStartY === null || dragCurrentY === null) return 0;
    const diff = dragCurrentY - dragStartY;
    return diff > 0 ? diff : 0;
  };

  // Reset drag state when menu closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setDragStartY(null);
      setDragCurrentY(null);
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* DESKTOP - Right side vertical dots */}
      <div className="hidden md:block fixed right-8 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className="group relative cursor-pointer flex items-center justify-center w-3 h-3"
              aria-label={`Scroll to ${section.label}`}
            >
              {/* Dot - CSS CLASSES pro barvu */}
              <div 
                className={`rounded-full transition-all duration-300 ${
                  currentSection === section.id ? 'scroll-nav-dot-active w-3 h-3' : 'scroll-nav-dot-inactive w-2 h-2'
                }`}
              />
              
              {/* Tooltip on hover - minimalist */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {section.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE - Hamburger button (top-right) with dynamic glow */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-6 right-6 z-[60] transition-all duration-300 hover:scale-105"
        aria-label="Toggle menu"
      >
        <div className="relative group">
          {/* Shimmer glow layer - same as scroll-to-top */}
          <div className="absolute inset-0 pointer-events-none rounded-xl animate-glow-shimmer -z-10 scroll-to-top-glow" />
          
          {/* Button - same styling as scroll-to-top */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 transition-all duration-500 scroll-to-top-inner">
            {mobileMenuOpen ? (
              <X className="w-6 h-6 scroll-to-top-icon" />
            ) : (
              <Menu className="w-6 h-6 scroll-to-top-icon" />
            )}
          </div>
        </div>
      </button>

      {/* MOBILE - Slide-in menu panel */}
      <div 
        className={`md:hidden fixed inset-0 z-[55] transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu panel - slide from bottom with swipe support */}
        <div 
          ref={drawerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl rounded-t-3xl transition-all duration-300 ${
            mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{
            boxShadow: '0 -10px 60px rgba(139, 92, 246, 0.3)',
            transform: mobileMenuOpen 
              ? `translateY(${getDragOffset()}px)` 
              : 'translateY(100%)',
            transition: dragStartY !== null ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {/* Handle bar - visual hint for swipe */}
          <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 bg-gray-600 rounded-full" />
          </div>
          
          {/* Menu items */}
          <div className="px-6 pb-8 pt-4">
            <h3 className="text-sm text-gray-400 mb-4 px-4">Navigate to Section</h3>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleMobileClick(section.id)}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 ${
                    currentSection === section.id 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                  style={{
                    minHeight: '56px', // Apple HIG minimum touch target
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{section.label}</span>
                    {currentSection === section.id && (
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}