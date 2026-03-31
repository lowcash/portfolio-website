import { Brain, type LucideIcon, Sparkles, Zap } from 'lucide-react'

import { type WhoIAmIconKey, siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

import { Card } from '@/components/ui/card'
import { SectionHeader } from '@/components/ui/section-header'
import { SectionList } from '@/components/ui/section-list'
import { SectionWrapper } from '@/components/ui/section-wrapper'

const iconMap: Record<WhoIAmIconKey, LucideIcon> = {
  zap: Zap,
  sparkles: Sparkles,
  brain: Brain,
}

export function WhoIAm() {
  const { title, subtitle, items } = siteContent.whoIAm

  return (
    <SectionWrapper id='who-i-am'>
      <SectionHeader title={title} subtitle={subtitle} {...SECTION_STYLES.whoIAm} />

      <SectionList width='3xl'>
        {items.map((item, index) => {
          const Icon = iconMap[item.icon]
          return (
            <Card
              key={index}
              icon={Icon}
              iconColor={item.iconColor}
              title={item.title}
              description={item.description}
            />
          )
        })}
      </SectionList>
    </SectionWrapper>
  )
}
