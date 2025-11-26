import { ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxSection({ children, id, className, style }: ParallaxSectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        ...style,
        scrollSnapAlign: 'start',
        // Note: scroll-snap-stop removed for better iOS Safari compatibility
      }}
    >
      {children}
    </section>
  );
}