import { formatTypography } from '@/lib/prevent-widows'

interface SectionHeaderProps {
  title: string
  subtitle: string
  gradient: string
  glowColors: {
    primary: string
    secondary: string
  }
  variant?: 'default' | 'compact'
}

export function SectionHeader({
  title,
  subtitle,
  gradient,
  glowColors,
  variant = 'compact',
}: SectionHeaderProps) {
  const formattedTitle = formatTypography(title)
  const formattedSubtitle = subtitle ? formatTypography(subtitle) : ''

  const headingClassName =
    variant === 'compact'
      ? 'relative mb-3 pb-[2px] text-3xl font-bold text-balance text-zinc-100 sm:text-4xl md:text-5xl'
      : 'relative mb-6 pb-[3px] text-4xl font-bold text-zinc-100 sm:text-5xl md:text-6xl lg:text-7xl'

  const glowFilter =
    variant === 'compact'
      ? `drop-shadow(0 0 6px ${glowColors.primary}) drop-shadow(0 0 14px ${glowColors.secondary})`
      : `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})`

  return (
    <header className='mb-6 text-center md:mb-10'>
      <h2 className={headingClassName} style={{ filter: glowFilter }}>
        <span className='relative'>{formattedTitle}</span>
        <span
          aria-hidden='true'
          className={`pointer-events-none absolute inset-0 ${gradient} bg-clip-text text-transparent`}
        >
          {formattedTitle}
        </span>
      </h2>
      {formattedSubtitle ? <p className='text-base text-gray-400 md:text-lg'>{formattedSubtitle}</p> : null}
    </header>
  )
}
