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
import { AnimatedBackground } from './components/AnimatedBackground';
import { useEffect } from 'react';
import { useSectionNavigation } from './hooks/useSectionNavigation';

export default function App() {
  const sections = [
    Hero,
    WhoIAm,
    TechJourney,
    NotableWork,
    Education,
    WorkExperience,
    BeyondCode,
    WhatsNext,
    Contact,
  ];

  const sectionNames = [
    'Home',
    'Who I Am',
    'Tech Stack',
    'Notable Work',
    'Education',
    'Experience',
    'Beyond Code',
    "What's Next",
    'Contact',
  ];

  const { currentSection, progress, goToSection, sectionContainerRef } = useSectionNavigation(sections.length);

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

  return (
    <>
      <MetaTags />
      
      {/* ANIMATED BACKGROUND - Outside main container, always visible */}
      <AnimatedBackground currentSection={currentSection} />
      
      <div className="text-white overflow-hidden h-screen relative" style={{ background: 'transparent' }}>
        <ScrollProgress progress={progress} currentSection={currentSection} />
        
        {/* Render all sections, only show current one */}
        {sections.map((SectionComponent, index) => {
          const isActive = currentSection === index;
          const isNext = index > currentSection;
          
          return (
            <div
              key={index}
              ref={isActive ? sectionContainerRef : null}
              className="absolute inset-0 min-h-screen transition-all duration-300 ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : isNext ? 'translateY(50px)' : 'translateY(-50px)',
                filter: isActive ? 'blur(0px)' : 'blur(8px)',
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 10 : 0,
              }}
            >
              {/* Scrollable wrapper for section content */}
              <div 
                data-section-scroll
                className="h-full overflow-y-auto overflow-x-hidden"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(168, 85, 247, 0.5) transparent',
                  scrollBehavior: 'smooth',
                }}
              >
                <SectionComponent />
              </div>
            </div>
          );
        })}
        
        <ScrollToTop 
          currentSection={currentSection}
          onGoToFirst={() => goToSection(0)}
        />
        
        <ScrollNavigation
          currentSection={currentSection}
          totalSections={sections.length}
          sectionNames={sectionNames}
          onSectionClick={goToSection}
        />
      </div>
    </>
  );
}