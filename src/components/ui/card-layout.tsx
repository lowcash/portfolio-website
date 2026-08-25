import type { CSSProperties, ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

import { formatTypography } from '@/lib/prevent-widows'

import { MetadataBadge } from '@/components/ui/metadata-badge'
import { CARD_SHELL_CLASS, CARD_TITLE_CLASS } from '@/components/ui/card-tokens'

interface ContentCardProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  badges?: readonly string[]
  articleClassName?: string
  fullHeight?: boolean
  style?: CSSProperties
  children: ReactNode
}

/**
 * Single-column card: left-pinned icon with wrapping title/badge cluster,
 * full-width body directly underneath.
 */
export function ContentCard({
  icon: Icon,
  iconColor = 'text-zinc-400',
  title,
  badges = [],
  articleClassName = '',
  fullHeight = false,
  style,
  children,
}: ContentCardProps) {
  return (
    <article
      className={`${CARD_SHELL_CLASS} ${fullHeight ? 'h-full' : ''} ${articleClassName}`}
      style={style}
    >
      <div className={`flex flex-col ${fullHeight ? 'h-full' : ''}`}>
        <div className='mb-3 flex items-start gap-2.5'>
          {Icon ? <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden /> : null}
          <div className='flex min-w-0 flex-wrap items-center gap-2'>
            <h3 className={CARD_TITLE_CLASS}>{formatTypography(title)}</h3>
            {badges.map((badge) => (
              <MetadataBadge key={badge}>{formatTypography(badge)}</MetadataBadge>
            ))}
          </div>
        </div>
        <div className={`flex min-w-0 flex-col ${fullHeight ? 'min-h-0 flex-1' : ''}`}>
          {children}
        </div>
      </div>
    </article>
  )
}

/** @deprecated Prefer `ContentCard`. */
export const TwoColumnCard = ContentCard
