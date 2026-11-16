'use client'

import type { ReactNode } from 'react'

import { type SectionLinkItem, currentAttribute, isPlainClick } from '@/lib/navigation/section-links'

interface SectionLinkProps {
  item: SectionLinkItem
  currentSection: number
  onSectionClick: (index: number) => void
  className?: string
  children?: ReactNode
}

/** A section anchor: works without JavaScript, with it runs the smooth, locked scroll. Used by every nav surface. */
export function SectionLink({ item, currentSection, onSectionClick, className, children }: SectionLinkProps) {
  return (
    <a
      className={className}
      href={item.href}
      aria-current={currentAttribute(item.index, currentSection)}
      aria-keyshortcuts={item.shortcut}
      onClick={(event) => {
        if (!isPlainClick(event)) return
        event.preventDefault()
        onSectionClick(item.index)
      }}
    >
      {children ?? item.label}
    </a>
  )
}
