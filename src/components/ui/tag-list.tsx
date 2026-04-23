interface TagListProps {
  children: React.ReactNode
  stacked?: boolean
}

export function TagList({ children, stacked = false }: TagListProps) {
  if (stacked) {
    return <div className='flex flex-col gap-2'>{children}</div>
  }

  return <div className='mb-4 flex flex-wrap gap-2'>{children}</div>
}
