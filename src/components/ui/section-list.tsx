type SectionListWidth = '3xl' | '5xl'

interface SectionListProps {
  children: React.ReactNode
  width?: SectionListWidth
}

const WIDTH_CLASS: Record<SectionListWidth, string> = {
  '3xl': 'max-w-3xl',
  '5xl': 'max-w-5xl',
}

export function SectionList({ children, width = '5xl' }: SectionListProps) {
  return <div className={`mx-auto space-y-3 ${WIDTH_CLASS[width]}`}>{children}</div>
}
