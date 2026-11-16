import { siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

import { ExternalLink } from '@/components/ui/external-link'
import { SectionHeader } from '@/components/ui/section-header'

export function Contact() {
  const { title, email, hint, socials } = siteContent.contact

  return (
    <section id='contact' className='section contact tone tone-fuchsia' aria-labelledby='contact-h'>
      <SectionHeader id='contact-h' index='03' eyebrow='Get in touch' title={title} />

      <div className='contact-body wrap grid-12'>
        <a className='mail l-col' href={`mailto:${email}`}>
          {email}
        </a>
        <ul className='rows l-col'>
          {socials.map((social) => (
            <li key={social.label}>
              <ExternalLink href={social.href} aria-label={`Connect with me on ${social.label}`}>
                {social.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
        <p className='hint l-col mono'>
          <span className='d'>{formatTypography(hint.desktop)}</span>
          <span className='m'>{formatTypography(hint.mobile)}</span>
        </p>
      </div>
    </section>
  )
}
