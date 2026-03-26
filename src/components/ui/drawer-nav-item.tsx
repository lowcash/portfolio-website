interface DrawerNavItemProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

export function DrawerNavItem({ isActive, label, onClick }: DrawerNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 relative ${
        isActive ? 'text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
      }`}
      style={{ minHeight: '56px' }}
    >
      {isActive && (
        <>
          {/* Outer glow shimmer - same pattern as scroll-to-top / hamburger */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl animate-glow-shimmer -z-10"
            style={{
              boxShadow:
                '0 0 60px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.8), 0 0 100px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.4)',
              transition: 'box-shadow 0.3s ease-out',
            }}
          />
          {/* Inner colored background */}
          <div
            className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-sm -z-10"
            style={{
              boxShadow:
                'inset 0 2px 20px rgba(0,0,0,0.5), inset 0 0 60px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.25)',
              backgroundColor: 'rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.15)',
              transition: 'all 0.3s ease-out',
            }}
          />
        </>
      )}

      <div className="flex items-center justify-between relative z-10">
        <span className="text-base">{label}</span>
        {isActive && (
          <div
            className="w-2 h-2 rounded-full animate-pulse opacity-80"
            style={{
              backgroundColor: 'rgb(var(--orb-r), var(--orb-g), var(--orb-b))',
              transition: 'background-color 0.3s ease-out',
            }}
          />
        )}
      </div>
    </button>
  );
}
