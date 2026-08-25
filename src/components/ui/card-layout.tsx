import type { CSSProperties, ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

import { CardTitleStack } from '@/components/ui/card-header'

interface TwoColumnCardProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  badges?: readonly string[]
  articleClassName?: string
  titleStackClassName?: string
  titleClassName?: string
  fullHeight?: boolean
  style?: CSSProperties
  children: ReactNode
}

export function TwoColumnCard({
  icon: Icon,
  iconColor = 'text-zinc-400',
  title,
  badges = [],
  articleClassName = '',
  titleStackClassName = '',
  titleClassName,
  fullHeight = false,
  style,
  children,
}: TwoColumnCardProps) {
  return (
    <article
      className={`rounded-2xl p-8 transition-all duration-500 ${fullHeight ? 'h-full' : ''} ${articleClassName}`}
      style={style}
    >
      <div className={`flex items-start gap-4 ${fullHeight ? 'h-full' : ''}`}>
        {Icon ? <Icon className={`mt-0.5 h-10 w-10 shrink-0 ${iconColor}`} aria-hidden /> : null}
        <div className={`flex min-w-0 flex-1 flex-col gap-y-2 ${fullHeight ? 'h-full' : ''}`}>
          <CardTitleStack
            title={title}
            badges={badges}
            className={titleStackClassName}
            titleClassName={titleClassName}
          />
          {children}
        </div>
      </div>
    </article>
  )
}
