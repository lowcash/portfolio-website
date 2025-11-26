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
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: '#030712', zIndex: -1 }}>
      {/* ============ ANIMATED ORBS ============ */}
      {/* Orbs use CSS variables for color, so no re-renders needed */}
      
      {/* Orb 1: Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 orb-1"
        style={{
          ...baseOrbStyle,
          width: '800px', height: '800px',
          filter: 'blur(120px) brightness(1.0)',
          opacity: 0.25,
          animationDuration: '45s',
        }}
      />
      
      {/* Orb 2: Top Left - Cool Shift */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 orb-2"
        style={{
          ...baseOrbStyle,
          width: '600px', height: '600px',
          filter: 'blur(100px) brightness(1.0) hue-rotate(-90deg) saturate(1.5)',
          opacity: 0.2,
          animationDuration: '38s',
        }}
      />
      
      {/* Orb 3: Bottom Right - Warm Shift */}
      <div
        className="absolute top-3/4 right-1/4 -translate-x-1/2 -translate-y-1/2 orb-3"
        style={{
          ...baseOrbStyle,
          width: '650px', height: '650px',
          filter: 'blur(110px) brightness(1.0) hue-rotate(90deg) saturate(1.5)',
          opacity: 0.22,
          animationDuration: '42s',
        }}
      />
      
      {/* Orb 4: Top Right - Vibrant */}
      <div
        className="absolute top-1/3 right-1/3 -translate-x-1/2 -translate-y-1/2 orb-4"
        style={{
          ...baseOrbStyle,
          width: '500px', height: '500px',
          filter: 'blur(90px) brightness(1.0) hue-rotate(-60deg) saturate(1.5)',
          opacity: 0.18,
          animationDuration: '40s',
        }}
      />
      
      {/* Orb 5: Bottom Left */}
      <div
        className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 orb-5"
        style={{
          ...baseOrbStyle,
          width: '550px', height: '550px',
          filter: 'blur(95px) brightness(1.0) hue-rotate(60deg) saturate(1.5)',
          opacity: 0.19,
          animationDuration: '36s',
        }}
      />
      
      {/* Orb 6: Extreme Cool */}
      <div
        className="absolute top-2/3 left-2/3 -translate-x-1/2 -translate-y-1/2 orb-6"
        style={{
          ...baseOrbStyle,
          width: '700px', height: '700px',
          filter: 'blur(115px) brightness(1.0) hue-rotate(-120deg) saturate(1.5)',
          opacity: 0.21,
          animationDuration: '44s',
        }}
      />
      
      {/* Orb 7: Extreme Warm */}
      <div
        className="absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 orb-7"
        style={{
          ...baseOrbStyle,
          width: '600px', height: '600px',
          filter: 'blur(105px) brightness(1.0) hue-rotate(120deg) saturate(1.5)',
          opacity: 0.2,
          animationDuration: '50s',
        }}
      />
      
      {/* Orb 8: Accent */}
      <div
        className="absolute bottom-1/3 right-2/3 -translate-x-1/2 -translate-y-1/2 orb-8"
        style={{
          ...baseOrbStyle,
          width: '550px', height: '550px',
          filter: 'blur(100px) brightness(1.0) hue-rotate(-90deg) saturate(1.5)',
          opacity: 0.18,
          animationDuration: '46s',
        }}
      />
      
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