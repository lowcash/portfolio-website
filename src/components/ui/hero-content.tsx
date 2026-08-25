import { ChevronDown } from 'lucide-react'

import { formatTypography } from '@/lib/prevent-widows'

interface HeroContentProps {
  heading: string
  role: string
  summary: string
  gradient: string
  glowColors: {
    primary: string
    secondary: string
  }
}

export function HeroContent({ heading, role, summary, gradient, glowColors }: HeroContentProps) {
  const formattedHeading = formatTypography(heading)
  const formattedRole = formatTypography(role)
  const formattedSummary = formatTypography(summary)

  return (
    <div className='px-4 text-center'>
      <header className='py-8'>
        <h1
          className='relative mb-6 pb-[5px] text-balance text-white'
          style={{
            fontSize: 'clamp(2.5rem, 6.2vw, 4.75rem)',
            lineHeight: 1.05,
            filter: `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})`,
          }}
        >
          <span className='relative'>{formattedHeading}</span>
          <span
            aria-hidden='true'
            className={`pointer-events-none absolute inset-0 ${gradient} bg-clip-text text-transparent`}
          >
            {formattedHeading}
          </span>
        </h1>
      </header>

      <div>
        <p className='mx-auto mb-4 max-w-lg text-sm leading-relaxed font-normal text-zinc-300 sm:text-base'>
          {formattedRole}
        </p>
        <p className='mx-auto max-w-lg text-sm leading-relaxed font-normal tracking-wide text-pretty text-zinc-300 sm:text-base'>
          {formattedSummary}
        </p>
      </div>

      <div className='mt-16 animate-bounce' aria-hidden='true'>
        <ChevronDown className='mx-auto h-8 w-8 text-gray-400' />
      </div>
    </div>
  )
}
