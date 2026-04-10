import {
  buildSectionBoundaries,
  buildSectionUrl,
  computeNearestSection,
  createSectionRegistry,
  normalizeHash,
  resolveScrollBehavior,
  shouldWriteSectionUrl,
} from '../../packages/navigation-core'
import type { HashWriteMode, ScrollTargetOptions } from '../../packages/navigation-core'

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
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  if (isIOS) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({
      top: elementPosition,
      behavior,
    })
  } else {
    element.scrollIntoView({ behavior, block: 'start' })
  }

  if (shouldUpdateHash) {
    setSectionHashByIndex(sectionIds, index)
  }

  return true
}

export function resolveActiveSectionIndex(sectionIds: readonly string[]) {
  const boundaries = buildSectionBoundaries({
    sectionIds,
    resolveOffsetTop: (sectionId) => {
      const section = document.getElementById(sectionId)
      if (!section) {
        return null
      }

      const rect = section.getBoundingClientRect()
      return rect.top + window.scrollY + rect.height / 2
    },
  })

  const activeSectionId = computeNearestSection({
    scrollY: window.scrollY,
    sections: boundaries,
    offset: window.innerHeight / 2,
  })

  if (!activeSectionId) {
    return 0
  }

  const activeSectionIndex = sectionIds.indexOf(activeSectionId)
  return activeSectionIndex >= 0 ? activeSectionIndex : 0
}
