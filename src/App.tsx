import { Hero } from './components/Hero';
import { WhoIAm } from './components/WhoIAm';
import { TechJourney } from './components/TechJourney';
import { NotableWork } from './components/NotableWork';
import { Education } from './components/Education';
import { WorkExperience } from './components/WorkExperience';
import { BeyondCode } from './components/BeyondCode';
import { WhatsNext } from './components/WhatsNext';
import { Contact } from './components/Contact';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollNavigation } from './components/ScrollNavigation';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ParallaxSection } from './components/ParallaxSection';
import { DebugInfo } from './components/DebugInfo';
import { EasterEggs } from './components/EasterEggs';
import { ANIMATION_CONFIG } from './lib/constants';
import { useEffect, useState, useRef } from 'react';

export default function App() {
  const sections = [
    { Component: Hero, name: 'Hey There', id: 'hero' },
    { Component: WhoIAm, name: 'Who I Am', id: 'who-i-am' },
    { Component: TechJourney, name: 'Tech Stack', id: 'tech-journey' },
    { Component: NotableWork, name: 'Notable Work', id: 'notable-work' },
    { Component: Education, name: 'Academic Journey', id: 'education' },
    { Component: WorkExperience, name: 'Work Experience', id: 'work-experience' },
    { Component: BeyondCode, name: 'Beyond Code', id: 'beyond-code' },
    { Component: WhatsNext, name: "What's Next", id: 'whats-next' },
    { Component: Contact, name: "Let's Connect", id: 'contact' },
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero'])); // Hero je vždycky visible na začátku!
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);
  const [savedSection, setSavedSection] = useState(0); // Save section when menu opens
  const [isRestoringScroll, setIsRestoringScroll] = useState(false); // Flag for scroll restoration
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Prevent body scroll when dev console is open on mobile (hamburger menu handled by ScrollNavigation)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    if (isDevConsoleOpen && isMobile) {
      // Prevent scroll on mobile without jumping
      const preventDefault = (e: TouchEvent) => {
        // Allow scrolling within dev console
        const target = e.target as HTMLElement;
        const isInScrollableContainer = target.closest('[role="region"][aria-label="Developer debug console"]');
        
        if (!isInScrollableContainer) {
          e.preventDefault();
        }
      };
      
      // Disable scroll on body - passive: false to allow preventDefault
      document.body.addEventListener('touchmove', preventDefault, { passive: false });
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.removeEventListener('touchmove', preventDefault);
        document.body.style.overflow = '';
      };
    }
  }, [isDevConsoleOpen]);

  // Intersection Observer pro fade efekt
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(entry.target.id);
            } else {
              newSet.delete(entry.target.id);
            }
            return newSet;
          });
        });
      },
      {
        threshold: ANIMATION_CONFIG.SCROLL_REVEAL_THRESHOLD,
        rootMargin: ANIMATION_CONFIG.SCROLL_REVEAL_ROOT_MARGIN
      }
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Simple scroll tracking - which section is in view (DISABLED when mobile menu is open)
  useEffect(() => {
    const handleScroll = () => {
      // SKIP if mobile menu is open OR if we're restoring scroll - prevents jumping
      if (isMobileMenuOpen || isRestoringScroll) {
        return;
      }
      
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const viewportMiddle = windowHeight / 2;
      
      // Find which section's middle is closest to viewport middle
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      sections.forEach((_, index) => {
        const element = document.getElementById(sections[index].id);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const sectionMiddle = rect.top + rect.height / 2;
        
        // Calculate distance from section middle to viewport middle
        const distance = Math.abs(sectionMiddle - viewportMiddle);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      setCurrentSection(closestIndex);
    };

    handleScroll(); // Initial
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, isMobileMenuOpen, isRestoringScroll]);

  // Save and restore currentSection when menu opens/closes
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Menu just opened - save current section
      setSavedSection(currentSection);
    }
    // Don't restore on close - let handleScroll do its job naturally
  }, [isMobileMenuOpen, currentSection]);

  useEffect(() => {
    // Set favicon
    const setFavicon = () => {
      // Remove existing favicons
      const existingIcons = document.querySelectorAll('link[rel*="icon"]');
      existingIcons.forEach(icon => icon.remove());

      // Add SVG favicon
      const svgFavicon = document.createElement('link');
      svgFavicon.rel = 'icon';
      svgFavicon.type = 'image/svg+xml';
      svgFavicon.href = '/favicon.svg';
      document.head.appendChild(svgFavicon);
    };

    setFavicon();
  }, []);

  const scrollToSection = (index: number) => {
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <GoogleAnalytics />
      <EasterEggs />
      
      {/* Skip to main content - accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      {/* ANIMATED BACKGROUND - čistě od scroll pozice */}
      <AnimatedBackground />
      
      <div className="text-white" style={{ background: 'transparent' }} role="document">
        <ScrollProgress aria-hidden="true" />
        
        {/* Main content - semantic HTML */}
        <main id="main-content" role="main">
          {/* All sections - scroll snap + fade + parallax effect */}
          {sections.map(({ Component, id }, index) => (
            <ParallaxSection
              key={id}
              id={id}
              className="min-h-screen"
              style={{ 
                scrollSnapAlign: 'start',
                opacity: visibleSections.has(id) ? 1 : 0.05
              }}
              // Accessibility: section landmarks
              role={index === 0 ? 'banner' : 'region'}
              aria-label={sections[index].name}
            >
              <Component />
            </ParallaxSection>
          ))}
        </main>
        
        <ScrollToTop 
          currentSection={currentSection}
          onGoToFirst={() => scrollToSection(0)}
        />
        
        <ScrollNavigation
          currentSection={currentSection}
          totalSections={sections.length}
          sectionNames={sections.map(s => s.name)}
          onSectionClick={scrollToSection}
          onMenuStateChange={setIsMobileMenuOpen}
          onScrollRestore={setIsRestoringScroll}
        />
        
        <DebugInfo onVisibilityChange={setIsDevConsoleOpen} />
      </div>
    </>
  );
}