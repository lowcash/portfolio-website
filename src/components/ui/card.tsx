import type { CSSProperties, ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'

interface CardProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  eyebrow?: string
  subtitle?: string
  description: string
  children?: ReactNode
  style?: CSSProperties
  fullHeight?: boolean
}

export function Card({
  icon: Icon,
  iconColor = 'text-gray-400',
  title,
  eyebrow,
  subtitle,
  description,
  children,
  style,
  fullHeight = false,
}: CardProps) {
  return (
    <article
      className={`flex flex-col rounded-2xl p-8 transition-all duration-500 ${fullHeight ? 'h-full' : ''}`}
      style={style}
    >
      <div className='mb-4 flex items-start gap-4'>
        {Icon && <Icon className={`h-10 w-10 ${iconColor} shrink-0`} />}
        <div className='grow'>
          <h3 className='mb-1 text-xl text-white'>{title}</h3>
          {eyebrow && <p className='mb-1 text-lg text-gray-300'>{eyebrow}</p>}
          {subtitle && <span className='text-sm text-gray-400'>{subtitle}</span>}
        </div>
      </div>
      <p className={`text-gray-400 ${children ? 'mb-6' : ''}`}>{description}</p>
      {children}
    </article>
  )
}
