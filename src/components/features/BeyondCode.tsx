import { BookOpen, Music2, Plane, TrendingUp } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Card } from '@/components/ui/card'
import { FeatureGrid } from '@/components/ui/feature-grid'
import { SectionLink } from '@/components/ui/section-link'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { TagList } from '@/components/ui/tag-list'
import { TechTag } from '@/components/ui/tech-tag'
import { siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

export function BeyondCode() {
  const content = siteContent.beyondCode
  const iconMap = {
    music2: Music2,
    plane: Plane,
    bookOpen: BookOpen,
    trendingUp: TrendingUp,
  } as const

  return (
    <SectionWrapper id='beyond-code'>
      <SectionHeader title={content.title} subtitle={content.subtitle} {...SECTION_STYLES.beyondCode} />

      <FeatureGrid>
        {content.items.map((interest, index) => (
          <Card
            key={index}
            icon={iconMap[interest.icon]}
            iconColor={interest.iconColor}
            title={interest.title}
            description={interest.description}
            fullHeight
          >
            <TagList>
              {interest.tags.map((tag, tagIndex) => (
                <TechTag key={tagIndex}>{tag}</TechTag>
              ))}
            </TagList>
            {'link' in interest && 'linkText' in interest && interest.link && interest.linkText && (
              <SectionLink href={interest.link}>{interest.linkText}</SectionLink>
            )}
          </Card>
        ))}
      </FeatureGrid>
    </SectionWrapper>
  )
}
