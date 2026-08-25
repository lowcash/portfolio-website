import {
  buildSectionUrl,
  createSectionRegistry,
  normalizeHash,
  resolveScrollBehavior,
  shouldWriteSectionUrl,
} from '../../packages/navigation-core'
import type { HashWriteMode, ScrollTargetOptions } from '../../packages/navigation-core'

export { resolveActiveSectionIndex } from './scroll-spy'

function getCurrentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function isIndexInRange(index: number, sectionIds: readonly string[]) {
  return index >= 0 && index < sectionIds.length
}

function getSectionRegistry(sectionIds: readonly string[]) {
  return createSectionRegistry({ sectionIds })
}

export function resolveHashSectionIndex(sectionIds: readonly string[]) {
  const hashSectionId = normalizeHash(window.location.hash)
  if (!hashSectionId) {
    return null
  }

  const sectionRegistry = getSectionRegistry(sectionIds)
  const parsedSectionId = sectionRegistry.parseSectionId(hashSectionId)
  if (!parsedSectionId) {
    return null
  }

  return sectionIds.indexOf(parsedSectionId)
}

export function setSectionHashByIndex(sectionIds: readonly string[], index: number, mode: HashWriteMode = 'replace') {
  if (!isIndexInRange(index, sectionIds)) {
    return false
  }

  const nextUrl = buildSectionUrl({
    pathname: window.location.pathname,
    search: window.location.search,
    sectionId: sectionIds[index],
    clearSectionId: sectionIds[0] ?? '',
  })

  if (!shouldWriteSectionUrl(getCurrentUrl(), nextUrl)) {
    return true
  }

  if (mode === 'push') {
    window.history.pushState(null, '', nextUrl)
  } else {
    window.history.replaceState(null, '', nextUrl)
  }

  return true
}

export function scrollToSectionByIndex(
  sectionIds: readonly string[],
  index: number,
  options: ScrollTargetOptions = {},
) {
  if (!isIndexInRange(index, sectionIds)) {
    return false
  }

  const sectionId = sectionIds[index]
  const element = document.getElementById(sectionId)
  if (!element) {
    return false
  }

  const behavior = resolveScrollBehavior(
    options.behavior,
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const shouldUpdateHash = options.updateHash ?? true

  element.scrollIntoView({ behavior, block: 'start' })

  if (shouldUpdateHash) {
    setSectionHashByIndex(sectionIds, index)
  }

  return true
}
