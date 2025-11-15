import { useState, useRef, MouseEvent } from 'react';

export function useHoverTilt(maxTilt = 5) {
  const [transform, setTransform] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
  };

  return {
    ref,
    transform,
    handleMouseMove,
    handleMouseLeave,
  };
}
