interface MetadataBadgeProps {
  children: string
}

export function MetadataBadge({ children }: MetadataBadgeProps) {
  return (
    <span className='inline-flex shrink-0 items-center whitespace-nowrap rounded-md border border-zinc-800/60 bg-zinc-900/50 px-2.5 py-0.5 font-mono text-xs text-zinc-400'>
      {children}
    </span>
  )
}
