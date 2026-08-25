import { Inter, JetBrains_Mono } from 'next/font/google'

import { PERSON_JSON_LD, ROOT_METADATA, ROOT_VIEWPORT } from '@/app/site-metadata'
import { Analytics } from '@vercel/analytics/next'

import { SkipToContentLink } from '@/components/ui/skip-to-content-link'

import '../styles/globals.css'

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const viewport = ROOT_VIEWPORT

export const metadata = ROOT_METADATA

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const enableVercelAnalytics = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL)

  return (
    <html lang='en' className={`${sans.variable} ${mono.variable}`}>
      <body className='font-sans antialiased'>
        <SkipToContentLink />

        {children}

        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }} />
        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
