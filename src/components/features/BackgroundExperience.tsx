import { Briefcase, GraduationCap } from 'lucide-react'

import { siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'
import { SECTION_STYLES } from '@/lib/section-config'

import { Card } from '@/components/ui/card'
import { CARD_BODY_CLASS } from '@/components/ui/card-tokens'
import { ExternalLinkIcon } from '@/components/ui/external-link-icon'
import { SectionHeader } from '@/components/ui/section-header'
import { SectionList } from '@/components/ui/section-list'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { TagList } from '@/components/ui/tag-list'
import { TechTag } from '@/components/ui/tech-tag'

export function BackgroundExperience() {
  const { title, experiences, education, beyondCodeNote } = siteContent.backgroundExperience

  return (
    <SectionWrapper id='experience' maxWidth='5xl'>
      <SectionHeader title={title} subtitle='' {...SECTION_STYLES.backgroundExperience} />

      <SectionList width='5xl'>
        {experiences.map((exp, index) => (
          <Card
            key={`exp-${index}`}
            icon={Briefcase}
            iconColor={exp.iconColor}
            title={exp.title}
            badges={[exp.period]}
            bullets={exp.bullets}
          >
            <TagList>
              {exp.technologies.map((tech) => (
                <TechTag key={tech}>{tech}</TechTag>
              ))}
            </TagList>
          </Card>
        ))}

        <Card
          icon={GraduationCap}
          iconColor={education.iconColor}
          title={education.institution}
          badges={[education.badge]}
        >
          <ul className={`list-disc space-y-2 pl-5 ${CARD_BODY_CLASS}`}>
            {education.degrees.map((degree) => (
              <li key={degree.label}>
                <span className='font-medium text-zinc-100'>{degree.label}:</span>{' '}
                {formatTypography(`${degree.field} (${degree.years})`)}
              </li>
            ))}
          </ul>
        </Card>

        <div className='px-8 pt-2'>
          <p className={`text-left ${CARD_BODY_CLASS}`}>
            {formatTypography(beyondCodeNote.before)}{' '}
            <span className='whitespace-nowrap'>
              as{' '}
              <a
                href={beyondCodeNote.link.href}
                target='_blank'
                rel='noreferrer'
                className='group inline-flex items-center text-zinc-300 transition-colors duration-150 hover:text-white'
              >
                <span className='font-medium transition-colors duration-150'>
                  {beyondCodeNote.link.label}
                </span>
                <ExternalLinkIcon />
              </a>
            </span>
            {formatTypography(beyondCodeNote.after)}
          </p>
        </div>
      </SectionList>
    </SectionWrapper>
  )
}
