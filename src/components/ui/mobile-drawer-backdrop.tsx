interface MobileDrawerBackdropProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function MobileDrawerBackdrop({ isOpen, onClose, children }: MobileDrawerBackdropProps) {
  return (
    <div
      className={`mobile-until-lg fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Semi-transparent backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Dedicated close hit area for reliable backdrop interactions and E2E stability */}
      <button
        type='button'
        className='absolute bg-transparent'
        style={{ top: 0, left: 0, right: 0, height: '4rem', zIndex: 1 }}
        onClick={onClose}
        aria-label='Close menu backdrop'
      />

      {children}
    </div>
  )
}
