import { describe, expect, it } from 'vitest'

import { PORTFOLIO_SECTIONS, SECTION_IDS, SECTION_SCENES, siteContent } from './content'

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

  it('pins a light scene and an accent tone to every section', () => {
    expect(SECTION_SCENES).toEqual(['hero', 'projects', 'experience', 'contact'])
    expect(new Set(PORTFOLIO_SECTIONS.map((section) => section.tone)).size).toBe(PORTFOLIO_SECTIONS.length)
  })

  it('gives every entry a tone', () => {
    const tones = [
      ...siteContent.featuredProjects.projects.map((project) => project.tone),
      ...siteContent.backgroundExperience.experiences.map((experience) => experience.tone),
      siteContent.backgroundExperience.education.tone,
    ]

    expect(tones).toHaveLength(7)
    expect(tones.every(Boolean)).toBe(true)
  })
})
