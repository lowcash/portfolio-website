export function ScrollProgress() {
  // CSS vars (--orb-r, --orb-g, --orb-b, --scroll-progress) are set by AnimatedBackground
  // with smooth interpolation via RAF, so no transition needed!
  
  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-50"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      style={{ 
        background: 'rgb(var(--orb-r), var(--orb-g), var(--orb-b))',
        width: '100%',
        transformOrigin: 'left',
        transform: `scaleX(var(--scroll-progress, 0))`,
        // NO transition needed - smooth interpolation happens in JS via RAF
        willChange: 'transform, background-color'
      }}
    />
  );
}