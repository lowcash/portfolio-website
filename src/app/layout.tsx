import localFont from 'next/font/local'

import { PERSON_JSON_LD, ROOT_METADATA, ROOT_VIEWPORT } from '@/app/site-metadata'
import { Analytics } from '@vercel/analytics/next'

import { SkipToContentLink } from '@/components/ui/skip-to-content-link'

import '../styles/globals.css'

// Fraunces and Martian Mono, subset to Latin + Latin Extended-A (the "š" of the hero name lives in Latin Extended-A)
// and instanced to the axes the design uses (SOFT 100 and WONK 0 baked in, wght 300-400, opsz 9-144 kept).
// ~58 KB roman + ~16 KB mono are preloaded; the italic is a few short lines and may swap in late.
// The regeneration commands are in docs/ARCHITECTURE.md.
const serif = localFont({
  src: [{ path: './fonts/fraunces-roman.woff2', style: 'normal', weight: '300 400' }],
  variable: '--font-fraunces',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
})

const serifItalic = localFont({
  src: [{ path: './fonts/fraunces-italic.woff2', style: 'italic', weight: '300' }],
  variable: '--font-fraunces-italic',
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Times New Roman',
  fallback: ['Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
})

const mono = localFont({
  src: [{ path: './fonts/martian-mono.woff2', style: 'normal', weight: '400 600' }],
  variable: '--font-martian',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
})

export const viewport = ROOT_VIEWPORT

export const metadata = ROOT_METADATA

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const enableVercelAnalytics = Boolean(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL)

  return (
    <html lang='en' className={`${serif.variable} ${serifItalic.variable} ${mono.variable}`}>
      <body>
        {/* Controls that need JavaScript are visible by default and hidden only when scripting is off */}
        <noscript>
          <style>{'.js-only{display:none}.no-js-only{display:revert}'}</style>
        </noscript>
        <SkipToContentLink />

        {children}

        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }} />
        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
