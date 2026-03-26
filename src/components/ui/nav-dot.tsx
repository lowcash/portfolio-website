interface NavDotProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

export function NavDot({ isActive, label, onClick }: NavDotProps) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative cursor-pointer flex items-center justify-center w-3 h-3"
      aria-label={`Navigate to ${label}`}
      aria-current={isActive ? 'true' : 'false'}
    >
      <div
        className={`rounded-full transition-all duration-300 ${
          isActive ? 'scroll-nav-dot-active w-3 h-3' : 'scroll-nav-dot-inactive w-2 h-2'
        }`}
        aria-hidden="true"
      />
      <div
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
        aria-hidden="true"
      >
        {label}
      </div>
    </button>
  );
}
