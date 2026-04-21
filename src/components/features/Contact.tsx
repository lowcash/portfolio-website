import { Github, Linkedin, Send } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

import { ContactContent } from '@/components/ui/contact-content'
import { SectionWrapper } from '@/components/ui/section-wrapper'

export function Contact() {
  const content = siteContent.contact
  const iconMap = {
    github: Github,
    linkedin: Linkedin,
    send: Send,
  } as const

  return (
    <SectionWrapper id='contact' maxWidth='4xl'>
      <ContactContent
        title={content.title}
        intro={content.intro}
        highlightEmail={content.highlightEmail}
        note={content.note}
        techLine={content.techLine}
        analyticsDisclosure={content.analyticsDisclosure}
        hint={content.hint}
        socials={content.socials}
        iconMap={iconMap}
        gradient={SECTION_STYLES.contact.gradient}
        glowColors={SECTION_STYLES.contact.glowColors}
      />
    </SectionWrapper>
  )
}
