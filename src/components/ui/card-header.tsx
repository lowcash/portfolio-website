import { formatTypography } from '@/lib/prevent-widows'

import { CARD_TITLE_CLASS } from '@/components/ui/card-tokens'
import { MetadataBadge } from '@/components/ui/metadata-badge'

interface CardTitleStackProps {
  title: string
  badges?: readonly string[]
  className?: string
}

/** Title + badge cluster that wraps beside a left-pinned icon. */
export function CardTitleStack({ title, badges = [], className = '' }: CardTitleStackProps) {
  return (
    <div className={`flex min-w-0 flex-wrap items-center gap-2 ${className}`}>
      <h3 className={CARD_TITLE_CLASS}>{formatTypography(title)}</h3>
      {badges.map((badge) => (
        <MetadataBadge key={badge}>{formatTypography(badge)}</MetadataBadge>
      ))}
    </div>
  )
}
