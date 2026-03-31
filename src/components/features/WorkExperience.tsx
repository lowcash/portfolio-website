import { Briefcase } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

import { Card } from '@/components/ui/card'
import { SectionHeader } from '@/components/ui/section-header'
import { SectionList } from '@/components/ui/section-list'
import { SectionNote } from '@/components/ui/section-note'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { TagList } from '@/components/ui/tag-list'
import { TechTag } from '@/components/ui/tech-tag'

export function WorkExperience() {
  const { title, subtitle, experiences, closing } = siteContent.workExperience

  return (
    <SectionWrapper id='work-experience'>
      <SectionHeader title={title} subtitle={subtitle} {...SECTION_STYLES.workExperience} />

      <SectionList width='5xl'>
        {experiences.map((exp, index) => (
          <Card
            key={index}
            icon={Briefcase}
            iconColor={exp.iconColor}
            title={exp.title}
            subtitle={exp.period}
            description={exp.description}
          >
            <TagList>
              {exp.technologies.map((tech, techIndex) => (
                <TechTag key={techIndex}>{tech}</TechTag>
              ))}
            </TagList>
          </Card>
        ))}
      </SectionList>

      <SectionNote text={closing} />
    </SectionWrapper>
  )
}
