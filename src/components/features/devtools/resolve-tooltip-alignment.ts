const ACHIEVEMENT_TOOLTIP_WIDTH = 220

export type TooltipAlign = 'center' | 'left' | 'right'

export function resolveTooltipAlignment(tileElement: HTMLElement, boundaryElement?: HTMLElement | null): TooltipAlign {
  const tileRect = tileElement.getBoundingClientRect()
  const boundaryRect = boundaryElement?.getBoundingClientRect()
  const minLeft = (boundaryRect?.left ?? 8) + 8
  const maxRight = (boundaryRect?.right ?? window.innerWidth) - 8
  const centerX = tileRect.left + tileRect.width / 2

  if (centerX - ACHIEVEMENT_TOOLTIP_WIDTH / 2 < minLeft) {
    return 'left'
  }

  if (centerX + ACHIEVEMENT_TOOLTIP_WIDTH / 2 > maxRight) {
    return 'right'
  }

  return 'center'
}
