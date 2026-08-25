interface TagListProps {
  children: React.ReactNode
  stacked?: boolean
  className?: string
}

export function TagList({ children, stacked = false, className = '' }: TagListProps) {
  if (stacked) {
    return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
  }

  return <div className={`mb-4 flex flex-wrap gap-2 ${className}`}>{children}</div>
}
