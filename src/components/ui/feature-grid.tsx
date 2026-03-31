interface FeatureGridProps {
  children: React.ReactNode
  columns?: 1 | 2
}

export function FeatureGrid({ children, columns = 2 }: FeatureGridProps) {
  return <div className={columns === 2 ? 'grid gap-3 md:grid-cols-2' : 'grid gap-3'}>{children}</div>
}
