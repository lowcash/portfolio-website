import { ExternalLink } from 'lucide-react'

interface SectionLinkProps {
  href: string
  children: React.ReactNode
}

export function SectionLink({ href, children }: SectionLinkProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='group section-link inline-flex items-center gap-2 text-sm'
    >
      <ExternalLink size={13} className='shrink-0' aria-hidden='true' />
      <span>{children}</span>
    </a>
  )
}
