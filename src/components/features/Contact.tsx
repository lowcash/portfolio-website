import { siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

import { CopyAddress } from '@/components/ui/copy-address'
import { ExternalLink } from '@/components/ui/external-link'
import { SectionHeader } from '@/components/ui/section-header'

export function Contact() {
  const { title, email, hint, socials } = siteContent.contact
  const [user, domain] = email.split('@')

  return (
    <section id='contact' className='section contact tone tone-fuchsia' aria-labelledby='contact-h'>
      <SectionHeader id='contact-h' index='03' title={title} />

      <div className='contact-body wrap grid-12'>
        <a className='mail' href={`mailto:${email}`}>
          {user}
          <i>@</i>
          {domain}
        </a>
        <div className='contact-row mono'>
          <CopyAddress value={email} />
          {socials.map((social) => (
            <ExternalLink key={social.label} href={social.href} aria-label={`Connect with me on ${social.label}`}>
              {social.label}
            </ExternalLink>
          ))}
        </div>
        <p className='hint mono'>
          <span className='d'>{formatTypography(hint.desktop)}</span>
          <span className='m'>{formatTypography(hint.mobile)}</span>
        </p>
      </div>
    </section>
  )
}
