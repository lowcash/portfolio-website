import { useState, useEffect, useCallback, useRef } from 'react';

export function useSectionNavigation(totalSections: number) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionContainerRef = useRef<HTMLDivElement | null>(null);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= totalSections || isTransitioning) {
      console.log('[goToSection] Blocked:', { index, isTransitioning });
      return;
    }
    
    console.log('[goToSection] Going to:', index);
    setIsTransitioning(true);
    setCurrentSection(index);
    
    // Lock transitions for smooth experience
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  }, [totalSections, isTransitioning]);

  const goToNextSection = useCallback(() => {
    if (currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, totalSections, goToSection]);

  const goToPrevSection = useCallback(() => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, goToSection]);

  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // Don't prevent default yet - let's check if we need to scroll within section
      const currentSectionEl = sectionContainerRef.current;
      
      if (!currentSectionEl) {
        console.log('[Wheel] No section container found');
        return;
      }

      const scrollContainer = currentSectionEl.querySelector('[data-section-scroll]') as HTMLElement;
      
      if (!scrollContainer) {
        console.log('[Wheel] No scroll container');
        return;
      }

      const isScrollable = scrollContainer.scrollHeight > scrollContainer.clientHeight;
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const atTop = scrollTop <= 1; // Allow 1px tolerance
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      console.log('[Wheel Debug]', {
        deltaY: e.deltaY,
        isScrollable,
        scrollTop,
        scrollHeight,
        clientHeight,
        atTop,
        atBottom,
        isTransitioning,
        currentSection
      });

      // If section is not scrollable, immediately change section
      if (!isScrollable) {
        e.preventDefault();
        if (e.deltaY > 0) {
          console.log('[Wheel] Not scrollable → Next section');
          goToNextSection();
        } else {
          console.log('[Wheel] Not scrollable → Prev section');
          goToPrevSection();
        }
        return;
      }

      // If scrollable, check boundaries
      if (e.deltaY > 0 && atBottom) {
        // Scrolling down and at bottom → next section
        e.preventDefault();
        console.log('[Wheel] At bottom → Next section');
        goToNextSection();
      } else if (e.deltaY < 0 && atTop) {
        // Scrolling up and at top → previous section
        e.preventDefault();
        console.log('[Wheel] At top → Prev section');
        goToPrevSection();
      } else {
        // Let normal scroll happen within section
        console.log('[Wheel] Normal scroll within section');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNextSection();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevSection();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSection(totalSections - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNextSection();
        } else {
          goToPrevSection();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNextSection, goToPrevSection, goToSection, totalSections, isTransitioning, currentSection]);

  return {
    currentSection,
    goToSection,
    goToNextSection,
    goToPrevSection,
    progress: (currentSection / (totalSections - 1)) * 100,
    sectionContainerRef,
  };
}