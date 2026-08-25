import { describe, expect, it } from 'vitest'

import { formatTypography } from '@/lib/prevent-widows'

describe('formatTypography', () => {
  it('binds short prepositions and conjunctions so they cannot end a line', () => {
    const result = formatTypography(
      'platform for yacht clearance, and client interface for a private studio.',
    )
    expect(result).toContain('for\u00A0yacht')
    expect(result).toContain('and\u00A0client')
    expect(result).toContain('for\u00A0a\u00A0private')
  })

  it('protects date ranges and keeps them with the preceding word', () => {
    expect(formatTypography('(2017 – 2020)')).toBe('(2017\u00A0\u2013\u00A02020)')
    expect(formatTypography('(2013 - 2017)')).toBe('(2013\u00A0\u2013\u00A02017)')
    expect(formatTypography('Augmented Reality (2017 – 2020)')).toBe(
      'Augmented Reality\u00A0(2017\u00A0\u2013\u00A02020)',
    )
    expect(formatTypography('Game Development (2013 - 2017)')).toBe(
      'Game Development\u00A0(2013\u00A0\u2013\u00A02017)',
    )
  })

  it('keeps degree tails with years on one row', () => {
    expect(formatTypography('Computer Graphics & Augmented Reality (2017 – 2020)')).toBe(
      'Computer Graphics &\u00A0Augmented\u00A0Reality\u00A0(2017\u00A0\u2013\u00A02020)',
    )
    expect(formatTypography('Computer Graphics & Game Development (2013 - 2017)')).toBe(
      'Computer Graphics &\u00A0Game\u00A0Development\u00A0(2013\u00A0\u2013\u00A02017)',
    )
  })

  it('replaces hyphens in compound words with non-breaking hyphens', () => {
    expect(formatTypography('event-driven')).toBe('event\u2011driven')
    expect(formatTypography('walk-forward')).toBe('walk\u2011forward')
  })

  it('binds DJ and console phrases', () => {
    expect(formatTypography('mix drum & bass sets as Lowcash')).toContain('drum\u00A0&\u00A0bass')
    expect(formatTypography('mix drum & bass sets as Lowcash')).toContain('as\u00A0Lowcash')
    expect(formatTypography('open Interactive Dev Console')).toContain('Interactive\u00A0Dev\u00A0Console')
  })
})
