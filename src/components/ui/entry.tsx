import type { ReactNode } from 'react'

import type { Tone } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

// Full class names so Tailwind sees every tone utility
const TONE_CLASS: Record<Tone, string> = {
  pink: 'tone tone-pink',
  violet: 'tone tone-violet',
  teal: 'tone tone-teal',
  fuchsia: 'tone tone-fuchsia',
  mint: 'tone tone-mint',
  sky: 'tone tone-sky',
  amber: 'tone tone-amber',
}

interface EntryProps {
  /** Ledger number, e.g. "1.1" */
  num: string
  badge: string
  tone: Tone
  title: string
  /** The lead entry runs its title wide and lays the pipeline out left to right */
  lead?: boolean
  /** Extra content under the title in the title block */
  main?: ReactNode
  children: ReactNode
}

/** One ledger row. Identical grammar for projects, roles and education. */
export function Entry({ num, badge, tone, title, lead = false, main, children }: EntryProps) {
  return (
    <article className={`entry grid-12 reveal ${lead ? 'entry--lead' : ''} ${TONE_CLASS[tone]}`}>
      <p className='e-idx l-rail mono'>
        <span className='num'>{num}</span>
        <span className='badge caps'>{formatTypography(badge)}</span>
      </p>
      <div className='e-main l-col l-main'>
        <h3>{formatTypography(title)}</h3>
        {main}
      </div>
      <div className='e-detail l-col l-detail'>{children}</div>
    </article>
  )
}

export function TechList({ items, className = '' }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`tags mono ${className}`.trim()}>
      {items.map((item) => (
        <li key={item}>{formatTypography(item)}</li>
      ))}
    </ul>
  )
}
