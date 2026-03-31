interface ParallaxSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  id: string
  className?: string
  style?: React.CSSProperties
}

export function ParallaxSection({ children, id, className, style, ...props }: ParallaxSectionProps) {
  return (
    <section
      id={id}
      className={`${className || ''} scroll-snap-section`.trim()}
      style={{
        ...style,
      }}
      {...props}
    >
      {children}
    </section>
  )
}
