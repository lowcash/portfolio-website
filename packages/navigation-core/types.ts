export type HashWriteMode = 'replace' | 'push'

export type OffsetResolverContext = {
  viewportWidth: number
  viewportHeight: number
}

export type OffsetStrategy = number | ((context: OffsetResolverContext) => number)

export type SectionBoundary = {
  id: string
  offsetTop: number
}

export type ComputeActiveSectionInput = {
  scrollY: number
  sections: SectionBoundary[]
  offset: number
  innerHeight?: number
  documentHeight?: number
  bottomEpsilon?: number
}

export type ComputeNearestSectionInput = {
  scrollY: number
  sections: SectionBoundary[]
  offset: number
}

export type ScrollTargetOptions = {
  behavior?: ScrollBehavior
  updateHash?: boolean
}

export type SectionRegistryConfig<SectionId extends string> = {
  sectionIds: readonly SectionId[]
}
