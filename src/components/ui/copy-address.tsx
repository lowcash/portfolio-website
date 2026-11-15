'use client'

import { useRef, useState } from 'react'

const RESET_MS = 1800

/** Copies the address and counts as "Copy Cat" (the document copy event fires for real copies; this is the button). */
export function CopyAddress({ value }: { value: string }) {
  const [label, setLabel] = useState('copy address')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setLabel('copied')
      document.dispatchEvent(new Event('copy'))
    } catch {
      setLabel('press ctrl+c')
    }

    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setLabel('copy address'), RESET_MS)
  }

  return (
    <button type='button' className='link copy js-only' onClick={handleClick}>
      {label}
    </button>
  )
}
