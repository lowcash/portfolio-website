interface SectionNoteProps {
  text: string
}

export function SectionNote({ text }: SectionNoteProps) {
  return (
    <div className='mt-16 text-center'>
      <p className='text-gray-500 max-w-2xl mx-auto'>{text}</p>
    </div>
  )
}
