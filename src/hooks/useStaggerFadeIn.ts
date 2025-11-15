import { useEffect, useRef, useState } from 'react';

export function useStaggerFadeIn(itemCount: number, options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  // Generate delay for each item (100ms stagger)
  const getItemStyle = (index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transitionDelay: `${index * 100}ms`,
  });

  return { ref, isVisible, getItemStyle };
}
