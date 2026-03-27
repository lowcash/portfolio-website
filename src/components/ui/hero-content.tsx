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
    <div className='text-center px-4'>
      <header className='py-8'>
        <h1
          className={`mb-6 pb-[5px] ${gradient} bg-clip-text text-transparent`}
          style={{
            fontSize: 'clamp(2.5rem, 6.2vw, 4.75rem)',
            lineHeight: 1.05,
            filter: `drop-shadow(0 0 12px ${glowColors.primary}) drop-shadow(0 0 24px ${glowColors.secondary})`,
          }}
        >
          {heading}
        </h1>
      </header>

      <div>
        <p className='text-xl md:text-2xl text-gray-300 mb-4'>{role}</p>
        <p className='text-base md:text-lg text-gray-400 max-w-2xl mx-auto'>{summary}</p>
      </div>

      <div className='mt-16 animate-bounce' aria-hidden='true'>
        <ChevronDown className='w-8 h-8 mx-auto text-gray-400' />
      </div>
    </div>
  )
}
