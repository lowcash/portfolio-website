import type { CSSProperties, ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

import { formatTypography } from '@/lib/prevent-widows'

import { TwoColumnCard } from '@/components/ui/card-layout'

interface CardProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  eyebrow?: string
  badges?: readonly string[]
  description?: string
  bullets?: readonly string[]
  children?: ReactNode
  style?: CSSProperties
  fullHeight?: boolean
}

export function Card({
  icon,
  iconColor = 'text-zinc-400',
  title,
  eyebrow,
  badges = [],
  description,
  bullets,
  children,
  style,
  fullHeight = false,
}: CardProps) {
  const hasFooter = Boolean(children && bullets?.length)

  return (
    <TwoColumnCard
      icon={icon}
      iconColor={iconColor}
      title={title}
      badges={badges}
      fullHeight={fullHeight}
      style={style}
    >
      {eyebrow ? (
        <p className='text-sm font-normal leading-relaxed text-zinc-400'>{formatTypography(eyebrow)}</p>
      ) : null}

      {bullets?.length ? (
        <ul className='list-disc space-y-2 pl-5 text-pretty text-sm font-normal leading-relaxed text-zinc-400'>
          {bullets.map((bullet, index) => (
            <li key={index}>{formatTypography(bullet)}</li>
          ))}
        </ul>
      ) : null}

      {!bullets?.length && description ? (
        <p className='text-sm font-normal leading-relaxed text-zinc-400'>{formatTypography(description)}</p>
      ) : null}

      {children ? <div className={hasFooter ? 'mt-auto pt-2' : undefined}>{children}</div> : null}
    </TwoColumnCard>
  )
}
