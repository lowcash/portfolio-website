interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main id='main-content' className='relative z-10'>
      {children}
    </main>
  )
}
