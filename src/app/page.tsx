import { siteContent } from '@/lib/content'

import { BackgroundExperience } from '@/components/features/BackgroundExperience'
import { Contact } from '@/components/features/Contact'
import { FeaturedProjects } from '@/components/features/FeaturedProjects'
import { Hero } from '@/components/features/Hero'
import { AppShell } from '@/components/layout/AppShell'
import { MainContent } from '@/components/ui/main-content'
import { ParallaxSection } from '@/components/ui/parallax-section'

const sections = [
  { id: 'hero', name: 'Intro', Component: Hero },
  { id: 'featured-projects', name: 'Projects', Component: FeaturedProjects },
  { id: 'experience', name: 'Experience', Component: BackgroundExperience },
  { id: 'contact', name: 'Contact', Component: Contact },
] as const

export default function HomePage() {
  return (
    <>
      <MainContent>
        {sections.map(({ id, name, Component }, index) => (
          <ParallaxSection
            key={id}
            id={id}
            role={index === 0 ? 'banner' : 'region'}
            aria-label={name}
          >
            <Component />
          </ParallaxSection>
        ))}
      </MainContent>

      <AppShell sectionIds={siteContent.navigation.sections.map((section) => section.id)} />
    </>
  )
}
