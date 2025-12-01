import { Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ScrollNavigationProps {
  currentSection: number;
  totalSections: number;
  sectionNames: string[];
  onSectionClick: (index: number) => void;
  onMenuStateChange?: (isOpen: boolean) => void;
  onScrollRestore?: (isRestoring: boolean) => void;
}

export function ScrollNavigation({ currentSection, totalSections, sectionNames, onSectionClick, onMenuStateChange, onScrollRestore }: ScrollNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const sections = Array.from({ length: totalSections }, (_, i) => ({
    id: i,
    label: sectionNames[i],
  }));

  const handleMobileClick = (index: number) => {
    // Pause scroll detection immediately to prevent race condition
    if (onScrollRestore) {
      onScrollRestore(true);
    }
    
    // CRITICAL: Blur the active element (button) BEFORE hiding the menu
    // This prevents "Blocked aria-hidden on an element because its descendant retained focus" error
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Close the menu
    setMobileMenuOpen(false);
    setDragStartY(null);
    setDragCurrentY(null);
    
    // Navigate immediately (no delay to prevent detection issues)
    onSectionClick(index);
    
    // Resume scroll detection after scroll completes (600ms for smooth scroll)
    setTimeout(() => {
      if (onScrollRestore) {
        onScrollRestore(false);
      }
    }, 600);
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

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartY(e.clientY);
  };

  // Handle mouse move and up on document level
  useEffect(() => {
    if (dragStartY === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragStartY === null) return;
      
      const currentY = e.clientY;
      const diff = currentY - dragStartY;
      
      // Only allow dragging down
      if (diff > 0) {
        setDragCurrentY(currentY);
      }
    };

    const handleMouseUp = () => {
      // Calculate total drag distance
      const diff = dragCurrentY !== null && dragStartY !== null 
        ? dragCurrentY - dragStartY 
        : 0;
      
      // Only close if dragged significantly (> 100px)
      if (diff > 100) {
        setMobileMenuOpen(false);
      }
      
      // Reset all drag state
      setDragStartY(null);
      setDragCurrentY(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStartY, dragCurrentY]);

  // Calculate drag offset for visual feedback
  const getDragOffset = () => {
    if (dragStartY === null || dragCurrentY === null) return 0;
    const diff = dragCurrentY - dragStartY;
    return diff > 0 ? diff : 0;
  };

  // Prevent body scroll when menu is open - PROPER SOLUTION
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    if (mobileMenuOpen) {
      // Save current scroll position IMMEDIATELY
      const currentScrollY = window.scrollY;
      scrollPositionRef.current = currentScrollY;
      
      // CRITICAL: Disable scroll snap AND smooth scrolling FIRST
      html.classList.add('no-scroll-snap');
      html.style.scrollBehavior = 'auto'; // Prevent smooth scroll during restoration
      
      // Prevent scroll using position fixed on body to avoid any layout shift
      body.style.position = 'fixed';
      body.style.top = `-${currentScrollY}px`;
      body.style.width = '100%';
      
      return () => {
        // START scroll restoration - notify parent to skip handleScroll
        if (onScrollRestore) {
          onScrollRestore(true);
        }
        
        // Restore scroll position
        const scrollY = scrollPositionRef.current;
        
        // Remove fixed positioning first
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        
        // Restore scroll position IMMEDIATELY using instant scroll
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: 'instant' as ScrollBehavior
        });
        
        // CRITICAL: Use requestAnimationFrame to ensure DOM has updated before re-enabling features
        requestAnimationFrame(() => {
          // Re-enable scroll snap and smooth scrolling after 1 RAF
          html.classList.remove('no-scroll-snap');
          html.style.scrollBehavior = '';
          
          // END scroll restoration - notify parent to resume handleScroll
          if (onScrollRestore) {
            onScrollRestore(false);
          }
        });
      };
    }
  }, [mobileMenuOpen, onScrollRestore]);

  // Notify parent about menu state change
  useEffect(() => {
    if (onMenuStateChange) {
      onMenuStateChange(mobileMenuOpen);
    }
  }, [mobileMenuOpen, onMenuStateChange]);

  return (
    <>
      {/* DESKTOP - Right side vertical dots */}
      <nav 
        className="hidden md:block fixed right-8 top-1/2 -translate-y-1/2 z-50"
        aria-label="Page navigation"
        role="navigation"
      >
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSectionClick(section.id);
                }
              }}
              className="group relative cursor-pointer flex items-center justify-center w-3 h-3"
              aria-label={`Navigate to ${section.label}`}
              aria-current={currentSection === section.id ? 'true' : 'false'}
            >
              {/* Dot - CSS CLASSES pro barvu */}
              <div 
                className={`rounded-full transition-all duration-300 ${
                  currentSection === section.id ? 'scroll-nav-dot-active w-3 h-3' : 'scroll-nav-dot-inactive w-2 h-2'
                }`}
                aria-hidden="true"
              />
              
              {/* Tooltip on hover - minimalist */}
              <div 
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
                aria-hidden="true"
              >
                {section.label}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* MOBILE - Hamburger button (top-right) with dynamic glow */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setMobileMenuOpen(!mobileMenuOpen);
          }
        }}
        className="md:hidden fixed top-6 right-6 z-[60] transition-all duration-300 hover:scale-105"
        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation-menu"
      >
        <div className="relative group">
          {/* Shimmer glow layer - same as scroll-to-top */}
          <div className="absolute inset-0 pointer-events-none rounded-xl animate-glow-shimmer -z-10 scroll-to-top-glow" aria-hidden="true" />
          
          {/* Button - same styling as scroll-to-top */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 transition-all duration-500 scroll-to-top-inner">
            {mobileMenuOpen ? (
              <X className="w-6 h-6 scroll-to-top-icon" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 scroll-to-top-icon" aria-hidden="true" />
            )}
          </div>
        </div>
      </button>

      {/* MOBILE - Slide-in menu panel */}
      <div 
        className={`md:hidden fixed inset-0 z-[55] transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu backdrop"
        />
        
        {/* Menu panel - slide from bottom with swipe support */}
        <nav 
          id="mobile-navigation-menu"
          ref={drawerRef}
          className={`absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl rounded-t-3xl transition-all duration-300 touch-pan-y ${
            mobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          aria-label="Mobile navigation"
          role="navigation"
          style={{
            boxShadow: '0 -10px 60px rgba(139, 92, 246, 0.3)',
            transform: mobileMenuOpen 
              ? `translateY(${getDragOffset()}px)` 
              : 'translateY(100%)',
            transition: dragStartY !== null ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {/* Handle bar - visual hint for swipe - THIS is the drag area */}
          <div 
            className="flex justify-center pt-4 pb-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full" />
          </div>
          
          {/* Menu items */}
          <div className="px-6 pb-8 pt-4">
            <div className="space-y-2">
              {sections.map((section) => {
                const isActive = currentSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => handleMobileClick(section.id)}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 relative ${
                      isActive 
                        ? 'text-white' // White text for active
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                    style={{
                      minHeight: '56px', // Apple HIG minimum touch target
                    }}
                  >
                    {/* Active state - same glow effect as hamburger/scroll-to-top */}
                    {isActive && (
                      <>
                        {/* Shimmer glow layer - outer glow - STRONGER */}
                        <div 
                          className="absolute inset-0 pointer-events-none rounded-xl animate-glow-shimmer -z-10" 
                          style={{
                            boxShadow: '0 0 60px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.8), 0 0 100px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.4)',
                            transition: 'box-shadow 0.3s ease-out'
                          }}
                        />
                        
                        {/* Inner background with blur - MORE COLOR */}
                        <div 
                          className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-sm -z-10"
                          style={{
                            boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.5), inset 0 0 60px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.25)',
                            backgroundColor: `rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.15)`,
                            transition: 'all 0.3s ease-out'
                          }}
                        />
                      </>
                    )}
                    
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-base">
                        {section.label}
                      </span>
                      {isActive && (
                        <div 
                          className="w-2 h-2 rounded-full animate-pulse opacity-80"
                          style={{
                            backgroundColor: 'rgb(var(--orb-r), var(--orb-g), var(--orb-b))',
                            transition: 'background-color 0.3s ease-out'
                          }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}