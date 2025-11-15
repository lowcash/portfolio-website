import { motion, useSpring } from 'motion/react';
import { useEffect, useMemo } from 'react';

interface ScrollProgressProps {
  progress: number; // 0-100
  currentSection: number;
  sectionProgress: number; // 0-1
}

// Helper to parse RGB from gradient string
function parseRGB(rgbStr: string): [number, number, number] {
  const match = rgbStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return [0, 0, 0];
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

// Linear interpolation between two RGB colors
function lerpRGB(color1: [number, number, number], color2: [number, number, number], t: number): string {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function ScrollProgress({ progress, currentSection, sectionProgress }: ScrollProgressProps) {
  const scaleX = useSpring(progress / 100, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Update spring when progress changes
  useEffect(() => {
    scaleX.set(progress / 100);
  }, [progress, scaleX]);

  // RGB color definitions for each section (from, via, to)
  const sectionColors = [
    // Hero: purple, pink, orange
    { from: [192, 132, 252], via: [244, 114, 182], to: [251, 146, 60] },
    // Who I Am: cyan, blue, indigo
    { from: [34, 211, 238], via: [59, 130, 246], to: [99, 102, 241] },
    // Tech Journey: orange, amber, red
    { from: [251, 146, 60], via: [245, 158, 11], to: [239, 68, 68] },
    // Notable Work: purple, indigo, blue
    { from: [192, 132, 252], via: [99, 102, 241], to: [59, 130, 246] },
    // Education: green, emerald, teal
    { from: [74, 222, 128], via: [16, 185, 129], to: [20, 184, 166] },
    // Work Experience: cyan, teal, blue
    { from: [34, 211, 238], via: [20, 184, 166], to: [59, 130, 246] },
    // Beyond Code: lime, green, emerald
    { from: [163, 230, 53], via: [74, 222, 128], to: [16, 185, 129] },
    // What's Next: yellow, amber, orange
    { from: [250, 204, 21], via: [251, 191, 36], to: [251, 146, 60] },
    // Contact: fuchsia, pink, purple
    { from: [232, 121, 249], via: [244, 114, 182], to: [192, 132, 252] },
  ];

  // Interpolate gradient colors based on section progress
  const interpolatedGradient = useMemo(() => {
    const current = sectionColors[currentSection];
    const next = sectionColors[Math.min(currentSection + 1, sectionColors.length - 1)];
    
    if (!current || !next) return 'linear-gradient(to right, rgb(192, 132, 252), rgb(244, 114, 182), rgb(251, 146, 60))';
    
    // Smooth easing for the transition
    const easedProgress = sectionProgress < 0.5 
      ? 2 * sectionProgress * sectionProgress 
      : 1 - Math.pow(-2 * sectionProgress + 2, 2) / 2;
    
    const fromColor = lerpRGB(current.from as [number, number, number], next.from as [number, number, number], easedProgress);
    const viaColor = lerpRGB(current.via as [number, number, number], next.via as [number, number, number], easedProgress);
    const toColor = lerpRGB(current.to as [number, number, number], next.to as [number, number, number], easedProgress);
    
    return `linear-gradient(to right, ${fromColor}, ${viaColor}, ${toColor})`;
  }, [currentSection, sectionProgress]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
      style={{ 
        scaleX,
        background: interpolatedGradient,
      }}
    />
  );
}
