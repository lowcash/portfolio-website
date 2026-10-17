import { buildSectionUrl, normalizeHash, resolveScrollBehavior } from './section-url'

export { resolveActiveSectionIndex } from './scroll-spy'
export { useActiveSection } from './use-active-section'

type HashWriteMode = 'replace' | 'push'

type ScrollTargetOptions = {
  behavior?: ScrollBehavior
  updateHash?: boolean
}

const isIndexInRange = (index: number, sectionIds: readonly string[]) => index >= 0 && index < sectionIds.length

/** Index of the section named by the current URL hash, or null when there is none (or it is unknown). */
export function resolveHashSectionIndex(sectionIds: readonly string[]) {
  const hashSectionId = normalizeHash(window.location.hash)
  const index = hashSectionId ? sectionIds.indexOf(hashSectionId) : -1

  return index === -1 ? null : index
}

export function setSectionHashByIndex(sectionIds: readonly string[], index: number, mode: HashWriteMode = 'replace') {
  if (!isIndexInRange(index, sectionIds)) {
    return false
  }

  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const nextUrl = buildSectionUrl({
    pathname: window.location.pathname,
    search: window.location.search,
    sectionId: sectionIds[index],
    clearSectionId: sectionIds[0] ?? '',
  })

  if (currentUrl !== nextUrl) {
    window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', nextUrl)
  }

  return true
}

export function scrollToSectionByIndex(
  sectionIds: readonly string[],
  index: number,
  { behavior, updateHash = true }: ScrollTargetOptions = {},
) {
  const element = isIndexInRange(index, sectionIds) ? document.getElementById(sectionIds[index]) : null

  if (!element) {
    return false
  }

  element.scrollIntoView({
    behavior: resolveScrollBehavior(behavior, window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    block: 'start',
  })

  if (updateHash) {
    setSectionHashByIndex(sectionIds, index)
  }

  return true
}
