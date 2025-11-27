import { ReactNode } from 'react';
import { useSimpleScrollReveal } from '../../hooks/useSimpleScrollReveal';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * Reusable section wrapper with fade-in animation
 * Applies consistent spacing, centering, and scroll reveal effect
 */
export function SectionWrapper({ 
  id, 
  children, 
  className = '',
  containerClassName = 'max-w-6xl'
}: SectionWrapperProps) {
  const { revealRef, style } = useSimpleScrollReveal();

  return (
    <section 
      id={id}
      className={`min-h-screen flex items-center justify-center py-20 px-6 md:px-8 relative ${className}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <div 
        ref={revealRef}
        style={style}
        className={`${containerClassName} mx-auto w-full`}
      >
        {children}
      </div>
    </section>
  );
}