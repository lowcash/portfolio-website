import { formatTypography } from '@/lib/prevent-widows'

interface SectionHeaderProps {
  /** id of the h2, referenced by the section's aria-labelledby */
  id: string
  /** Two-digit position of the section: 01, 02, ... */
  index: string
  title: string
  /** Derived count line, e.g. "4 entries" */
  meta?: string
}

/** Section head: hairline rule, index, title and an optional count. */
export function SectionHeader({ id, index, title, meta }: SectionHeaderProps) {
  return (
    <header className='sec-head rule wrap grid-12'>
      <p className='idx mono'>{index}</p>
      <h2 id={id}>{formatTypography(title)}</h2>
      {meta ? <p className='meta mono'>{meta}</p> : null}
    </header>
  )
}
