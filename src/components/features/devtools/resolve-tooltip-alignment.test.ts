import { describe, expect, it, vi } from 'vitest'

import { resolveTooltipAlignment } from './resolve-tooltip-alignment'

function fakeTile(left: number, width = 40): HTMLElement {
  return {
    getBoundingClientRect: () => ({
      left,
      width,
      right: left + width,
      top: 0,
      bottom: 40,
      height: 40,
      x: left,
      y: 0,
      toJSON: () => ({}),
    }),
  } as HTMLElement
}

describe('resolveTooltipAlignment', () => {
  it('centers when there is room on both sides', () => {
    vi.stubGlobal('window', { innerWidth: 800 })
    expect(resolveTooltipAlignment(fakeTile(400))).toBe('center')
  })

  it('aligns left when the tile is near the left edge', () => {
    vi.stubGlobal('window', { innerWidth: 800 })
    expect(resolveTooltipAlignment(fakeTile(10))).toBe('left')
  })

  it('aligns right when the tile is near the right edge', () => {
    vi.stubGlobal('window', { innerWidth: 800 })
    expect(resolveTooltipAlignment(fakeTile(760))).toBe('right')
  })
})
