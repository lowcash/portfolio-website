type TextTone = 'default' | 'muted'
type TextSize = 'sm' | 'base' | 'lg'

interface TextProps {
  children: React.ReactNode
  tone?: TextTone
  size?: TextSize
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

export function Text({ children, tone = 'default', size = 'base' }: TextProps) {
  return <p className={`${TEXT_TONE_CLASS[tone]} ${TEXT_SIZE_CLASS[size]}`}>{children}</p>
}
