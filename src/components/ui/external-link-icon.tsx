import { ExternalLink } from 'lucide-react'

export function ExternalLinkIcon({ className = '' }: { className?: string }) {
  const hasSize = /\b[hw]-/.test(className)
  const hasMargin = className.includes('ml-')
  const hasTextColor = className.includes('text-')

  return (
    <ExternalLink
      aria-hidden='true'
      className={[
        'relative -top-px shrink-0 transition-colors duration-150 group-hover:text-white',
        hasTextColor ? '' : 'text-zinc-300',
        hasSize ? '' : 'h-3.5 w-3.5',
        hasMargin ? className : `ml-1.5 ${className}`,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
