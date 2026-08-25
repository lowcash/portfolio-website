import { CARD_TECH_PILL_CLASS } from '@/components/ui/card-tokens'

interface TechTagProps {
  children: string
}

export function TechTag({ children }: TechTagProps) {
  return <span className={CARD_TECH_PILL_CLASS}>{children}</span>
}
