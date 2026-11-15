import { formatTypography } from '@/lib/prevent-widows'

interface SectionHeaderProps {
  /** id of the h2, referenced by the section's aria-labelledby */
  id: string
  /** Two-digit position of the section: 01, 02, ... */
  index: string
  /** Short descriptor above the title, e.g. "Selected work" */
  eyebrow: string
  title: string
  /** Derived count facts, e.g. ["4 entries"], laid out as one gapped row */
  meta?: readonly string[]
}

/** Section head: hairline rule, index, eyebrow, title and an optional count. */
export function SectionHeader({ id, index, eyebrow, title, meta }: SectionHeaderProps) {
  return (
    <header className='sec-head rule wrap grid-12'>
      <p className='idx l-rail mono'>{index}</p>
      <div className='sec-title'>
        <p className='eyebrow mono caps'>{eyebrow}</p>
        <h2 id={id}>{formatTypography(title)}</h2>
      </div>
      {meta ? (
        <p className='meta mono'>
          {meta.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </p>
      ) : null}
    </header>
  )
}
