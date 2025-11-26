import { useEffect, useRef } from 'react';
import { ORB_COLORS } from '../lib/section-config';
import { ANIMATION_CONFIG, SECTION_COUNT } from '../lib/constants';

/**
 * Generate color breakpoints dynamically based on section count
 */
const generateColorBreakpoints = () => {
  const percentPerSection = 100 / (SECTION_COUNT - 1);
  return ORB_COLORS.map((color, index) => ({
    percent: index * percentPerSection,
    ...color
  }));
};

const COLOR_BREAKPOINTS = generateColorBreakpoints();

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Configuration for all background orbs
const ORB_CONFIGS = [
  // Center & Main
  { id: 1, position: "top-1/2 left-1/2", size: 800, duration: 45, filter: "blur(120px) brightness(var(--orb-brightness, 1))", opacity: 0.4 },
  
  // Corners - Spread out
  { id: 2, position: "top-0 left-0", size: 600, duration: 38, filter: "blur(100px) brightness(var(--orb-brightness, 1)) hue-rotate(-90deg) saturate(1.5)", opacity: 0.35 },
  { id: 3, position: "bottom-0 right-0", size: 650, duration: 42, filter: "blur(110px) brightness(var(--orb-brightness, 1)) hue-rotate(90deg) saturate(1.5)", opacity: 0.38 },
  { id: 4, position: "top-0 right-0", size: 500, duration: 40, filter: "blur(90px) brightness(var(--orb-brightness, 1)) hue-rotate(-60deg) saturate(1.5)", opacity: 0.32 },
  { id: 5, position: "bottom-0 left-0", size: 550, duration: 36, filter: "blur(95px) brightness(var(--orb-brightness, 1)) hue-rotate(60deg) saturate(1.5)", opacity: 0.34 },
  
  // Mid-sections - Filling gaps
  { id: 6, position: "top-1/2 left-0", size: 700, duration: 44, filter: "blur(115px) brightness(var(--orb-brightness, 1)) hue-rotate(-120deg) saturate(1.5)", opacity: 0.36 },
  { id: 7, position: "top-1/2 right-0", size: 600, duration: 50, filter: "blur(105px) brightness(var(--orb-brightness, 1)) hue-rotate(120deg) saturate(1.5)", opacity: 0.35 },
  { id: 8, position: "bottom-1/4 right-1/3", size: 550, duration: 46, filter: "blur(100px) brightness(var(--orb-brightness, 1)) hue-rotate(-90deg) saturate(1.5)", opacity: 0.32 },
];

export function AnimatedBackground() {
  const rafRef = useRef<number>();
  const targetScrollPercent = useRef(0);
  const currentScrollPercent = useRef(0);
  
  // RAW SCROLL TRACKING
  useEffect(() => {
    const handleScroll = () => {
      const body = document.body;
      const isMenuOpen = body.style.position === 'fixed';
      
      if (isMenuOpen) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      
      const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      targetScrollPercent.current = Math.min(100, Math.max(0, percent));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SMOOTH INTERPOLATION - RAF loop
  useEffect(() => {
    const animate = () => {
      const prev = currentScrollPercent.current;
      const target = targetScrollPercent.current;
      const diff = target - prev;
      
      let next = prev;
      if (Math.abs(diff) < ANIMATION_CONFIG.SMOOTH_SCROLL_SNAP_THRESHOLD) {
        next = target;
      } else {
        next = prev + diff * ANIMATION_CONFIG.SMOOTH_SCROLL_EASING;
      }
      
      currentScrollPercent.current = next;

      // Calculate Color
      const percentPerSegment = 100 / (SECTION_COUNT - 1);
      const segmentIndex = Math.min(
        SECTION_COUNT - 2, 
        Math.floor(next / percentPerSegment)
      );
      
      const segmentStart = segmentIndex * percentPerSegment;
      const segmentProgress = Math.min(
        1, 
        Math.max(0, (next - segmentStart) / percentPerSegment)
      );
      
      const colorFrom = COLOR_BREAKPOINTS[segmentIndex];
      const colorTo = COLOR_BREAKPOINTS[segmentIndex + 1];
      
      const r = Math.round(lerp(colorFrom.r, colorTo.r, segmentProgress));
      const g = Math.round(lerp(colorFrom.g, colorTo.g, segmentProgress));
      const b = Math.round(lerp(colorFrom.b, colorTo.b, segmentProgress));
      
      // Update CSS Variables directly
      const root = document.documentElement;
      root.style.setProperty('--scroll-progress', String(next / 100));
      root.style.setProperty('--scroll-percent', String(next));
      root.style.setProperty('--orb-r', String(r));
      root.style.setProperty('--orb-g', String(g));
      root.style.setProperty('--orb-b', String(b));
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Base style for all orbs
  const baseOrbStyle = {
    background: `radial-gradient(circle, rgb(var(--orb-r), var(--orb-g), var(--orb-b)) 0%, transparent 70%)`,
    willChange: 'transform', // Optimize for GPU
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: '#030712', zIndex: 0 }}>
      {/* ============ ANIMATED ORBS ============ */}
      {/* Orbs use CSS variables for color, so no re-renders needed */}
      
      {ORB_CONFIGS.map((orb) => (
        <div
          key={orb.id}
          className={`absolute ${orb.position} -translate-x-1/2 -translate-y-1/2 orb-${orb.id}`}
          style={{
            ...baseOrbStyle,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            filter: orb.filter,
            opacity: orb.opacity,
            animationDuration: `calc(${orb.duration}s / var(--animation-speed, 1))`,
          }}
        />
      ))}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950/70" />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 20%, rgba(3, 7, 18, 0.5) 45%, rgba(3, 7, 18, 0.8) 75%, rgba(3, 7, 18, 0.95) 100%)'
        }}
      />
    </div>
  );
}