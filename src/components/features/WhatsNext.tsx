import { Rocket, TrendingUp, Target } from 'lucide-react'
import { SectionWrapper } from '../shared/SectionWrapper'
import { SectionHeader } from '../shared/SectionHeader'
import { SECTION_STYLES } from '../../lib/section-config'
import { Stack } from '../ui/stack'
import { FeatureCard } from '../ui/feature-card'
import { siteContent } from '../../lib/content'

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
