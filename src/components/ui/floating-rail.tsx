type FloatingRailVariant = 'center-right' | 'bottom-right' | 'bottom-left'

interface FloatingRailProps {
  children: React.ReactNode
  variant: FloatingRailVariant
  desktopOnly?: boolean
  childOffsetRightPx?: number
  interactive?: boolean
}

export function FloatingRail({
  children,
  variant,
  desktopOnly = false,
  childOffsetRightPx = 0,
  interactive = true,
}: FloatingRailProps) {
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

  const isBottomLeft = variant === 'bottom-left'

  return (
    <div
      className={`${desktopOnly ? 'desktop-rail-only ' : ''}fixed pointer-events-none inset-x-0 z-50`}
      style={outerStyle}
    >
      <div
        className='mx-auto w-full'
        style={{
          width: '100%',
          maxWidth: '72rem',
          paddingLeft: isBottomLeft ? '0.5rem' : '1.5rem',
          paddingRight: isBottomLeft ? '1.5rem' : '0.5rem',
          paddingBottom:
            variant === 'bottom-right'
              ? 'max(1.75rem, env(safe-area-inset-bottom))'
              : variant === 'bottom-left'
                ? 'max(2rem, calc(env(safe-area-inset-bottom) + 0.75rem))'
                : undefined,
          display: 'flex',
          justifyContent: isBottomLeft ? 'flex-start' : 'flex-end',
        }}
      >
        <div
          className={interactive ? 'pointer-events-auto' : 'pointer-events-none'}
          style={{ marginRight: `${childOffsetRightPx}px` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
