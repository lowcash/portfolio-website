import { Eye, Globe, type LucideIcon, TrendingUp } from 'lucide-react'

import { type FeaturedProjectIconKey, siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'
import { SECTION_STYLES } from '@/lib/section-config'

import { ContentCard } from '@/components/ui/card-layout'
import { CARD_BODY_CLASS, CARD_MONO_LABEL_CLASS } from '@/components/ui/card-tokens'
import { ExternalLinkIcon } from '@/components/ui/external-link-icon'
import { SectionHeader } from '@/components/ui/section-header'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { TagList } from '@/components/ui/tag-list'
import { TechTag } from '@/components/ui/tech-tag'

const iconMap: Record<FeaturedProjectIconKey, LucideIcon> = {
  eye: Eye,
  trendingUp: TrendingUp,
  globe: Globe,
}

type Project = (typeof siteContent.featuredProjects.projects)[number]
type TradingProject = Extract<Project, { layout: 'featured' }>
type ProjectBullet = NonNullable<Extract<Project, { bullets: unknown }>['bullets']>[number]
type LabeledBullet = Extract<ProjectBullet, { label: string }>

const EXTERNAL_LINK_CLASS =
  'group inline-flex items-center text-zinc-300 transition-colors duration-150 hover:text-white'
const EXTERNAL_LINK_LABEL_CLASS = 'font-medium transition-colors duration-150'

function isLinkedBullet(bullet: ProjectBullet): bullet is Extract<ProjectBullet, { url: string }> {
  return typeof bullet === 'object' && 'url' in bullet
}

function isLabeledBullet(bullet: ProjectBullet): bullet is LabeledBullet {
  return typeof bullet === 'object' && 'label' in bullet
}

function ClientProjectItem({ title, url, description }: { title: string; url: string; description: string }) {
  return (
    <li className='space-y-1'>
      <div>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='group inline-flex items-center text-zinc-200 transition-colors duration-150 hover:text-white'
        >
          <span className='text-sm font-medium'>{title}</span>
          <ExternalLinkIcon className='ml-1 h-3 w-3' />
        </a>
      </div>
      <p className='text-sm leading-relaxed text-zinc-300'>{formatTypography(description)}</p>
    </li>
  )
}

function ProjectBullets({ bullets }: { bullets: readonly ProjectBullet[] }) {
  return (
    <ul className={`list-disc space-y-2 pl-5 ${CARD_BODY_CLASS}`}>
      {bullets.map((bullet, index) => {
        if (typeof bullet === 'string') {
          return (
            <li key={index} className='leading-relaxed'>
              {formatTypography(bullet)}
            </li>
          )
        }

        if (isLinkedBullet(bullet)) {
          return (
            <ClientProjectItem key={bullet.url} title={bullet.name} url={bullet.url} description={bullet.description} />
          )
        }

        if (isLabeledBullet(bullet)) {
          return (
            <li key={bullet.label} className='leading-relaxed'>
              <span className='font-medium text-zinc-100'>{bullet.label}:</span>{' '}
              <span className='font-normal text-zinc-400'>{formatTypography(bullet.description)}</span>
            </li>
          )
        }

        return null
      })}
    </ul>
  )
}

function SubsystemGrid({ subsystems }: { subsystems: readonly LabeledBullet[] }) {
  return (
    <div className='mt-3.5 grid grid-cols-1 gap-2.5 md:grid-cols-3'>
      {subsystems.map((subsystem) => (
        <div key={subsystem.label} className='min-w-0'>
          <h4 className={CARD_MONO_LABEL_CLASS}>{subsystem.label}</h4>
          <p className={`mt-1 ${CARD_BODY_CLASS}`}>{formatTypography(subsystem.description)}</p>
        </div>
      ))}
    </div>
  )
}

function FeaturedTradingCard({ project }: { project: TradingProject }) {
  const subsystems = project.bullets.filter(isLabeledBullet)

  return (
    <ContentCard
      icon={iconMap[project.icon]}
      iconColor={project.iconColor}
      title={project.title}
      badges={project.badges}
      articleClassName='col-span-full md:col-span-2'
    >
      <p className={`max-w-3xl text-balance ${CARD_BODY_CLASS}`}>{formatTypography(project.lead)}</p>
      <SubsystemGrid subsystems={subsystems} />
      <TagList>
        {project.tech.map((tech) => (
          <TechTag key={tech}>{formatTypography(tech)}</TechTag>
        ))}
      </TagList>
    </ContentCard>
  )
}

function ProjectCard({ project }: { project: Exclude<Project, TradingProject> }) {
  return (
    <ContentCard
      icon={iconMap[project.icon]}
      iconColor={project.iconColor}
      title={project.title}
      badges={project.badges}
    >
      {'bullets' in project && project.bullets ? <ProjectBullets bullets={project.bullets} /> : null}

      {'demoUrl' in project && project.demoUrl ? (
        <p className={`mt-2.5 ${CARD_BODY_CLASS}`}>
          <a href={project.demoUrl} target='_blank' rel='noopener noreferrer' className={EXTERNAL_LINK_CLASS}>
            <span className={EXTERNAL_LINK_LABEL_CLASS}>Watch Demo Video</span>
            <ExternalLinkIcon />
          </a>
        </p>
      ) : null}

      <TagList>
        {project.tech.map((tech) => (
          <TechTag key={tech}>{formatTypography(tech)}</TechTag>
        ))}
      </TagList>
    </ContentCard>
  )
}

export function FeaturedProjects() {
  const { title, projects } = siteContent.featuredProjects
  const [featured, ...rest] = projects

  return (
    <SectionWrapper id='featured-projects' maxWidth='5xl'>
      <SectionHeader title={title} subtitle='' {...SECTION_STYLES.featuredProjects} />

      <div className='grid items-start gap-6 md:grid-cols-2'>
        <FeaturedTradingCard project={featured} />
        {rest.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </SectionWrapper>
  )
}
