import type { ReactNode } from 'react';

type BoxAs = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'nav';
type BoxPadding = 'none' | 'sm' | 'md' | 'lg';
type BoxRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type BoxTone = 'transparent' | 'muted' | 'surface';

interface BoxProps {
  as?: BoxAs;
  children: ReactNode;
  padding?: BoxPadding;
  radius?: BoxRadius;
  tone?: BoxTone;
  border?: boolean;
  id?: string;
  role?: string;
  ariaLabel?: string;
}

const PADDING_CLASS: Record<BoxPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

const RADIUS_CLASS: Record<BoxRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
};

const TONE_CLASS: Record<BoxTone, string> = {
  transparent: 'bg-transparent',
  muted: 'bg-white/5',
  surface: 'bg-black/40 backdrop-blur-sm',
};

export function Box({
  as = 'div',
  children,
  padding = 'none',
  radius = 'none',
  tone = 'transparent',
  border = false,
  id,
  role,
  ariaLabel,
}: BoxProps) {
  const Element = as;
  const className = [
    PADDING_CLASS[padding],
    RADIUS_CLASS[radius],
    TONE_CLASS[tone],
    border ? 'border border-white/10' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Element id={id} role={role} aria-label={ariaLabel} className={className}>
      {children}
    </Element>
  );
}
