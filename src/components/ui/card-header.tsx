import { formatTypography } from '@/lib/prevent-widows'

import { MetadataBadge } from '@/components/ui/metadata-badge'

interface CardTitleStackProps {
  title: string
  badges?: readonly string[]
  className?: string
  titleClassName?: string
}

const DEFAULT_TITLE_CLASS =
  'font-sans text-lg font-semibold text-balance text-zinc-100 sm:text-xl'

export function CardTitleStack({ title, badges = [], className = '', titleClassName }: CardTitleStackProps) {
  return (
    <div className={`inline-flex max-w-full flex-wrap items-center gap-2.5 ${className}`}>
      <h3 className={titleClassName || DEFAULT_TITLE_CLASS}>{formatTypography(title)}</h3>
      {badges.map((badge) => (
        <MetadataBadge key={badge}>{formatTypography(badge)}</MetadataBadge>
      ))}
    </div>
  )
}
