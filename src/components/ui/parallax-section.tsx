interface ParallaxSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  id: string
  className?: string
  style?: React.CSSProperties
  /** Center children horizontally (e.g. contact) */
  centered?: boolean
}

export function ParallaxSection({
  children,
  id,
  className = '',
  style,
  centered = false,
  ...props
}: ParallaxSectionProps) {
  return (
    <section
      id={id}
      className={[
        'flex min-h-screen flex-col justify-center py-16 md:min-h-[100dvh] md:py-0',
        centered ? 'items-center' : '',
        'scroll-mt-16 md:scroll-mt-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...props}
    >
      {children}
    </section>
  )
}
