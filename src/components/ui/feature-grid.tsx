import type { ReactNode } from 'react'

interface FeatureGridProps {
  children: ReactNode
  columns?: 1 | 2
}

export function FeatureGrid({ children, columns = 2 }: FeatureGridProps) {
  return <div className={columns === 2 ? 'grid md:grid-cols-2 gap-3' : 'grid gap-3'}>{children}</div>
}
