import { useState, useEffect, useRef } from 'react';

export function useScrollProgressWithInterpolation() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [rawSection, setRawSection] = useState(0); // Raw float value for interpolation
  
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
        
        // Section detection - simple and reliable
        const sectionHeight = window.innerHeight;
        const rawSectionValue = scrolled / sectionHeight;
        const section = Math.max(0, Math.min(8, Math.round(rawSectionValue))); // Switch at midpoint
        const sectionProgressValue = rawSectionValue - Math.floor(rawSectionValue); // 0-1 progress within section
        
        setCurrentSection(section);
        setSectionProgress(sectionProgressValue);
        setRawSection(rawSectionValue);
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

  return { progress, currentSection, sectionProgress, rawSection };
}