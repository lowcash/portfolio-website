const VIEWPORT_MARKER_RATIO = 0.45
const TOP_SCROLL_THRESHOLD = 100
const BOTTOM_EPSILON = 50

function resolveScrollY(): number {
  const body = document.body

  if (body.style.position === 'fixed' && body.style.top) {
    return Math.abs(Number.parseInt(body.style.top, 10)) || 0
  }

  return window.scrollY
}

/**
 * Resolve the active section index from scroll position.
 * Uses a viewport marker at 45% height with top/bottom boundary clamps.
 */
export function resolveActiveSectionIndex(sectionIds: readonly string[]): number {
  if (sectionIds.length === 0) {
    return 0
  }

  const scrollY = resolveScrollY()
  const innerHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  if (scrollY < TOP_SCROLL_THRESHOLD) {
    return 0
  }

  if (innerHeight + scrollY >= documentHeight - BOTTOM_EPSILON) {
    return sectionIds.length - 1
  }

  const marker = innerHeight * VIEWPORT_MARKER_RATIO

  for (let index = 0; index < sectionIds.length; index++) {
    const element = document.getElementById(sectionIds[index])
    if (!element) {
      continue
    }

    const rect = element.getBoundingClientRect()
    if (rect.top <= marker && rect.bottom >= marker) {
      return index
    }
  }

  for (let index = sectionIds.length - 1; index >= 0; index--) {
    const element = document.getElementById(sectionIds[index])
    if (!element) {
      continue
    }

    if (element.getBoundingClientRect().top <= marker) {
      return index
    }
  }

  return 0
}
