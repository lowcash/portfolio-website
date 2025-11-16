import { useEffect, useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxSection({ children, id, className, style }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={className}
      style={{
        ...style,
        transition: 'opacity 700ms ease-out', // Preserve opacity transition
      }}
    >
      {children}
    </section>
  );
}