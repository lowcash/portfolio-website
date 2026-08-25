interface TechTagProps {
  children: string
}

export function TechTag({ children }: TechTagProps) {
  return (
    <span className='rounded-md border border-zinc-700/70 bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-200'>
      {children}
    </span>
  )
}
