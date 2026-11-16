import { siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

import { Entry, TechList } from '@/components/ui/entry'
import { ExternalLink } from '@/components/ui/external-link'
import { SectionHeader } from '@/components/ui/section-header'

export function Experience() {
  const { title, experiences, education, beyondCodeNote } = siteContent.experience

  return (
    <section id='experience' className='section tone tone-teal' aria-labelledby='experience-h'>
      <SectionHeader
        id='experience-h'
        index='02'
        eyebrow='Roles and education'
        title={title}
        meta={[`${experiences.length} roles`, `${education.degrees.length} degrees`]}
      />

      <div className='wrap'>
        {experiences.map((experience, index) => (
          <Entry
            key={experience.title}
            num={`2.${index + 1}`}
            badge={experience.period}
            tone={experience.tone}
            title={experience.title}
            main={<TechList items={experience.technologies} />}
          >
            <ul className='rows'>
              {experience.bullets.map((bullet) => (
                <li key={bullet}>{formatTypography(bullet)}</li>
              ))}
            </ul>
          </Entry>
        ))}

        <Entry
          num={`2.${experiences.length + 1}`}
          badge={education.badge}
          tone={education.tone}
          title={education.institution}
        >
          <ul className='rows'>
            {education.degrees.map((degree) => (
              <li key={degree.label}>
                <strong>{formatTypography(degree.label)}</strong>
                <span className='sub'>{formatTypography(degree.field)}</span>
                <span className='sub sub--meta mono'>{degree.years}</span>
              </li>
            ))}
          </ul>
        </Entry>

        <div className='aside grid-12 reveal'>
          <p className='l-col'>
            {formatTypography(beyondCodeNote.before)}{' '}
            <span style={{ whiteSpace: 'nowrap' }}>
              as{' '}
              <ExternalLink href={beyondCodeNote.link.href} rel='noreferrer' className='dnb'>
                {beyondCodeNote.link.label}
              </ExternalLink>
              {beyondCodeNote.after}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
