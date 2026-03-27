import { Eye, Glasses, Globe, TrendingUp, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { FeatureGrid } from '@/components/ui/feature-grid'
import { SectionHeader } from '@/components/ui/section-header'
import { SectionLink } from '@/components/ui/section-link'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { TagList } from '@/components/ui/tag-list'
import { TechTag } from '@/components/ui/tech-tag'
import { siteContent, type NotableWorkIconKey } from '@/lib/content'
import { SECTION_STYLES } from '@/lib/section-config'

const iconMap: Record<NotableWorkIconKey, LucideIcon> = {
  eye: Eye,
  glasses: Glasses,
  trendingUp: TrendingUp,
  globe: Globe,
}

export function NotableWork() {
  const { title, subtitle, projects } = siteContent.notableWork

  return (
    <SectionWrapper id='notable-work'>
      <SectionHeader title={title} subtitle={subtitle} {...SECTION_STYLES.notableWork} />

      <FeatureGrid>
        {projects.map((project, index) => {
          const Icon = iconMap[project.icon]
          return (
            <Card
              key={index}
              icon={Icon}
              iconColor={project.iconColor}
              title={project.title}
              subtitle={project.period}
              description={project.description}
              fullHeight
            >
              <TagList>
                {project.tech.map((tech, techIndex) => (
                  <TechTag key={techIndex}>{tech}</TechTag>
                ))}
              </TagList>
              {'link' in project && project.link && (
                <SectionLink href={project.link}>
                  {'linkText' in project && project.linkText ? project.linkText : 'Watch Demo Video'}
                </SectionLink>
              )}
              {'multipleLinks' in project && project.multipleLinks && (
                <TagList stacked>
                  {project.multipleLinks.map((link, linkIndex) => (
                    <SectionLink key={linkIndex} href={link.url}>
                      {link.text}
                    </SectionLink>
                  ))}
                </TagList>
              )}
            </Card>
          )
        })}
      </FeatureGrid>
    </SectionWrapper>
  )
}
