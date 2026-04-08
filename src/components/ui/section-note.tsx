interface SectionNoteProps {
  text: string
}

export function SectionNote({ text }: SectionNoteProps) {
  return (
    <div className='mt-16 text-center'>
      <p className='mx-auto max-w-2xl text-gray-400'>{text}</p>
    </div>
  )
}
