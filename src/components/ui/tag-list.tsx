import type { ReactNode } from 'react'

interface TagListProps {
  children: ReactNode
  stacked?: boolean
}

export function TagList({ children, stacked = false }: TagListProps) {
  if (stacked) {
    return <div className='flex flex-col gap-2'>{children}</div>
  }

  return <div className='flex flex-wrap gap-2 mb-4'>{children}</div>
}
