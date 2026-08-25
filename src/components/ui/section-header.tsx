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

const SECTION_TITLE_CLASS =
  'relative mb-3 pb-[2px] text-2xl font-bold tracking-tight text-balance text-zinc-100 sm:text-3xl'

export function SectionHeader({
  title,
  subtitle,
  gradient,
  glowColors,
  variant = 'compact',
}: SectionHeaderProps) {
  const formattedTitle = formatTypography(title)
  const formattedSubtitle = subtitle ? formatTypography(subtitle) : ''

  const glowFilter =
    variant === 'compact'
      ? `drop-shadow(0 0 6px ${glowColors.primary}) drop-shadow(0 0 14px ${glowColors.secondary})`
      : `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})`

  return (
    <header className='mb-6 text-center md:mb-8'>
      <h2 className={SECTION_TITLE_CLASS} style={{ filter: glowFilter }}>
        <span className='relative'>{formattedTitle}</span>
        <span
          aria-hidden='true'
          className={`pointer-events-none absolute inset-0 ${gradient} bg-clip-text text-transparent`}
        >
          {formattedTitle}
        </span>
      </h2>
      {formattedSubtitle ? (
        <p className='mx-auto max-w-lg text-sm font-normal leading-relaxed text-zinc-300 sm:text-base'>
          {formattedSubtitle}
        </p>
      ) : null}
    </header>
  )
}
