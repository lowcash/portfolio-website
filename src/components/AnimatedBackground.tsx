import { useEffect, useState, useRef } from 'react';
import { ORB_COLORS } from '../lib/section-config';
import { ANIMATION_CONFIG, SECTION_COUNT } from '../lib/constants';

/**
 * Generate color breakpoints dynamically based on section count
 * Each section gets equal percentage space (100% / 9 sections = ~11.11% each)
 */
const generateColorBreakpoints = () => {
  const percentPerSection = 100 / (SECTION_COUNT - 1); // 9 sections = 8 segments
  
  return ORB_COLORS.map((color, index) => ({
    percent: index * percentPerSection,
    ...color
  }));
};

const COLOR_BREAKPOINTS = generateColorBreakpoints();

/**
 * Linear interpolation helper
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Convert RGB to HSL, shift hue AND boost saturation for visible color differences
 */
function shiftHue(r: number, g: number, b: number, hueDelta: number): string {
  // Normalize RGB to 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  
  let h = 0;
  let l = (max + min) / 2;
  let s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  if (delta !== 0) {
    if (max === rNorm) {
      h = 60 * (((gNorm - bNorm) / delta) % 6);
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / delta + 2);
    } else {
      h = 60 * ((rNorm - gNorm) / delta + 4);
    }
  }
  
  // Shift hue
  h = (h + hueDelta) % 360;
  if (h < 0) h += 360;
  
  // BOOST SATURATION for visible differences (multiply by 1.8, cap at 1.0)
  s = Math.min(1.0, s * 1.8);
  
  // BOOST LIGHTNESS slightly to make colors more vibrant
  l = Math.min(0.65, l * 1.15);
  
  // Convert back to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let rOut = 0, gOut = 0, bOut = 0;
  
  if (h < 60) {
    rOut = c; gOut = x; bOut = 0;
  } else if (h < 120) {
    rOut = x; gOut = c; bOut = 0;
  } else if (h < 180) {
    rOut = 0; gOut = c; bOut = x;
  } else if (h < 240) {
    rOut = 0; gOut = x; bOut = c;
  } else if (h < 300) {
    rOut = x; gOut = 0; bOut = c;
  } else {
    rOut = c; gOut = 0; bOut = x;
  }
  
  const rFinal = Math.round((rOut + m) * 255);
  const gFinal = Math.round((gOut + m) * 255);
  const bFinal = Math.round((bOut + m) * 255);
  
  return `rgb(${rFinal}, ${gFinal}, ${bFinal})`;
}

