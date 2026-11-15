import { describe, expect, it } from 'vitest'

import { resolveShortcut } from './shortcuts'

const key = (value: string, extra: Partial<Parameters<typeof resolveShortcut>[0]> = {}) => ({
  key: value,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  target: { tagName: 'BODY' },
  ...extra,
})

describe('resolveShortcut', () => {
  it('maps D, digits and Escape', () => {
    expect(resolveShortcut(key('d'), 4)).toEqual({ type: 'console' })
    expect(resolveShortcut(key('D'), 4)).toEqual({ type: 'console' })
    expect(resolveShortcut(key('2'), 4)).toEqual({ type: 'section', index: 2 })
    expect(resolveShortcut(key('Escape'), 4)).toEqual({ type: 'escape' })
  })

  it('ignores digits beyond the section count and unknown keys', () => {
    expect(resolveShortcut(key('4'), 4)).toBeNull()
    expect(resolveShortcut(key('x'), 4)).toBeNull()
  })

  it('ignores modifier combinations', () => {
    expect(resolveShortcut(key('d', { metaKey: true }), 4)).toBeNull()
    expect(resolveShortcut(key('d', { ctrlKey: true }), 4)).toBeNull()
    expect(resolveShortcut(key('1', { altKey: true }), 4)).toBeNull()
  })

  it('ignores editable targets', () => {
    expect(resolveShortcut(key('d', { target: { tagName: 'INPUT' } }), 4)).toBeNull()
    expect(resolveShortcut(key('d', { target: { tagName: 'DIV', isContentEditable: true } }), 4)).toBeNull()
  })
})
