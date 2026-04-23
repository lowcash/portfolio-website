import type { CSSProperties, ComponentType } from 'react'

import { Text } from './typography'

type IconTone = 'yellow' | 'amber' | 'cyan' | 'emerald'

interface FeatureCardProps {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  iconTone?: IconTone
  animationStyle?: CSSProperties
}

const ICON_TONE_CLASS: Record<IconTone, string> = {
  yellow: 'text-yellow-400',
  amber: 'text-amber-400',
  cyan: 'text-cyan-400',
  emerald: 'text-emerald-400',
}

export function FeatureCard({ icon: Icon, title, description, iconTone = 'yellow', animationStyle }: FeatureCardProps) {
  return (
    <article className='rounded-2xl p-8 transition-all duration-500' style={animationStyle}>
      <div className='flex items-start gap-4'>
        <Icon className={`h-10 w-10 ${ICON_TONE_CLASS[iconTone]} shrink-0`} />
        <div className='grow'>
          <h3 className='mb-1 text-2xl text-white'>{title}</h3>
          <Text tone='muted'>{description}</Text>
        </div>
      </div>
    </article>
  )
}
