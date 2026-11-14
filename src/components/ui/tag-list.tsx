interface TagListProps {
  children: React.ReactNode
  className?: string
}

export function TagList({ children, className = '' }: TagListProps) {
  return <div className={`mt-3.5 flex flex-wrap gap-1.5 sm:mt-4 ${className}`}>{children}</div>
}
