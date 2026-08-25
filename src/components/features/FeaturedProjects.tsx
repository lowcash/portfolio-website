import { Eye, Globe, type LucideIcon, TrendingUp } from 'lucide-react'

import { type FeaturedProjectIconKey, siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'
import { SECTION_STYLES } from '@/lib/section-config'

import { CardTitleStack } from '@/components/ui/card-header'
import { TwoColumnCard } from '@/components/ui/card-layout'
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

const PROJECT_BODY_CLASS = 'text-pretty text-sm font-normal leading-relaxed text-zinc-400'
const EXTERNAL_LINK_CLASS =
  'group inline-flex items-center text-zinc-300 transition-colors duration-150 hover:text-white'
const EXTERNAL_LINK_LABEL_CLASS = 'font-medium transition-colors duration-150'
const COMPACT_TITLE_STACK_CLASS = 'md:flex-nowrap md:gap-2.5'
const COMPACT_TITLE_CLASS =
  'font-sans text-base font-semibold text-balance text-zinc-100 md:whitespace-nowrap'

function isLinkedBullet(
  bullet: ProjectBullet,
): bullet is Extract<ProjectBullet, { url: string }> {
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
      <p className='text-xs leading-relaxed text-zinc-400'>{formatTypography(description)}</p>
    </li>
  )
}

function ProjectBullets({ bullets }: { bullets: readonly ProjectBullet[] }) {
  return (
    <ul className={`list-disc space-y-3 pl-5 ${PROJECT_BODY_CLASS}`}>
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
            <ClientProjectItem
              key={bullet.url}
              title={bullet.name}
              url={bullet.url}
              description={bullet.description}
            />
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
    <div className='my-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
      {subsystems.map((subsystem) => (
        <div key={subsystem.label} className='min-w-0'>
          <h4 className='font-mono text-xs tracking-wider text-zinc-300 uppercase'>{subsystem.label}</h4>
          <p className='mt-1.5 text-xs font-normal text-zinc-400'>{formatTypography(subsystem.description)}</p>
        </div>
      ))}
    </div>
  )
}

function FeaturedTradingCard({ project }: { project: TradingProject }) {
  const Icon = iconMap[project.icon]
  const subsystems = project.bullets.filter(isLabeledBullet)

  return (
    <article className='col-span-full rounded-2xl p-8 transition-all duration-500 md:col-span-2'>
      <div className='flex flex-col gap-y-4'>
        <div className='flex items-start gap-4'>
          <Icon className={`mt-0.5 h-10 w-10 shrink-0 ${project.iconColor}`} aria-hidden />
          <CardTitleStack title={project.title} badges={project.badges} />
        </div>

        <p className={`max-w-3xl text-balance ${PROJECT_BODY_CLASS}`}>{formatTypography(project.lead)}</p>

        <SubsystemGrid subsystems={subsystems} />

        <TagList className='mb-0'>
          {project.tech.map((tech) => (
            <TechTag key={tech}>{formatTypography(tech)}</TechTag>
          ))}
        </TagList>
      </div>
    </article>
  )
}

function ProjectCard({ project }: { project: Exclude<Project, TradingProject> }) {
  return (
    <TwoColumnCard
      icon={iconMap[project.icon]}
      iconColor={project.iconColor}
      title={project.title}
      badges={project.badges}
      titleStackClassName={COMPACT_TITLE_STACK_CLASS}
      titleClassName={COMPACT_TITLE_CLASS}
    >
      <div className='flex flex-col gap-y-4'>
        {'bullets' in project && project.bullets ? <ProjectBullets bullets={project.bullets} /> : null}

        {'demoUrl' in project && project.demoUrl ? (
          <p className={PROJECT_BODY_CLASS}>
            <a href={project.demoUrl} target='_blank' rel='noopener noreferrer' className={EXTERNAL_LINK_CLASS}>
              <span className={EXTERNAL_LINK_LABEL_CLASS}>Watch Demo Video</span>
              <ExternalLinkIcon />
            </a>
          </p>
        ) : null}

        <TagList className='mb-0'>
          {project.tech.map((tech) => (
            <TechTag key={tech}>{formatTypography(tech)}</TechTag>
          ))}
        </TagList>
      </div>
    </TwoColumnCard>
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
