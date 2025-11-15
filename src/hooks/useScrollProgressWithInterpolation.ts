import { useState, useEffect, useRef } from 'react';

export function useScrollProgressWithInterpolation() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const scrolled = Math.max(0, window.scrollY);
        const totalHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progressPercent = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
        
        setProgress(progressPercent);
        
        // Section detection with smooth interpolation
        const sectionHeight = window.innerHeight;
        const rawSection = scrolled / sectionHeight;
        const section = Math.max(0, Math.min(8, Math.floor(rawSection)));
        const sectionProgressValue = rawSection - section; // 0-1 progress within section
        
        setCurrentSection(section);
        setSectionProgress(sectionProgressValue);
      });
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { progress, currentSection, sectionProgress };
}
