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
  analyticsDisclosure: string
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
  analyticsDisclosure,
  hint,
  socials,
  iconMap,
  gradient,
  glowColors,
}: ContactContentProps) {
  return (
    <div className='text-center'>
      <SectionHeader title={title} subtitle='' gradient={gradient} glowColors={glowColors} />

      <p className='mx-auto -mt-8 mb-16 max-w-2xl text-base text-gray-400 md:text-lg'>
        {intro} <span className='text-purple-400'>{highlightEmail}</span>
        <br />
        <br />
        <span className='text-sm text-gray-400'>{note}</span>
      </p>

      <div className='mb-16 flex flex-wrap justify-center gap-3'>
        {socials.map((social, index) => {
          const Icon = iconMap[social.icon]

          return (
            <a
              key={index}
              href={social.href}
              target='_blank'
              rel='noopener noreferrer'
              className='group relative'
              aria-label={`Connect with me on ${social.label}: ${social.username}`}
            >
              <div className='flex items-center gap-3 rounded-2xl px-6 py-4 transition-all duration-500'>
                <Icon
                  className='h-6 w-6 shrink-0 text-purple-400 transition-all duration-500 group-hover:text-pink-400'
                  aria-hidden
                />
                <div className='text-left'>
                  <div className='text-xs text-gray-400 transition-colors duration-500 group-hover:text-gray-300'>
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

      <p className='text-sm text-gray-400'>{techLine}</p>

      <p className='mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-gray-500'>{analyticsDisclosure}</p>

      <p className='mt-4 hidden font-mono text-xs text-gray-500 md:block'>
        <span className='cursor-default opacity-50 transition-opacity hover:opacity-100'>💡 {hint}</span>
      </p>
    </div>
  )
}
