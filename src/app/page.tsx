import { PORTFOLIO_SECTIONS, SECTION_IDS, type PortfolioSectionId } from '@/lib/content'

import { BackgroundExperience } from '@/components/features/BackgroundExperience'
import { Contact } from '@/components/features/Contact'
import { FeaturedProjects } from '@/components/features/FeaturedProjects'
import { Hero } from '@/components/features/Hero'
import { AppShell } from '@/components/layout/AppShell'
import { MainContent } from '@/components/ui/main-content'
import { ParallaxSection } from '@/components/ui/parallax-section'

const SECTION_COMPONENTS: Record<PortfolioSectionId, React.ComponentType> = {
  hero: Hero,
  'featured-projects': FeaturedProjects,
  experience: BackgroundExperience,
  contact: Contact,
}

export default function HomePage() {
  return (
    <>
      <MainContent>
        {PORTFOLIO_SECTIONS.map(({ id, name, centered }) => {
          const Component = SECTION_COMPONENTS[id]
          return (
            <ParallaxSection key={id} id={id} aria-label={name} centered={centered}>
              <Component />
            </ParallaxSection>
          )
        })}
      </MainContent>

      <AppShell sectionIds={[...SECTION_IDS]} />
    </>
  )
}
