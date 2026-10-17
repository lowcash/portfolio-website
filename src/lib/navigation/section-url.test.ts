import { describe, expect, it } from 'vitest'

import { buildSectionUrl, normalizeHash, resolveScrollBehavior } from './section-url'

describe('normalizeHash', () => {
  it('strips the leading # and whitespace', () => {
    expect(normalizeHash('#contact')).toBe('contact')
    expect(normalizeHash('  #contact ')).toBe('contact')
    expect(normalizeHash('contact')).toBe('contact')
  })

  it('returns null for empty hashes', () => {
    expect(normalizeHash('')).toBeNull()
    expect(normalizeHash('#')).toBeNull()
    expect(normalizeHash('#   ')).toBeNull()
  })
})

describe('buildSectionUrl', () => {
  const base = { pathname: '/', search: '?ref=cv', clearSectionId: 'hero' }

  it('keeps the query string and appends the section hash', () => {
    expect(buildSectionUrl({ ...base, sectionId: 'contact' })).toBe('/?ref=cv#contact')
  })

  it('clears the hash for the first section', () => {
    expect(buildSectionUrl({ ...base, sectionId: 'hero' })).toBe('/?ref=cv')
  })
})

describe('resolveScrollBehavior', () => {
  it('defaults to smooth', () => {
    expect(resolveScrollBehavior(undefined, false)).toBe('smooth')
  })

  it('downgrades smooth to auto for reduced motion only', () => {
    expect(resolveScrollBehavior('smooth', true)).toBe('auto')
    expect(resolveScrollBehavior('auto', true)).toBe('auto')
    expect(resolveScrollBehavior('instant', true)).toBe('instant')
  })
})
