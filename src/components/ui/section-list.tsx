import type { ReactNode } from 'react'

type SectionListWidth = '3xl' | '5xl'

interface SectionListProps {
  children: ReactNode
  width?: SectionListWidth
  centered?: boolean
}

const WIDTH_CLASS: Record<SectionListWidth, string> = {
  '3xl': 'max-w-3xl',
  '5xl': 'max-w-5xl',
}

export function SectionList({ children, width = '5xl', centered = true }: SectionListProps) {
  return <div className={`space-y-3 ${WIDTH_CLASS[width]} ${centered ? 'mx-auto' : ''}`}>{children}</div>
}
