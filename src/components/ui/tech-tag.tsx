interface TechTagProps {
  children: string
}

export function TechTag({ children }: TechTagProps) {
  return (
    <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300'>{children}</span>
  )
}
