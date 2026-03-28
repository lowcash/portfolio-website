import { siteContent } from '@/lib/content'

import { BeyondCode } from '@/components/features/BeyondCode'
import { Contact } from '@/components/features/Contact'
import { Education } from '@/components/features/Education'
import { Hero } from '@/components/features/Hero'
import { NotableWork } from '@/components/features/NotableWork'
import { TechJourney } from '@/components/features/TechJourney'
import { WhatsNext } from '@/components/features/WhatsNext'
import { WhoIAm } from '@/components/features/WhoIAm'
import { WorkExperience } from '@/components/features/WorkExperience'
import { ParallaxSection } from '@/components/ui/parallax-section'

import { ClientChrome } from './client-chrome'

const sections = [
  { id: 'hero', name: 'Hey There', Component: Hero },
  { id: 'who-i-am', name: 'Who I Am', Component: WhoIAm },
  { id: 'tech-journey', name: 'Tech Stack', Component: TechJourney },
  { id: 'notable-work', name: 'Notable Work', Component: NotableWork },
  { id: 'work-experience', name: 'Work Experience', Component: WorkExperience },
  { id: 'education', name: 'Academic Journey', Component: Education },
  { id: 'beyond-code', name: 'Beyond Code', Component: BeyondCode },
  { id: 'whats-next', name: "What's Next", Component: WhatsNext },
  { id: 'contact', name: "Let's Connect", Component: Contact },
] as const

export default function HomePage() {
  return (
    <>
      <main id='main-content' role='main' className='relative z-10'>
        {sections.map(({ id, name, Component }, index) => (
          <ParallaxSection
            key={id}
            id={id}
            className='min-h-screen'
            role={index === 0 ? 'banner' : 'region'}
            aria-label={name}
          >
            <Component />
          </ParallaxSection>
        ))}
      </main>

      <ClientChrome sectionIds={siteContent.navigation.sections.map((section) => section.id)} />
    </>
  )
}
