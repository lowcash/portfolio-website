export function normalizeHash(rawHash: string) {
  const cleanedHash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash
  const trimmedHash = cleanedHash.trim()

  return trimmedHash.length > 0 ? trimmedHash : null
}

export function hashForSection(sectionId: string, clearSectionId: string) {
  return sectionId === clearSectionId ? '' : `#${sectionId}`
}

export function buildSectionUrl(params: {
  pathname: string
  search: string
  sectionId: string
  clearSectionId: string
}) {
  const nextHash = hashForSection(params.sectionId, params.clearSectionId)
  return `${params.pathname}${params.search}${nextHash}`
}

export function shouldWriteSectionUrl(currentUrl: string, nextUrl: string) {
  return currentUrl !== nextUrl
}
