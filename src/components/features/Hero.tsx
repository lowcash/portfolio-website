import { Fragment } from 'react'

import { siteContent } from '@/lib/content'
import { formatTypography } from '@/lib/prevent-widows'

import { HeroChart } from '@/components/ui/hero-chart'
import { HeroCrosshair } from '@/components/ui/hero-crosshair'

export function Hero() {
  const { greeting, name, role, summary } = siteContent.hero
  const [first, ...rest] = name.split(' ')
  const stack = summary.split(' · ')

  return (
    <section id='hero' className='hero tone tone-pink' aria-labelledby='hero-h'>
      <HeroChart />
      <HeroCrosshair />

      <div className='hero-body wrap grid-12'>
        <h1 id='hero-h'>
          <span className='hey'>{greeting}</span>{' '}
          <span className='name'>
            <span>{first} </span>
            <span>{rest.join(' ')}</span>
          </span>
        </h1>
        <p className='role'>{formatTypography(role)}</p>
        <p className='stack mono'>
          {stack.map((item, index) => (
            <Fragment key={item}>
              {index > 0 ? (
                <>
                  {' '}
                  <b aria-hidden='true'>·</b>{' '}
                </>
              ) : null}
              {item}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
