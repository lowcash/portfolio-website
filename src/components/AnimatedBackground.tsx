interface AnimatedBackgroundProps {
  currentSection: number;
}

// Color schemes for each section
const sectionColorSchemes = [
  // Hero (0): purple, pink, orange
  {
    orb1: 'rgba(168, 85, 247, 0.15)', // purple
    orb2: 'rgba(244, 114, 182, 0.13)', // pink
    orb3: 'rgba(251, 146, 60, 0.12)', // orange
    orb4: 'rgba(147, 51, 234, 0.14)', // purple accent
    orb5: 'rgba(236, 72, 153, 0.13)', // pink accent
    orb6: 'rgba(217, 70, 239, 0.12)', // fuchsia
  },
  // WhoIAm (1): cyan, blue, indigo
  {
    orb1: 'rgba(34, 211, 238, 0.15)', // cyan
    orb2: 'rgba(59, 130, 246, 0.13)', // blue
    orb3: 'rgba(99, 102, 241, 0.12)', // indigo
    orb4: 'rgba(6, 182, 212, 0.14)', // cyan accent
    orb5: 'rgba(37, 99, 235, 0.13)', // blue accent
    orb6: 'rgba(79, 70, 229, 0.12)', // indigo accent
  },
  // TechJourney (2): orange, amber, red
  {
    orb1: 'rgba(251, 146, 60, 0.15)', // orange
    orb2: 'rgba(245, 158, 11, 0.13)', // amber
    orb3: 'rgba(239, 68, 68, 0.12)', // red
    orb4: 'rgba(249, 115, 22, 0.14)', // orange accent
    orb5: 'rgba(217, 119, 6, 0.13)', // amber accent
    orb6: 'rgba(220, 38, 38, 0.12)', // red accent
  },
  // NotableWork (3): purple, indigo, blue
  {
    orb1: 'rgba(168, 85, 247, 0.15)', // purple
    orb2: 'rgba(99, 102, 241, 0.13)', // indigo
    orb3: 'rgba(59, 130, 246, 0.12)', // blue
    orb4: 'rgba(147, 51, 234, 0.14)', // purple accent
    orb5: 'rgba(79, 70, 229, 0.13)', // indigo accent
    orb6: 'rgba(37, 99, 235, 0.12)', // blue accent
  },
  // Education (4): green, emerald, teal
  {
    orb1: 'rgba(34, 197, 94, 0.15)', // green
    orb2: 'rgba(16, 185, 129, 0.13)', // emerald
    orb3: 'rgba(20, 184, 166, 0.12)', // teal
    orb4: 'rgba(22, 163, 74, 0.14)', // green accent
    orb5: 'rgba(5, 150, 105, 0.13)', // emerald accent
    orb6: 'rgba(13, 148, 136, 0.12)', // teal accent
  },
  // WorkExperience (5): cyan, teal, blue
  {
    orb1: 'rgba(34, 211, 238, 0.15)', // cyan
    orb2: 'rgba(20, 184, 166, 0.13)', // teal
    orb3: 'rgba(59, 130, 246, 0.12)', // blue
    orb4: 'rgba(6, 182, 212, 0.14)', // cyan accent
    orb5: 'rgba(13, 148, 136, 0.13)', // teal accent
    orb6: 'rgba(37, 99, 235, 0.12)', // blue accent
  },
  // BeyondCode (6): lime, green, emerald
  {
    orb1: 'rgba(163, 230, 53, 0.15)', // lime
    orb2: 'rgba(34, 197, 94, 0.13)', // green
    orb3: 'rgba(16, 185, 129, 0.12)', // emerald
    orb4: 'rgba(132, 204, 22, 0.14)', // lime accent
    orb5: 'rgba(22, 163, 74, 0.13)', // green accent
    orb6: 'rgba(5, 150, 105, 0.12)', // emerald accent
  },
  // WhatsNext (7): yellow, amber, orange
  {
    orb1: 'rgba(250, 204, 21, 0.15)', // yellow
    orb2: 'rgba(251, 191, 36, 0.13)', // amber
    orb3: 'rgba(251, 146, 60, 0.12)', // orange
    orb4: 'rgba(234, 179, 8, 0.14)', // yellow accent
    orb5: 'rgba(245, 158, 11, 0.13)', // amber accent
    orb6: 'rgba(249, 115, 22, 0.12)', // orange accent
  },
  // Contact (8): fuchsia, pink, purple
  {
    orb1: 'rgba(232, 121, 249, 0.15)', // fuchsia
    orb2: 'rgba(244, 114, 182, 0.13)', // pink
    orb3: 'rgba(168, 85, 247, 0.12)', // purple
    orb4: 'rgba(217, 70, 239, 0.14)', // fuchsia accent
    orb5: 'rgba(236, 72, 153, 0.13)', // pink accent
    orb6: 'rgba(147, 51, 234, 0.12)', // purple accent
  },
];

export function AnimatedBackground({ currentSection }: AnimatedBackgroundProps) {
  const colors = sectionColorSchemes[currentSection] || sectionColorSchemes[0];
  
  return (
    <div 
      className="fixed inset-0 bg-black pointer-events-none" 
      style={{ 
        zIndex: 0,
      }}
    >
      {/* POHYBLIVÉ ORBY S DYNAMICKÝMI BARVAMI */}
      <div className="absolute inset-0">
        {/* ORB 1 - levý horní roh */}
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: '1400px',
            height: '1400px',
            background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            left: '15%',
            top: '15%',
            transform: 'translate(-50%, -50%)',
            animation: 'orb-float-1 15s ease-in-out infinite',
          }}
        />
        
        {/* ORB 2 - pravý horní roh */}
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: '1350px',
            height: '1350px',
            background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            left: '80%',
            top: '18%',
            transform: 'translate(-50%, -50%)',
            animation: 'orb-float-2 13s ease-in-out infinite',
          }}
        />
        
        {/* ORB 3 - pravý dolní roh */}
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: '1300px',
            height: '1300px',
            background: `radial-gradient(circle, ${colors.orb3} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            left: '82%',
            top: '80%',
            transform: 'translate(-50%, -50%)',
            animation: 'orb-float-3 17s ease-in-out infinite',
          }}
        />
        
        {/* ORB 4 - levý dolní roh */}
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: '1400px',
            height: '1400px',
            background: `radial-gradient(circle, ${colors.orb4} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            left: '18%',
            top: '82%',
            transform: 'translate(-50%, -50%)',
            animation: 'orb-float-4 14s ease-in-out infinite',
          }}
        />
        
        {/* ORB 5 - střed vlevo */}
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: '1100px',
            height: '1100px',
            background: `radial-gradient(circle, ${colors.orb5} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            left: '25%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'orb-float-5 12s ease-in-out infinite',
          }}
        />
        
        {/* ORB 6 - střed vpravo */}
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: '1050px',
            height: '1050px',
            background: `radial-gradient(circle, ${colors.orb6} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            left: '75%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'orb-float-6 16s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* VIGNETTE - tmavší okraje, světlejší střed pro viditelné orby */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.75) 90%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}