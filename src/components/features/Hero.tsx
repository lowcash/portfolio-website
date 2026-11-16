import { siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

import { TechList } from '@/components/ui/entry'

export function Hero() {
  const { greeting, name, role, summary } = siteContent.hero
  const stack = summary.split(' · ')

  return (
    <section id='hero' className='hero tone tone-pink' aria-labelledby='hero-h'>
      <div className='hero-body wrap grid-12'>
        <p className='idx l-rail mono' aria-hidden='true'>
          00
        </p>
        <h1 id='hero-h' className='l-col'>
          <span className='hey'>{greeting}</span> <span className='name'>{name}</span>
        </h1>
        <p className='role l-col'>{formatTypography(role)}</p>
        <TechList items={stack} className='l-col' />
        <p className='actions l-col mono'>
          <a className='btn btn--primary' href='#featured-projects'>
            See projects
          </a>
          <button
            className='btn'
            type='button'
            popoverTarget='console'
            popoverTargetAction='toggle'
            aria-keyshortcuts='D'
          >
            &gt;_ Dev Console
          </button>
        </p>
      </div>
    </section>
  )
}
