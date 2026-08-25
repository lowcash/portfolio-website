interface TagListProps {
  children: React.ReactNode
  stacked?: boolean
  className?: string
}

export function TagList({ children, stacked = false, className = '' }: TagListProps) {
  if (stacked) {
    return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
  }

  return <div className={`mt-3.5 flex flex-wrap gap-1.5 sm:mt-4 ${className}`}>{children}</div>
}
