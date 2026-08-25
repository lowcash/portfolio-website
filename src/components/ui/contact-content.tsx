import { Github, Linkedin } from 'lucide-react'

import type { ContactIconKey } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

import { ExternalLinkIcon } from '@/components/ui/external-link-icon'
import { SectionHeader } from '@/components/ui/section-header'

type SocialItem = {
  icon: ContactIconKey
  label: string
  href: string
}

interface ContactContentProps {
  title: string
  email: string
  hint: string
  socials: readonly SocialItem[]
  gradient: string
  glowColors: {
    primary: string
    secondary: string
  }
}

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
} as const

export function ContactContent({ title, email, hint, socials, gradient, glowColors }: ContactContentProps) {
  return (
    <div className='text-center'>
      <SectionHeader title={title} subtitle='' gradient={gradient} glowColors={glowColors} />

      <a
        href={`mailto:${email}`}
        className='-mt-8 mb-8 inline-block text-xl text-purple-400 transition-colors hover:text-pink-400 md:text-2xl'
      >
        {email}
      </a>

      <div className='mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-gray-400 md:text-base'>
        {socials.map((social, index) => {
          const Icon = socialIcons[social.icon]

          return (
            <span key={social.label} className='inline-flex items-center gap-3'>
              {index > 0 ? <span aria-hidden='true' className='text-gray-600'>
                  ·
                </span> : null}
              <a
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                className='group inline-flex items-center text-zinc-300 transition-colors duration-150 hover:text-white'
                aria-label={`Connect with me on ${social.label}`}
              >
                <span className='inline-flex items-center gap-2'>
                  <Icon className='h-4 w-4 shrink-0 text-purple-400/80' aria-hidden />
                  <span className='font-medium transition-colors duration-150'>{social.label}</span>
                </span>
                <ExternalLinkIcon />
              </a>
            </span>
          )
        })}
      </div>

      <p className='font-mono text-xs text-gray-500'>
        <span className='cursor-default opacity-50 transition-opacity hover:opacity-100'>
          💡 {formatTypography(hint)}
        </span>
      </p>
    </div>
  )
}
