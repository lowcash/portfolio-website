import { motion } from 'motion/react';

interface ScrollNavigationProps {
  currentSection: number;
  totalSections: number;
  sectionNames: string[];
  onSectionClick: (index: number) => void;
}

export function ScrollNavigation({ currentSection, totalSections, sectionNames, onSectionClick }: ScrollNavigationProps) {
  const sections = [
    { id: 0, label: sectionNames[0], color: 'rgba(168,85,247,0.8)' },        // Purple (Hero)
    { id: 1, label: sectionNames[1], color: 'rgba(34,211,238,0.8)' },        // Cyan (WhoIAm)
    { id: 2, label: sectionNames[2], color: 'rgba(251,146,60,0.8)' },        // Orange (TechJourney)
    { id: 3, label: sectionNames[3], color: 'rgba(168,85,247,0.8)' },        // Purple (NotableWork)
    { id: 4, label: sectionNames[4], color: 'rgba(34,197,94,0.8)' },         // Green (Education)
    { id: 5, label: sectionNames[5], color: 'rgba(34,211,238,0.8)' },        // Cyan (WorkExperience)
    { id: 6, label: sectionNames[6], color: 'rgba(163,230,53,0.8)' },        // Lime (BeyondCode)
    { id: 7, label: sectionNames[7], color: 'rgba(250,204,21,0.8)' },        // Yellow (WhatsNext)
    { id: 8, label: sectionNames[8], color: 'rgba(232,121,249,0.8)' },       // Fuchsia (Contact)
  ];

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
              {/* Dot - centered in fixed container */}
              <div 
                className={`rounded-full transition-all duration-300`}
                style={{
                  width: currentSection === section.id ? '12px' : '8px',
                  height: currentSection === section.id ? '12px' : '8px',
                  backgroundColor: currentSection === section.id ? section.color : 'rgba(156,163,175,0.4)',
                  boxShadow: currentSection === section.id 
                    ? `0 0 12px ${section.color}` 
                    : 'none'
                }}
              />
              
              {/* Tooltip on hover - minimalist */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {section.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE/TABLET - Bottom horizontal dots */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex gap-2.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className="group relative cursor-pointer flex items-center justify-center w-2 h-2"
              aria-label={`Scroll to ${section.label}`}
            >
              <div 
                className={`rounded-full transition-all duration-300`}
                style={{
                  width: currentSection === section.id ? '8px' : '6px',
                  height: currentSection === section.id ? '8px' : '6px',
                  backgroundColor: currentSection === section.id ? section.color : 'rgba(156,163,175,0.3)',
                  boxShadow: currentSection === section.id 
                    ? `0 0 8px ${section.color}` 
                    : 'none'
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}