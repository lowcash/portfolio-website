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
    <header className='text-center mb-16'>
      <h2
        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] ${gradient} bg-clip-text text-transparent`}
        style={{ filter: `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})` }}
      >
        {title}
      </h2>
      <p className='text-base md:text-lg text-gray-400'>{subtitle}</p>
    </header>
  )
}
