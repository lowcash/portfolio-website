type FloatingRailVariant = 'center-right' | 'bottom-right'

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

  return (
    <div
      className={`fixed ${desktopOnly ? 'hidden lg:block' : ''} pointer-events-none inset-x-0 z-40 lg:z-50`}
      style={outerStyle}
    >
      <div
        className='mx-auto w-full'
        style={{
          width: '100%',
          maxWidth: '72rem',
          paddingLeft: '1.5rem',
          paddingRight: '0.5rem',
          paddingBottom: variant === 'bottom-right' ? 'max(1.75rem, env(safe-area-inset-bottom))' : undefined,
          display: 'flex',
          justifyContent: 'flex-end',
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
