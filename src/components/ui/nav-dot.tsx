interface NavDotProps {
  isActive: boolean
  label: string
  onClick: () => void
}

export function NavDot({ isActive, label, onClick }: NavDotProps) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className='group relative flex h-3 w-3 cursor-pointer items-center justify-center'
      aria-label={`Navigate to ${label}`}
      aria-current={isActive ? 'true' : 'false'}
    >
      <div
        className={`rounded-full transition-all duration-300 ${
          isActive ? 'scroll-nav-dot-active h-3 w-3' : 'scroll-nav-dot-inactive h-2 w-2'
        }`}
        aria-hidden='true'
      />
      <div
        className='pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 rounded bg-black/90 px-2 py-1 text-xs whitespace-nowrap text-gray-300 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100'
        aria-hidden='true'
      >
        {label}
      </div>
    </button>
  )
}
