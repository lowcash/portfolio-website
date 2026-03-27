import { ReactNode } from 'react';

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
  containerClassName = 'max-w-4xl'
}: SectionWrapperProps) {
  return (
    <div
      data-section={id}
      className={`section-wrapper-safe-rail min-h-screen flex items-center justify-center py-20 relative ${className}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className={`${containerClassName} mx-auto w-full`}>
        {children}
      </div>
    </div>
  );
}
