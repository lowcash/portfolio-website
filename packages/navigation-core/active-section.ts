import type { ComputeActiveSectionInput, ComputeNearestSectionInput, SectionBoundary } from './types'

type IndexedBoundary = SectionBoundary & {
  index: number
}

function toIndexedBoundaries(sections: SectionBoundary[]) {
  return sections
    .map((section, index) => ({ ...section, index }))
    .sort((left, right) => {
      if (left.offsetTop !== right.offsetTop) {
        return left.offsetTop - right.offsetTop
      }

      return left.index - right.index
    })
}

function getFirstByOffset(boundaries: IndexedBoundary[], offsetTop: number) {
  const sameOffsetBoundaries = boundaries.filter((boundary) => boundary.offsetTop === offsetTop)
  if (sameOffsetBoundaries.length === 0) {
    return null
  }

  return sameOffsetBoundaries[0]
}

function getBottomSection(boundaries: IndexedBoundary[]) {
  if (boundaries.length === 0) {
    return null
  }

  const maxOffset = boundaries[boundaries.length - 1].offsetTop
  return getFirstByOffset(boundaries, maxOffset)
}

export function computeActiveSection({
  scrollY,
  sections,
  offset,
  innerHeight,
  documentHeight,
  bottomEpsilon = 2,
}: ComputeActiveSectionInput) {
  const boundaries = toIndexedBoundaries(sections)

  if (boundaries.length === 0) {
    return null
  }

  if (
    typeof innerHeight === 'number' &&
    typeof documentHeight === 'number' &&
    innerHeight + scrollY >= documentHeight - bottomEpsilon
  ) {
    return getBottomSection(boundaries)?.id ?? null
  }

  const marker = scrollY + offset
  let candidateOffset: number | null = null

  for (let index = boundaries.length - 1; index >= 0; index -= 1) {
    if (boundaries[index].offsetTop <= marker) {
      candidateOffset = boundaries[index].offsetTop
      break
    }
  }

  if (candidateOffset === null) {
    return null
  }

  return getFirstByOffset(boundaries, candidateOffset)?.id ?? null
}

export function computeNearestSection({ scrollY, sections, offset }: ComputeNearestSectionInput) {
  const boundaries = toIndexedBoundaries(sections)

  if (boundaries.length === 0) {
    return null
  }

  const marker = scrollY + offset
  let nearestBoundary = boundaries[0]
  let nearestDistance = Math.abs(nearestBoundary.offsetTop - marker)

  for (let index = 1; index < boundaries.length; index += 1) {
    const distance = Math.abs(boundaries[index].offsetTop - marker)

    if (distance < nearestDistance) {
      nearestBoundary = boundaries[index]
      nearestDistance = distance
      continue
    }

    if (distance === nearestDistance && boundaries[index].index < nearestBoundary.index) {
      nearestBoundary = boundaries[index]
    }
  }

  return nearestBoundary.id
}
