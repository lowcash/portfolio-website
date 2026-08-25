import { siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

import { ContactContent } from '@/components/ui/contact-content'
import { SectionWrapper } from '@/components/ui/section-wrapper'

export function Contact() {
  const content = siteContent.contact

  return (
    <SectionWrapper
      id='contact'
      maxWidth='4xl'
      fullHeight
      className='items-center justify-center text-center'
      containerClassName='mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center'
    >
      <ContactContent
        title={content.title}
        email={content.email}
        hint={content.hint}
        socials={content.socials}
        gradient={SECTION_STYLES.contact.gradient}
        glowColors={SECTION_STYLES.contact.glowColors}
      />
    </SectionWrapper>
  )
}
