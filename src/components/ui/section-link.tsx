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
      className='group inline-flex items-center gap-2 text-sm section-link'
    >
      <ExternalLink className='w-4 h-4' />
      <span>{children}</span>
    </a>
  )
}
