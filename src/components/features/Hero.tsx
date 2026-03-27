import { HeroContent } from '@/components/ui/hero-content'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

export function Hero() {
  const { gradient, glowColors } = SECTION_STYLES.hero
  const content = siteContent.hero

  return (
    <SectionWrapper id='hero' fullHeight maxWidth='5xl'>
      <HeroContent
        heading={content.heading}
        role={content.role}
        summary={content.summary}
        gradient={gradient}
        glowColors={glowColors}
      />
    </SectionWrapper>
  )
}
