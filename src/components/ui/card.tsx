import type { CSSProperties, ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

import { formatTypography } from '@/lib/prevent-widows'

import { ContentCard } from '@/components/ui/card-layout'
import { CARD_BODY_CLASS } from '@/components/ui/card-tokens'

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
  return (
    <ContentCard
      icon={icon}
      iconColor={iconColor}
      title={title}
      badges={badges}
      fullHeight={fullHeight}
      style={style}
    >
      {eyebrow ? <p className={CARD_BODY_CLASS}>{formatTypography(eyebrow)}</p> : null}

      {bullets?.length ? (
        <ul className={`list-disc space-y-2 pl-5 ${CARD_BODY_CLASS}`}>
          {bullets.map((bullet, index) => (
            <li key={index}>{formatTypography(bullet)}</li>
          ))}
        </ul>
      ) : null}

      {!bullets?.length && description ? (
        <p className={CARD_BODY_CLASS}>{formatTypography(description)}</p>
      ) : null}

      {children}
    </ContentCard>
  )
}
