import { motion, useSpring } from 'motion/react';
import { useEffect } from 'react';

interface ScrollProgressProps {
  progress: number; // 0-100
  currentSection: number;
  sectionProgress: number; // not used
}

export function ScrollProgress({ progress, currentSection }: ScrollProgressProps) {
  const scaleX = useSpring(progress / 100, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    scaleX.set(progress / 100);
  }, [progress, scaleX]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-50 progress-bar-animated"
      style={{ scaleX }}
      data-section={currentSection}
    />
  );
}
