import type { ReactNode } from 'react'

type HeadingLevel = 1 | 2 | 3
type TextTone = 'default' | 'muted'
type TextSize = 'sm' | 'base' | 'lg'

interface HeadingProps {
  children: ReactNode
  level?: HeadingLevel
}

interface TextProps {
  children: ReactNode
  tone?: TextTone
  size?: TextSize
}

const HEADING_CLASS: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl text-white font-semibold',
  2: 'text-3xl md:text-4xl text-white font-semibold',
  3: 'text-2xl text-white',
}

const TEXT_TONE_CLASS: Record<TextTone, string> = {
  default: 'text-white',
  muted: 'text-gray-400',
}

const TEXT_SIZE_CLASS: Record<TextSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
}

// Heading is unused but kept for consistency in the typography module
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Heading({ children, level = 3 }: HeadingProps) {
  if (level === 1) return <h1 className={HEADING_CLASS[1]}>{children}</h1>
  if (level === 2) return <h2 className={HEADING_CLASS[2]}>{children}</h2>
  return <h3 className={HEADING_CLASS[3]}>{children}</h3>
}

export function Text({ children, tone = 'default', size = 'base' }: TextProps) {
  return <p className={`${TEXT_TONE_CLASS[tone]} ${TEXT_SIZE_CLASS[size]}`}>{children}</p>
}
