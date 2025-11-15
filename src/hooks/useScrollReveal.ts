import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.5, rootMargin = '-15% 0px -15% 0px' } = options;
  const ref = useRef<HTMLElement>(null);
  const [scrollState, setScrollState] = useState<'above' | 'visible' | 'below'>('below');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementTop = entry.boundingClientRect.top;
          const windowHeight = window.innerHeight;

          if (entry.isIntersecting) {
            setScrollState('visible');
          } else if (elementTop < 0) {
            // Element is above viewport
            setScrollState('above');
          } else if (elementTop > windowHeight) {
            // Element is below viewport
            setScrollState('below');
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Calculate transform and opacity based on scroll state
  const getStyle = () => {
    switch (scrollState) {
      case 'above':
        return {
          opacity: 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'opacity',
        };
      case 'visible':
        return {
          opacity: 1,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'opacity',
        };
      case 'below':
        return {
          opacity: 0,
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'opacity',
        };
    }
  };

  return {
    ref,
    style: getStyle(),
    scrollState,
  };
}