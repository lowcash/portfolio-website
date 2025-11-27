import { useRef } from 'react';

export function useStaggerFadeIn(_itemCount: number) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = true; // Always visible - no animations

  // Žádné animace - vše je viditelné
  const getItemStyle = (_index: number) => ({
    opacity: 1,
    transform: 'translateY(0)',
    // Žádné transitions
  });

  return { ref, isVisible, getItemStyle };
}
