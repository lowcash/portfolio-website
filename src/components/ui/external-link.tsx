import type { ReactNode } from 'react'

interface ExternalLinkProps {
  href: string
  children: ReactNode
  lang?: string
  rel?: string
  className?: string
  'aria-label'?: string
}

export function ExternalLink({
  href,
  children,
  lang,
  rel = 'noopener noreferrer',
  className = '',
  ...rest
}: ExternalLinkProps) {
  return (
    <a href={href} target='_blank' rel={rel} lang={lang} className={`link ext ${className}`.trim()} {...rest}>
      {children}
    </a>
  )
}
