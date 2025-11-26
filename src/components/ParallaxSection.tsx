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
      className={`${className} min-h-screen supports-[min-height:100dvh]:min-h-[100dvh]`}
      style={{
        ...style,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always', // Force snap to stop at section start
      }}
    >
      {children}
    </section>
  );
}