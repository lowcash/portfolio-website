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
      className={`rounded-2xl p-8 transition-all duration-500 flex flex-col ${fullHeight ? 'h-full' : ''}`}
      style={style}
    >
      <div className='flex items-start gap-4 mb-4'>
        {Icon && <Icon className={`w-10 h-10 ${iconColor} shrink-0`} />}
        <div className='grow'>
          <h3 className='text-xl mb-1 text-white'>{title}</h3>
          {eyebrow && <p className='text-lg text-gray-300 mb-1'>{eyebrow}</p>}
          {subtitle && <span className='text-sm text-gray-500'>{subtitle}</span>}
        </div>
      </div>
      <p className={`text-gray-400 ${children ? 'mb-6' : ''}`}>{description}</p>
      {children}
    </article>
  )
}
