interface SectionDotsProps {
  currentSection: number;
  totalSections: number;
  onSectionClick: (index: number) => void;
  sectionNames: string[];
}

export function SectionDots({ currentSection, totalSections, onSectionClick, sectionNames }: SectionDotsProps) {
  return (
    <div className="hidden lg:flex fixed right-10 xl:right-12 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
      {Array.from({ length: totalSections }).map((_, index) => {
        const isActive = currentSection === index;
        
        return (
          <button
            key={index}
            onClick={() => onSectionClick(index)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to ${sectionNames[index]}`}
          >
            {/* Tooltip */}
            <span 
              className="absolute right-full mr-4 px-3 py-1 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            >
              {sectionNames[index]}
            </span>
            
            {/* Dot */}
            <div
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)] scale-125' 
                  : 'bg-gray-600 hover:bg-gray-400 hover:scale-110'
                }
              `}
            />
          </button>
        );
      })}
    </div>
  );
}