import { type Tone, siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

import { Entry, TechList } from '@/components/ui/entry'
import { ExternalLink } from '@/components/ui/external-link'
import { SectionHeader } from '@/components/ui/section-header'

type Project = (typeof siteContent.featuredProjects.projects)[number]
type LabeledBullet = { label: string; description: string }
type LinkedBullet = { name: string; url: string; description: string }

const isLabeled = (bullet: unknown): bullet is LabeledBullet =>
  typeof bullet === 'object' && bullet !== null && 'label' in bullet
const isLinked = (bullet: unknown): bullet is LinkedBullet =>
  typeof bullet === 'object' && bullet !== null && 'url' in bullet

const NON_ENGLISH = new Set(['Pohlazení po těle a duši', 'Živé Sklo'])

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const num = `1.${index + 1}`
  const bullets: readonly unknown[] = project.bullets
  const tone: Tone = project.tone
  const demo =
    'demoUrl' in project ? (
      <p>
        <ExternalLink href={project.demoUrl}>{project.demoLabel}</ExternalLink>
      </p>
    ) : null

  if ('lead' in project) {
    return (
      <Entry
        num={num}
        badge={project.badges[0]}
        tone={tone}
        title={project.title}
        lead
        main={<p className='lead'>{formatTypography(project.lead)}</p>}
      >
        <dl className='flow'>
          {bullets.filter(isLabeled).map((step) => (
            <div key={step.label}>
              <dt className='mono caps'>{step.label}</dt>
              <dd>{formatTypography(step.description)}</dd>
            </div>
          ))}
        </dl>
        <TechList items={project.tech} />
      </Entry>
    )
  }

  const linked = bullets.filter(isLinked)
  const plain = bullets.filter((bullet): bullet is string => typeof bullet === 'string')

  return (
    <Entry
      num={num}
      badge={project.badges[0]}
      tone={tone}
      title={project.title}
      main={
        <>
          {demo}
          <TechList items={project.tech} />
        </>
      }
    >
      {linked.length > 0 ? (
        <ul className='sites'>
          {linked.map((site) => (
            <li key={site.url}>
              <ExternalLink href={site.url} lang={NON_ENGLISH.has(site.name) ? 'cs' : undefined}>
                {site.name}
              </ExternalLink>
              <span>{formatTypography(site.description)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className='points'>
          {plain.map((point) => (
            <li key={point}>{formatTypography(point)}</li>
          ))}
        </ul>
      )}
    </Entry>
  )
}

export function FeaturedProjects() {
  const { title, projects } = siteContent.featuredProjects

  return (
    <section id='featured-projects' className='section tone tone-violet' aria-labelledby='projects-h'>
      <SectionHeader
        id='projects-h'
        index='01'
        eyebrow='Selected work'
        title={title}
        meta={`${projects.length} entries`}
      />

      <div className='wrap'>
        {projects.map((project, index) => (
          <ProjectEntry key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
