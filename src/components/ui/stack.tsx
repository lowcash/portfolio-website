import type { ReactNode, Ref } from 'react';

type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type StackAlign = 'start' | 'center' | 'end' | 'stretch';
type StackJustify = 'start' | 'center' | 'end' | 'between';
type StackWidth = 'auto' | '3xl' | '4xl' | '6xl';

interface StackProps {
  children: ReactNode;
  stackRef?: Ref<HTMLDivElement>;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  width?: StackWidth;
  centerX?: boolean;
  id?: string;
  role?: string;
  ariaLabel?: string;
}

const GAP_CLASS: Record<StackGap, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const ALIGN_CLASS: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const JUSTIFY_CLASS: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

const WIDTH_CLASS: Record<StackWidth, string> = {
  auto: '',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
};

export function Stack({
  children,
  stackRef,
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  width = 'auto',
  centerX = false,
  id,
  role,
  ariaLabel,
}: StackProps) {
  const className = [
    'flex flex-col',
    GAP_CLASS[gap],
    ALIGN_CLASS[align],
    JUSTIFY_CLASS[justify],
    WIDTH_CLASS[width],
    centerX ? 'mx-auto w-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={stackRef} id={id} role={role} aria-label={ariaLabel} className={className}>
      {children}
    </div>
  );
}
