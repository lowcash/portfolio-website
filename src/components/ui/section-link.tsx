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
      <ExternalLink className='h-4 w-4' />
      <span>{children}</span>
    </a>
  )
}
