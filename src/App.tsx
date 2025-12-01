import { Hero } from './components/features/Hero';
import { WhoIAm } from './components/features/WhoIAm';
import { TechJourney } from './components/features/TechJourney';
import { NotableWork } from './components/features/NotableWork';
import { Education } from './components/features/Education';
import { WorkExperience } from './components/features/WorkExperience';
import { BeyondCode } from './components/features/BeyondCode';
import { WhatsNext } from './components/features/WhatsNext';
import { Contact } from './components/features/Contact';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { ScrollNavigation } from './components/layout/ScrollNavigation';
import { GoogleAnalytics } from './components/shared/GoogleAnalytics';
import { AnimatedBackground } from './components/shared/AnimatedBackground';
import { ParallaxSection } from './components/shared/ParallaxSection';
import { DebugInfo } from './components/layout/DebugInfo';
import { EasterEggs } from './components/features/EasterEggs';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { useEffect, useState, useMemo } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

export default function App() {
  const sections = useMemo(() => [
    { Component: Hero, name: 'Hey There', id: 'hero' },
    { Component: WhoIAm, name: 'Who I Am', id: 'who-i-am' },
    { Component: TechJourney, name: 'Tech Stack', id: 'tech-journey' },
    { Component: NotableWork, name: 'Notable Work', id: 'notable-work' },
    { Component: Education, name: 'Academic Journey', id: 'education' },
    { Component: WorkExperience, name: 'Work Experience', id: 'work-experience' },
    { Component: BeyondCode, name: 'Beyond Code', id: 'beyond-code' },
    { Component: WhatsNext, name: "What's Next", id: 'whats-next' },
    { Component: Contact, name: "Let's Connect", id: 'contact' },
  ], []);

  const [currentSection, setCurrentSection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);
  const [isRestoringScroll, setIsRestoringScroll] = useState(false); // Flag for scroll restoration

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

  // Simple scroll tracking - which section is in view (DISABLED when mobile menu is open)
  useEffect(() => {
    const handleScroll = () => {
      // SKIP if mobile menu is open OR if we're restoring scroll - prevents jumping
      if (isMobileMenuOpen || isRestoringScroll) {
        return;
      }
      
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

  const scrollToSection = (index: number) => {
    const sectionId = sections[index].id;
    const element = document.getElementById(sectionId);
    if (element) {
      // iOS Safari fallback - use window.scrollTo for better compatibility
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        // iOS: Use window.scrollTo with smooth behavior
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        // Other browsers: Use scrollIntoView with smooth behavior
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <GoogleAnalytics />
      <EasterEggs />
      
      {/* ANIMATED BACKGROUND - čistě od scroll pozice */}
      <AnimatedBackground />
      
      <div className="text-white" style={{ background: 'transparent' }} role="document">
        {/* Main content - semantic HTML */}
        <main id="main-content" role="main">
          {/* All sections - CSS scroll-snap (no fade effect) */}
          {sections.map(({ Component, id }, index) => (
            <ParallaxSection
              key={id}
              id={id}
              className="min-h-screen"
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
        <ScrollProgress />
      </div>
    </LazyMotion>
  );
}