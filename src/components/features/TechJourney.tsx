import { Box, Code, Cpu, Database, Globe, type LucideIcon } from 'lucide-react'

import { type TechJourneyIconKey, siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

import { Card } from '@/components/ui/card'
import { FeatureGrid } from '@/components/ui/feature-grid'
import { SectionHeader } from '@/components/ui/section-header'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { TagList } from '@/components/ui/tag-list'
import { TechTag } from '@/components/ui/tech-tag'

const iconMap: Record<TechJourneyIconKey, LucideIcon> = {
  code: Code,
  database: Database,
  box: Box,
  cpu: Cpu,
  globe: Globe,
}

export function TechJourney() {
  const { title, subtitle, items } = siteContent.techJourney

  return (
    <SectionWrapper id='tech-journey'>
      <SectionHeader title={title} subtitle={subtitle} {...SECTION_STYLES.techJourney} />

      <FeatureGrid>
        {items.map((skillGroup, index) => {
          const Icon = iconMap[skillGroup.icon]
          return (
            <Card
              key={index}
              icon={Icon}
              iconColor={skillGroup.iconColor}
              title={skillGroup.category}
              description={skillGroup.description}
              fullHeight
            >
              <TagList>
                {skillGroup.items.map((item, itemIndex) => (
                  <TechTag key={itemIndex}>{item}</TechTag>
                ))}
              </TagList>
            </Card>
          )
        })}
      </FeatureGrid>
    </SectionWrapper>
  )
}
