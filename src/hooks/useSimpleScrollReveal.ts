import { useRef } from 'react';

export function useSimpleScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  return {
    revealRef: ref,
    style: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  };
}
