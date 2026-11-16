import { PORTFOLIO_SECTIONS } from '@/lib/content'

/** The single source of truth for section navigation: label, target, position and the 0-3 shortcut key. */
export const SECTION_LINKS = PORTFOLIO_SECTIONS.map((section, index) => ({
  index,
  id: section.id,
  label: section.name,
  href: `#${section.id}`,
  shortcut: String(index),
}))

export type SectionLinkItem = (typeof SECTION_LINKS)[number]

/** `aria-current` value of a link: `location` for the active section, nothing otherwise. */
export const currentAttribute = (index: number, currentSection: number) =>
  index === currentSection ? ('location' as const) : undefined

/** Plain clicks are intercepted for the smooth, locked scroll; modified clicks keep the browser's behaviour. */
export const isPlainClick = (event: {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  button: number
}) => !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
