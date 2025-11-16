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
import { MetaTags } from './components/MetaTags';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ParallaxSection } from './components/ParallaxSection';
import { useEffect, useState, useRef } from 'react';

export default function App() {
  const sections = [
    { Component: Hero, name: 'Hey', id: 'hero' },
    { Component: WhoIAm, name: 'Who I Am', id: 'who-i-am' },
    { Component: TechJourney, name: 'My Stack', id: 'tech-journey' },
    { Component: NotableWork, name: 'Notable Work', id: 'notable-work' },
    { Component: Education, name: 'Education', id: 'education' },
    { Component: WorkExperience, name: 'Experience', id: 'work-experience' },
    { Component: BeyondCode, name: 'Beyond Code', id: 'beyond-code' },
    { Component: WhatsNext, name: "What's Next", id: 'whats-next' },
    { Component: Contact, name: 'Get in Touch', id: 'contact' },
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

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
        threshold: 0.15, // Trigger when 15% of section is visible (citlivější)
        rootMargin: '0px' // Bez margin pro přesnější timing
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

  // Simple scroll tracking - which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Find which section we're in (middle of viewport)
      const sectionIndex = sections.findIndex((_, index) => {
        const element = document.getElementById(sections[index].id);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const sectionMiddle = rect.top + rect.height / 2;
        
        // Check if section middle is near viewport middle
        return sectionMiddle > 0 && sectionMiddle < windowHeight;
      });
      
      if (sectionIndex !== -1) {
        setCurrentSection(sectionIndex);
      }
    };

    handleScroll(); // Initial
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

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
      <MetaTags />
      <GoogleAnalytics />
      
      {/* ANIMATED BACKGROUND - čistě od scroll pozice */}
      <AnimatedBackground />
      
      <div className="text-white" style={{ background: 'transparent' }}>
        <ScrollProgress />
        
        {/* All sections - scroll snap + fade + parallax effect */}
        {sections.map(({ Component, id }) => (
          <ParallaxSection
            key={id}
            id={id}
            className="min-h-screen"
            style={{ 
              scrollSnapAlign: 'start',
              opacity: visibleSections.has(id) ? 1 : 0.05
            }}
          >
            <Component />
          </ParallaxSection>
        ))}
        
        <ScrollToTop 
          currentSection={currentSection}
          onGoToFirst={() => scrollToSection(0)}
        />
        
        <ScrollNavigation
          currentSection={currentSection}
          totalSections={sections.length}
          sectionNames={sections.map(s => s.name)}
          onSectionClick={scrollToSection}
        />
      </div>
    </>
  );
}