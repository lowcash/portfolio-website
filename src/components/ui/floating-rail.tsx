import type { ReactNode } from 'react'

type FloatingRailVariant = 'center-right' | 'bottom-right'

interface FloatingRailProps {
  children: ReactNode
  variant: FloatingRailVariant
  desktopOnly?: boolean
  childOffsetRightPx?: number
}

export function FloatingRail({ children, variant, desktopOnly = false, childOffsetRightPx = 0 }: FloatingRailProps) {
  const outerStyle =
    variant === 'center-right'
      ? {
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }
      : {
          left: 0,
          right: 0,
          bottom: 0,
        }

  return (
    <div
      className={`${desktopOnly ? 'desktop-rail-only ' : ''}fixed inset-x-0 z-50 pointer-events-none`}
      style={outerStyle}
    >
      <div
        className='mx-auto w-full'
        style={{
          width: '100%',
          maxWidth: '72rem',
          paddingLeft: '1.5rem',
          paddingRight: '0.5rem',
          paddingBottom: variant === 'bottom-right' ? '2rem' : undefined,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div className='pointer-events-auto' style={{ marginRight: `${childOffsetRightPx}px` }}>
          {children}
        </div>
      </div>
    </div>
  )
}
