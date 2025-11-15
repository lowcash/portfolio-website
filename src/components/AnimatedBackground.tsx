interface AnimatedBackgroundProps {
  currentSection: number;
  sectionProgress: number;
  interpolationFactor: number;
}

// 9 barevných breakpointů (středy sekcí)
const COLOR_BREAKPOINTS = [
  { r: 99, g: 102, b: 241 },    // 0: Hero - indigo
  { r: 244, g: 63, b: 94 },     // 1: Who I Am - rose
  { r: 139, g: 92, b: 246 },    // 2: Tech Stack - violet
  { r: 236, g: 72, b: 153 },    // 3: Notable Work - pink
  { r: 34, g: 211, b: 238 },    // 4: Education - cyan
  { r: 234, g: 179, b: 8 },     // 5: Experience - amber
  { r: 52, g: 211, b: 153 },    // 6: Beyond Code - emerald
  { r: 168, g: 85, b: 247 },    // 7: What's Next - purple
  { r: 59, g: 130, b: 246 },    // 8: Contact - blue
];

// Lineární interpolace mezi dvěma barvami
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Interpolace barvy podle scroll progressu (0-9)
function interpolateColor(scrollPosition: number): { r: number; g: number; b: number } {
  // Clamp mezi 0 a 8.999
  const clamped = Math.max(0, Math.min(8.999, scrollPosition));
  
  // Najít dva nejbližší breakpointy
  const index1 = Math.floor(clamped);
  const index2 = Math.min(index1 + 1, 8);
  const t = clamped - index1;
  
  const color1 = COLOR_BREAKPOINTS[index1];
  const color2 = COLOR_BREAKPOINTS[index2];
  
  return {
    r: Math.round(lerp(color1.r, color2.r, t)),
    g: Math.round(lerp(color1.g, color2.g, t)),
    b: Math.round(lerp(color1.b, color2.b, t)),
  };
}

export function AnimatedBackground({ currentSection, sectionProgress }: AnimatedBackgroundProps) {
  // Vypočítat scroll pozici 0-9
  const scrollPosition = currentSection + sectionProgress;
  
  // Interpolovat barvu
  const color = interpolateColor(scrollPosition);
  
  return (
    <div 
      className="fixed inset-0 bg-black pointer-events-none" 
      style={{ 
        zIndex: 0,
        // CSS custom properties pro RGB interpolaci
        ['--orb-r' as string]: color.r,
        ['--orb-g' as string]: color.g,
        ['--orb-b' as string]: color.b,
      }}
    >
      {/* ANIMATED ORBS - barvy z CSS using --orb-r, --orb-g, --orb-b */}
      <div className="absolute inset-0">
        {/* ORB 1 - levý horní roh */}
        <div
          className="absolute rounded-full orb-1"
          style={{
            width: '1400px',
            height: '1400px',
            filter: 'blur(100px)',
            left: '15%',
            top: '15%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* ORB 2 - pravý horní roh */}
        <div
          className="absolute rounded-full orb-2"
          style={{
            width: '1350px',
            height: '1350px',
            filter: 'blur(100px)',
            left: '80%',
            top: '18%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* ORB 3 - pravý dolní roh */}
        <div
          className="absolute rounded-full orb-3"
          style={{
            width: '1300px',
            height: '1300px',
            filter: 'blur(100px)',
            left: '82%',
            top: '80%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* ORB 4 - levý dolní roh */}
        <div
          className="absolute rounded-full orb-4"
          style={{
            width: '1400px',
            height: '1400px',
            filter: 'blur(100px)',
            left: '18%',
            top: '82%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* ORB 5 - střed vlevo */}
        <div
          className="absolute rounded-full orb-5"
          style={{
            width: '1100px',
            height: '1100px',
            filter: 'blur(100px)',
            left: '25%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* ORB 6 - střed vpravo */}
        <div
          className="absolute rounded-full orb-6"
          style={{
            width: '1050px',
            height: '1050px',
            filter: 'blur(100px)',
            left: '75%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      
      {/* VIGNETTE */}
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
