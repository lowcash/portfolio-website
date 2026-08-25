interface ParallaxSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  id: string
  className?: string
  style?: React.CSSProperties
}

export function ParallaxSection({ children, id, className = '', style, ...props }: ParallaxSectionProps) {
  const isContact = id === 'contact'

  return (
    <section
      id={id}
      className={[
        'flex min-h-screen flex-col justify-center py-16 md:min-h-[100dvh] md:py-0',
        isContact ? 'items-center' : '',
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
