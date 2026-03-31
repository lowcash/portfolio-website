import { Rocket, Target, TrendingUp } from 'lucide-react'

import { siteContent } from '../../lib/content'
import { SECTION_STYLES } from '../../lib/section-config'
import { FeatureCard } from '../ui/feature-card'
import { SectionHeader } from '../ui/section-header'
import { SectionWrapper } from '../ui/section-wrapper'
import { Stack } from '../ui/stack'

export function WhatsNext() {
  const iconMap = {
    rocket: Rocket,
    trendingUp: TrendingUp,
    target: Target,
  } as const

  const content = siteContent.whatsNext

  return (
    <SectionWrapper id='whats-next'>
      <SectionHeader title={content.title} subtitle={content.subtitle} {...SECTION_STYLES.whatsNext} />

      <Stack gap='sm' width='3xl' centerX>
        {content.items.map((item, index) => (
          <FeatureCard
            key={index}
            icon={iconMap[item.icon]}
            title={item.title}
            description={item.description}
            iconTone={item.iconTone}
          />
        ))}
      </Stack>
    </SectionWrapper>
  )
}
