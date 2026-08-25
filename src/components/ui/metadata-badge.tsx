import { CARD_BADGE_CLASS } from '@/components/ui/card-tokens'

interface MetadataBadgeProps {
  children: string
}

export function MetadataBadge({ children }: MetadataBadgeProps) {
  return <span className={CARD_BADGE_CLASS}>{children}</span>
}
