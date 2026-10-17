/** Pure helpers for section hashes and scroll behavior (no DOM access, unit tested). */

export function normalizeHash(rawHash: string) {
  const trimmed = rawHash.trim()
  const withoutMarker = trimmed.startsWith('#') ? trimmed.slice(1).trim() : trimmed

  return withoutMarker.length > 0 ? withoutMarker : null
}

/** The first section is the page root, so it clears the hash instead of writing one. */
export function buildSectionUrl(params: {
  pathname: string
  search: string
  sectionId: string
  clearSectionId: string
}) {
  const hash = params.sectionId === params.clearSectionId ? '' : `#${params.sectionId}`

  return `${params.pathname}${params.search}${hash}`
}

export function resolveScrollBehavior(requestedBehavior: ScrollBehavior | undefined, prefersReducedMotion: boolean) {
  const behavior = requestedBehavior ?? 'smooth'

  return behavior === 'smooth' && prefersReducedMotion ? 'auto' : behavior
}
