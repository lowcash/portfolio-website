import { Hero } from '../src/components/features/Hero'
import { WhoIAm } from '../src/components/features/WhoIAm'
import { TechJourney } from '../src/components/features/TechJourney'
import { NotableWork } from '../src/components/features/NotableWork'
import { WorkExperience } from '../src/components/features/WorkExperience'
import { Education } from '../src/components/features/Education'
import { BeyondCode } from '../src/components/features/BeyondCode'
import { WhatsNext } from '../src/components/features/WhatsNext'
import { Contact } from '../src/components/features/Contact'
import { ParallaxSection } from '../src/components/shared/ParallaxSection'
import { siteContent } from '../src/lib/content'
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
      <div className="text-white" style={{ background: 'transparent' }} role="document">
        <main id="main-content" role="main">
          {sections.map(({ id, name, Component }, index) => (
            <ParallaxSection
              key={id}
              id={id}
              className="min-h-screen"
              role={index === 0 ? 'banner' : 'region'}
              aria-label={name}
            >
              <Component />
            </ParallaxSection>
          ))}
        </main>
      </div>

      <ClientChrome sectionIds={siteContent.navigation.sections.map((section) => section.id)} />
    </>
  )
}
