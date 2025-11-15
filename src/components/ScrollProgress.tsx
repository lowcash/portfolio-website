import { motion, useSpring } from 'motion/react';
import { useEffect } from 'react';

interface ScrollProgressProps {
  progress: number; // 0-100
  currentSection: number;
}

export function ScrollProgress({ progress, currentSection }: ScrollProgressProps) {
  const scaleX = useSpring(progress / 100, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Update spring when progress changes
  useEffect(() => {
    scaleX.set(progress / 100);
  }, [progress, scaleX]);

  // Dynamic gradient based on current section
  const sectionGradients = [
    'from-purple-400 via-pink-400 to-orange-400', // Hero
    'from-cyan-400 via-blue-500 to-indigo-400', // Who I Am
    'from-orange-400 via-amber-500 to-red-400', // Tech Journey
    'from-purple-400 via-indigo-500 to-blue-500', // Notable Work
    'from-green-400 via-emerald-500 to-teal-400', // Education
    'from-cyan-400 via-teal-500 to-blue-400', // Work Experience
    'from-lime-400 via-green-500 to-emerald-400', // Beyond Code
    'from-yellow-400 via-amber-400 to-orange-400', // What's Next
  ];

  const currentGradient = sectionGradients[currentSection] || sectionGradients[0];

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentGradient} origin-left z-50`}
      style={{ scaleX }}
    />
  );
}