import { describe, expect, it } from 'vitest'

import { PORTFOLIO_SECTIONS, SECTION_IDS, siteContent } from './content'

describe('section config single source of truth', () => {
  it('exposes four portfolio sections with unique ids', () => {
    expect(PORTFOLIO_SECTIONS).toHaveLength(4)
    expect(new Set(SECTION_IDS).size).toBe(SECTION_IDS.length)
  })

  it('keeps navigation sections aligned with PORTFOLIO_SECTIONS', () => {
    expect(siteContent.navigation.sections.map((section) => section.id)).toEqual([...SECTION_IDS])
    expect(siteContent.navigation.sections.map((section) => section.name)).toEqual(
      PORTFOLIO_SECTIONS.map((section) => section.name),
    )
  })

  it('marks only contact as centered', () => {
    const centered = PORTFOLIO_SECTIONS.filter((section) => section.centered).map((section) => section.id)
    expect(centered).toEqual(['contact'])
  })
})
