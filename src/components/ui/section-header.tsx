interface SectionHeaderProps {
  title: string
  subtitle: string
  gradient: string
  glowColors: {
    primary: string
    secondary: string
  }
}

export function SectionHeader({ title, subtitle, gradient, glowColors }: SectionHeaderProps) {
  return (
    <header className='mb-16 text-center'>
      <h2
        className='relative mb-6 pb-[3px] text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl'
        style={{ filter: `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})` }}
      >
        <span className='relative'>{title}</span>
        <span
          aria-hidden='true'
          className={`pointer-events-none absolute inset-0 ${gradient} bg-clip-text text-transparent`}
        >
          {title}
        </span>
      </h2>
      <p className='text-base text-gray-400 md:text-lg'>{subtitle}</p>
    </header>
  )
}
