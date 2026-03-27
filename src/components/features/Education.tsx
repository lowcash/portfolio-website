import { GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SectionHeader } from '@/components/ui/section-header'
import { SectionList } from '@/components/ui/section-list'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { siteContent } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

export function Education() {
  const { title, subtitle, degrees } = siteContent.education

  return (
    <SectionWrapper id='education' maxWidth='4xl'>
      <SectionHeader title={title} subtitle={subtitle} {...SECTION_STYLES.education} />

      <SectionList width='5xl'>
        {degrees.map((edu, index) => (
          <Card
            key={index}
            icon={GraduationCap}
            iconColor={edu.iconColor}
            title={edu.degree}
            eyebrow={edu.field}
            subtitle={`${edu.institution} | ${edu.years}`}
            description={edu.description}
          />
        ))}
      </SectionList>
    </SectionWrapper>
  )
}
