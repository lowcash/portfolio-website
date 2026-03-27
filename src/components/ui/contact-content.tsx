import type { ComponentType } from 'react'
import type { ContactIconKey } from '@/lib/content'
import { SectionHeader } from '@/components/ui/section-header'

type SocialItem = {
  icon: ContactIconKey
  label: string
  href: string
  username: string
}

interface ContactContentProps {
  title: string
  intro: string
  highlightEmail: string
  note: string
  techLine: string
  hint: string
  socials: readonly SocialItem[]
  iconMap: Record<ContactIconKey, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>>
  gradient: string
  glowColors: {
    primary: string
    secondary: string
  }
}

export function ContactContent({
  title,
  intro,
  highlightEmail,
  note,
  techLine,
  hint,
  socials,
  iconMap,
  gradient,
  glowColors,
}: ContactContentProps) {
  return (
    <div className='text-center'>
      <SectionHeader title={title} subtitle='' gradient={gradient} glowColors={glowColors} />

      <p className='text-base md:text-lg text-gray-400 mb-16 max-w-2xl mx-auto -mt-8'>
        {intro} <span className='text-purple-400'>{highlightEmail}</span>
        <br />
        <br />
        <span className='text-sm text-gray-500'>{note}</span>
      </p>

      <div className='flex flex-wrap justify-center gap-3 mb-16'>
        {socials.map((social, index) => {
          const Icon = iconMap[social.icon]

          return (
            <a
              key={index}
              href={social.href}
              target='_blank'
              rel='noopener noreferrer'
              className='relative group'
              aria-label={`Connect with me on ${social.label}: ${social.username}`}
            >
              <div className='flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500'>
                <Icon
                  className='w-6 h-6 text-purple-400 shrink-0 transition-all duration-500 group-hover:text-pink-400'
                  aria-hidden
                />
                <div className='text-left'>
                  <div className='text-xs text-gray-500 transition-colors duration-500 group-hover:text-gray-400'>
                    {social.label}
                  </div>
                  <div className='text-sm text-gray-300 transition-colors duration-500 group-hover:text-white'>
                    {social.username}
                  </div>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      <p className='text-sm text-gray-600'>{techLine}</p>

      <p className='text-xs text-gray-700 mt-4 font-mono hidden md:block'>
        <span className='opacity-50 hover:opacity-100 transition-opacity cursor-default'>💡 {hint}</span>
      </p>
    </div>
  )
}
