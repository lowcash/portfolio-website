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
import { useScrollProgressWithInterpolation } from './hooks/useScrollProgressWithInterpolation';

export default function App() {
  const sections = [
    { Component: Hero, name: 'Home', id: 'hero' },
    { Component: WhoIAm, name: 'Who I Am', id: 'who-i-am' },
    { Component: TechJourney, name: 'Tech Stack', id: 'tech-journey' },
    { Component: NotableWork, name: 'Notable Work', id: 'notable-work' },
    { Component: Education, name: 'Education', id: 'education' },
    { Component: WorkExperience, name: 'Experience', id: 'work-experience' },
    { Component: BeyondCode, name: 'Beyond Code', id: 'beyond-code' },
    { Component: WhatsNext, name: "What's Next", id: 'whats-next' },
    { Component: Contact, name: 'Contact', id: 'contact' },
  ];

  const { progress, currentSection, sectionProgress } = useScrollProgressWithInterpolation();

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
      
      {/* ANIMATED BACKGROUND */}
      <AnimatedBackground currentSection={currentSection} sectionProgress={sectionProgress} />
      
      <div className="text-white" style={{ background: 'transparent' }}>
        <ScrollProgress progress={progress} currentSection={currentSection} sectionProgress={sectionProgress} />
        
        {/* All sections */}
        {sections.map(({ Component, id }) => (
          <section
            key={id}
            id={id}
            className="min-h-screen"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Component />
          </section>
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