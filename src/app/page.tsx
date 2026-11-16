import { type PortfolioSectionId, SECTION_IDS } from '@/lib/content'

import { Contact } from '@/components/features/Contact'
import { Experience } from '@/components/features/Experience'
import { FeaturedProjects } from '@/components/features/FeaturedProjects'
import { Hero } from '@/components/features/Hero'
import { AppShell } from '@/components/layout/AppShell'
import { MainContent } from '@/components/ui/main-content'

const SECTION_COMPONENTS: Record<PortfolioSectionId, React.ComponentType> = {
  hero: Hero,
  'featured-projects': FeaturedProjects,
  experience: Experience,
  contact: Contact,
}

export default function HomePage() {
  return (
    <AppShell sectionIds={[...SECTION_IDS]}>
      <MainContent>
        {SECTION_IDS.map((id) => {
          const Component = SECTION_COMPONENTS[id]
          return <Component key={id} />
        })}
      </MainContent>
    </AppShell>
  )
}
