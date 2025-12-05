import { ReactNode } from 'react';

interface ParallaxSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxSection({ children, id, className, style, ...props }: ParallaxSectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        ...style,
        // Note: scroll-snap-stop removed for better iOS Safari compatibility
      }}
      {...props}
    >
      {children}
    </section>
  );
}