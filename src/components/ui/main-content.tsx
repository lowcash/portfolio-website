interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return <main id='main-content'>{children}</main>
}
