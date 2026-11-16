/** Keyboard shortcuts of the status line: D toggles the console, 0-3 jump to a section, Esc closes the console. */

export type ShortcutAction = { type: 'console' } | { type: 'section'; index: number } | { type: 'escape' }

type KeyLike = {
  key: string
  metaKey: boolean
  ctrlKey: boolean
  altKey: boolean
  target: unknown
}

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

function isEditableTarget(target: unknown) {
  const element = target as { tagName?: string; isContentEditable?: boolean } | null

  return Boolean(element && (element.isContentEditable || (element.tagName && EDITABLE_TAGS.has(element.tagName))))
}

export function resolveShortcut(event: KeyLike, sectionCount: number): ShortcutAction | null {
  if (event.metaKey || event.ctrlKey || event.altKey || isEditableTarget(event.target)) {
    return null
  }

  if (event.key === 'd' || event.key === 'D') {
    return { type: 'console' }
  }

  if (event.key === 'Escape') {
    return { type: 'escape' }
  }

  if (/^\d$/.test(event.key) && Number(event.key) < sectionCount) {
    return { type: 'section', index: Number(event.key) }
  }

  return null
}