export function AnimatedBackground() {
  const [targetScrollPercent, setTargetScrollPercent] = useState(0);
  const [smoothScrollPercent, setSmoothScrollPercent] = useState(0);
  const rafRef = useRef<number>();
  
  // Easter egg settings from CSS custom properties
  const [orbBrightness, setOrbBrightness] = useState(1.0);
  const [vignetteStyle, setVignetteStyle] = useState('classic');
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [colorVariation, setColorVariation] = useState(1.0);

  // Read settings from CSS custom properties
  useEffect(() => {
    const checkSettings = () => {
      const root = document.documentElement;
      const brightness = parseFloat(root.style.getPropertyValue('--orb-brightness') || '0.5');
      const vignette = root.style.getPropertyValue('--vignette-style') || 'minimal';
      const speed = parseFloat(root.style.getPropertyValue('--animation-speed') || '1.5'); // Changed default to 1.5x
      const variation = parseFloat(root.style.getPropertyValue('--color-variation') || '1.0');
      setOrbBrightness(brightness);
      setVignetteStyle(vignette);
      setAnimationSpeed(speed);
      setColorVariation(variation);
    };
    
    checkSettings();
    // Check periodically for easter egg changes
    const interval = setInterval(checkSettings, 100);
    return () => clearInterval(interval);
  }, []);

  // RAW SCROLL TRACKING - set target (SKIP when mobile menu is open to prevent progress bar jumping to 0)
  useEffect(() => {
    const handleScroll = () => {
      // Check if mobile menu is open by checking if body has position: fixed
      const body = document.body;
      const isMenuOpen = body.style.position === 'fixed';
      
      // SKIP scroll tracking when menu is open - prevents progress bar from jumping to 0
      if (isMenuOpen) {
        return;
      }
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      
      const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setTargetScrollPercent(Math.min(100, Math.max(0, percent)));
    };

    handleScroll(); // Initial
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SMOOTH INTERPOLATION - RAF loop
  useEffect(() => {
    const animate = () => {
      setSmoothScrollPercent(prev => {
        const diff = targetScrollPercent - prev;
        
        // Pokud je rozdíl malý, snap to target
        if (Math.abs(diff) < ANIMATION_CONFIG.SMOOTH_SCROLL_SNAP_THRESHOLD) {
          return targetScrollPercent;
        }
        
        return prev + diff * ANIMATION_CONFIG.SMOOTH_SCROLL_EASING;
      });
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetScrollPercent]);

  // Calculate segment (0 to SECTION_COUNT-2, so 0-7 for 9 sections)
  const percentPerSegment = 100 / (SECTION_COUNT - 1); // ~12.5% per segment
  const segmentIndex = Math.min(
    SECTION_COUNT - 2, 
    Math.floor(smoothScrollPercent / percentPerSegment)
  );
  
  // Local progress within current segment (0-1)
  const segmentStart = segmentIndex * percentPerSegment;
  const segmentProgress = Math.min(
    1, 
    Math.max(0, (smoothScrollPercent - segmentStart) / percentPerSegment)
  );
  
  // Barvy pro aktuální segment
  const colorFrom = COLOR_BREAKPOINTS[segmentIndex];
  const colorTo = COLOR_BREAKPOINTS[segmentIndex + 1];
  
  // INTERPOLOVAT v JavaScriptu
  const interpolatedR = Math.round(lerp(colorFrom.r, colorTo.r, segmentProgress));
  const interpolatedG = Math.round(lerp(colorFrom.g, colorTo.g, segmentProgress));
  const interpolatedB = Math.round(lerp(colorFrom.b, colorTo.b, segmentProgress));
  
  // Nastavit CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Globální progress (0-1) - SMOOTH VERSION
    root.style.setProperty('--scroll-progress', String(smoothScrollPercent / 100));
    root.style.setProperty('--scroll-percent', String(smoothScrollPercent));
    
    // Interpolované RGB hodnoty
    root.style.setProperty('--orb-r', String(interpolatedR));
    root.style.setProperty('--orb-g', String(interpolatedG));
    root.style.setProperty('--orb-b', String(interpolatedB));
  }, [smoothScrollPercent, interpolatedR, interpolatedG, interpolatedB]);
  
  const orbColor = `rgb(${interpolatedR}, ${interpolatedG}, ${interpolatedB})`;
  
  // Create color variations for different orbs (hue shifts with controllable intensity)
  // MASSIVE SHIFTS for CLEARLY VISIBLE differences: ±90°, ±60°, ±120°
  const orbColor1 = shiftHue(interpolatedR, interpolatedG, interpolatedB, -90 * colorVariation);  // COOL - completely different hue
  const orbColor2 = shiftHue(interpolatedR, interpolatedG, interpolatedB, 90 * colorVariation);   // WARM - completely different hue
  const orbColor3 = shiftHue(interpolatedR, interpolatedG, interpolatedB, -60 * colorVariation);
  const orbColor4 = shiftHue(interpolatedR, interpolatedG, interpolatedB, 60 * colorVariation);
  const orbColor5 = shiftHue(interpolatedR, interpolatedG, interpolatedB, -120 * colorVariation); // EXTREME cool
  const orbColor6 = shiftHue(interpolatedR, interpolatedG, interpolatedB, 120 * colorVariation);  // EXTREME warm
  
  // Vignette styles with adaptive intensity for desktop/mobile
  const vignetteGradients = {
    classic: 'radial-gradient(circle at center, transparent 0%, transparent 20%, rgba(3, 7, 18, 0.5) 45%, rgba(3, 7, 18, 0.8) 75%, rgba(3, 7, 18, 0.95) 100%)',
    inverted: 'radial-gradient(circle at center, rgba(3, 7, 18, 0.85) 0%, rgba(3, 7, 18, 0.7) 25%, rgba(3, 7, 18, 0.4) 50%, transparent 75%, transparent 100%)',
    // Minimal - different intensity for desktop (0.5) vs mobile (0.3)
    minimal: window.innerWidth >= 768 
      ? 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(3, 7, 18, 0.2) 70%, rgba(3, 7, 18, 0.5) 100%)'
      : 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(3, 7, 18, 0.15) 70%, rgba(3, 7, 18, 0.3) 100%)',
    none: 'transparent'
  };
  
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#030712' }}>
      {/* ============ ORBY DOČASNĚ VYPNUTY PRO TESTOVÁNÍ PERFORMANCE ============ */}
      {/* All orbs disabled to test mobile performance. Re-enable by uncommenting sections below. */}
      
      {/* Dark overlay pro kontrast a depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950/70 pointer-events-none" />
      
      {/* VIGNETTE EFFECT - controllable via easter egg */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: vignetteGradients[vignetteStyle as keyof typeof vignetteGradients] || vignetteGradients.classic
        }}
      />
    </div>
  );
}