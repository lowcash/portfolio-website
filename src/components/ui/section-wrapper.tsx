interface SectionWrapperProps {
  id: string
  children: React.ReactNode
  fullHeight?: boolean
  maxWidth?: '4xl' | '5xl' | '6xl'
  className?: string
  containerClassName?: string
}

const WIDTH_CLASS: Record<NonNullable<SectionWrapperProps['maxWidth']>, string> = {
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
}

export function SectionWrapper({
  id,
  children,
  fullHeight = false,
  maxWidth = '4xl',
  className = '',
  containerClassName,
}: SectionWrapperProps) {
  const resolvedContainerClassName = containerClassName ?? `${WIDTH_CLASS[maxWidth]} mx-auto w-full`

  return (
    <section
      data-section={id}
      className={`relative flex min-h-screen items-center justify-center px-6 py-20 md:px-8 ${fullHeight ? 'h-screen' : ''} ${className}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className={resolvedContainerClassName}>{children}</div>
    </section>
  )
}
