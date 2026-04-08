import { ChevronDown } from 'lucide-react'

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
  return (
    <div className='px-4 text-center'>
      <header className='py-8'>
        <h1
          className='relative mb-6 pb-[5px] text-white'
          style={{
            fontSize: 'clamp(2.5rem, 6.2vw, 4.75rem)',
            lineHeight: 1.05,
            filter: `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})`,
          }}
        >
          <span className='relative'>{heading}</span>
          <span
            aria-hidden='true'
            className={`pointer-events-none absolute inset-0 ${gradient} bg-clip-text text-transparent`}
          >
            {heading}
          </span>
        </h1>
      </header>

      <div>
        <p className='mb-4 text-xl text-gray-300 md:text-2xl'>{role}</p>
        <p className='mx-auto max-w-2xl text-base text-gray-400 md:text-lg'>{summary}</p>
      </div>

      <div className='mt-16 animate-bounce' aria-hidden='true'>
        <ChevronDown className='mx-auto h-8 w-8 text-gray-400' />
      </div>
    </div>
  )
}
