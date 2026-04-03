---
applyTo: 'app/**/*.{ts,tsx},src/components/**/*.{ts,tsx},src/lib/**/*.{ts,tsx}'
---

# Next.js App Router Implementation (Next.js 16+)

This document extends `architecture.instructions.md` with **Next.js 16+ (App Router)**-specific patterns and constraints.

**Note**: Update version references (`16+`, `17+`, etc.) as your Next.js version bumps. Principles below apply across Next.js 16 and future versions.

## App Router Boundaries

### Document Shell (`app/layout.tsx`)

```typescript
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'My Site',
  description: 'Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Metadata auto-injected by Next.js */}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

**Constraints**:
- ✅ Defines `<html>`, `<head>`, `<body>` elements
- ✅ Exports `metadata` object (Open Graph, JSON-LD schema)
- ✅ Imports global CSS (only place to import global styles)
- ❌ NO hooks, NO interactivity, NO `'use client'`
- ❌ NO event handlers or browser APIs

### Page Assembly (`app/page.tsx`)

```typescript
import { WhoIAm } from '@/components/features/WhoIAm'
import { TechStack } from '@/components/features/TechStack'
import { SectionWrapper } from '@/components/layout/SectionWrapper'

export default function Home() {
  return (
    <>
      <SectionWrapper id="who-i-am" aria-label="About me">
        <WhoIAm />
      </SectionWrapper>
      <SectionWrapper id="tech-stack" aria-label="Tech stack">
        <TechStack />
      </SectionWrapper>
      {/* ... */}
    </>
  )
}
```

**Principles**:
- ✅ Pure server component (default, no `'use client'`)
- ✅ Maps section data → feature components
- ✅ Wraps each section in layout helper (SectionWrapper)
- ✅ Provides unique `id` and `aria-label` per section (nav targeting, a11y)
- ✅ May fetch data (async component)
- ❌ NO `useState`, `useEffect`, hooks
- ❌ NO interactivity (click handlers, form state)

### Client Orchestration (Boundary Pattern)

> **Note**: This is a _project design choice_, not a Next.js framework convention.  
> Next.js is unopinionated about file organisation. Only `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, `loading.tsx`, and `not-found.tsx` are special filenames.  
> **Alternative approach**: place `'use client'` granularly on leaf components — better code splitting, but directives are scattered.  
> This repo uses a single orchestration boundary (file: `app/client-chrome.tsx`) because state flow and maintenance simplicity were prioritised over bundle granularity.

```typescript
'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/ui/nav-bar'
import { Background } from '@/components/shared/Background'
import { DevPanel } from '@/components/features/DevPanel'

export function AppShell() {
  const [currentSection, setCurrentSection] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  
  useEffect(() => {
    let rafId: number
    
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const newSection = detectCurrentSection()
        setCurrentSection(newSection)
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])
  
  return (
    <>
      <NavBar currentSection={currentSection} onMenuChange={setMenuOpen} />
      <Background currentSection={currentSection} />
      <DevPanel />
    </>
  )
}
```

**Trade-offs: single boundary vs. granular**

| Approach | Bundle size | Maintainability | State clarity |
|----------|-------------|-----------------|---------------|
| **Single boundary** (this repo) | Slightly larger | Simple — one place for all state | Props-down flow, explicit |
| **Granular** (Next.js recommended for large apps) | Smaller — tree-shake per component | More components, self-contained | Local state per component |

**Pattern (single boundary)**:
1. One `'use client'` component: colocate it in `src/components/layout/` (e.g. `AppShell.tsx`) or directly in `app/`
2. Mount interactive components: scroll listener, nav dots, UI toggles
3. Pass state as props: `currentSection`, `menuOpen` → child components
4. Debounce scroll with `requestAnimationFrame` to prevent excessive updates

## Component Filesystem

```
app/
├── layout.tsx              # Root document shell (RSC)
└── page.tsx                # Server assembly (sections, RSC)

src/components/
├── features/               # Content modules (server-composed, no raw styling)
│   ├── Hero.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── shared/                 # Effects + utilities (may be stateful)
│   └── Background.tsx
├── ui/                     # Base primitives (pure presentation)
│   ├── button.tsx
│   ├── card.tsx
│   └── nav-bar.tsx
└── layout/                 # Structure wrappers; single 'use client' boundary lives here
    ├── SectionWrapper.tsx
    └── AppShell.tsx        # Project-specific orchestration component (named by project convention)

src/styles/
├── globals.css             # Entry point (@imports all modules)
├── theme.css               # Variables, design tokens
├── base.css                # Reset, HTML/body defaults
├── accessibility.css       # Focus, sr-only, skip-to-content
└── animations.css          # @keyframes, animation utilities
```

## Styling in Next.js 16+ (Tailwind v4+)

### Global CSS Entry Point (Single Source of Truth)

**`app/layout.tsx`** (imports once, at root):
```typescript
import '../styles/globals.css'
```

**`src/styles/globals.css`** (orchestrates all submodules):
```css
@import './theme.css';         /* CSS variables, design tokens */
@import './typography.css';    /* Font scales, heading defaults */
@import './base.css';          /* HTML/body reset, scroll behavior */
@import './accessibility.css'; /* Focus states, sr-only, a11y */
@import './animations.css';    /* @keyframes, animation utilities */
```

**Workflow**:
- **Dev**: `npm run dev` → Tailwind watches `src/components/**/*.tsx` for `className` + CSS imports
- **Prod**: `npm run build` → Tailwind purges unused styles, minifies
- **Best Practice**: All global CSS lives in `src/styles/`; components use **Tailwind utilities only** (no component-scoped CSS files)

### CSS Variables for Dynamic Styling (No React Re-renders)

**Set by JavaScript once** (in the app shell on mount/update):
```typescript
useEffect(() => {
  document.documentElement.style.setProperty('--orb-r', r.toString())
  document.documentElement.style.setProperty('--orb-g', g.toString())
  document.documentElement.style.setProperty('--orb-b', b.toString())
}, [currentSection])
```

**Consumed by all components** (in `src/styles/theme.css` and `src/styles/animations.css`):
```css
/* src/styles/theme.css: Define CSS variables */
:root {
  --orb-r: 255;
  --orb-g: 100;
  --orb-b: 50;
}

/* src/styles/animations.css: Consume without React state */
.scroll-nav-dot-active {
  background-color: rgb(var(--orb-r), var(--orb-g), var(--orb-b));
  box-shadow: 0 0 12px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.8);
  transition: --orb-r 0.3s ease-out;  /* GPU-accelerated, no JS intermediate */
}
```

**Why this pattern?**
- CSS vars update at browser native speed (GPU-accelerated)
- No React re-renders → no component reconciliation cost
- Smooth transitions via CSS alone
- Can transition multiple vars simultaneously

## Metadata & SEO

**`app/layout.tsx`**:
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Site | Role',
  description: 'Description of the site.',
  openGraph: {
    title: 'My Site',
    description: 'Site description',
    url: 'https://example.com',
    type: 'website',
    images: [{ url: 'https://example.com/og.png' }],
  },
}

export default function RootLayout({ children }) {
  // ...
}
```

**JSON-LD Schema** (optional, for rich snippets):
```typescript
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Your Name',
  url: 'https://example.com',
  sameAs: ['https://github.com/yourhandle'],
}

// In head: <script>{JSON.stringify(personJsonLd)}</script>
```

## Import Paths (Aliases)

**Always use `@/` absolute imports** (defined in `tsconfig.json`):

```typescript
// ✅ GOOD: Absolute alias
import { Button } from '@/components/ui/button'
import { WhoIAm } from '@/components/features/WhoIAm'
import { cn } from '@/lib/utils'

// ❌ BAD: Relative chains
import { Button } from '../../components/ui/button'
import { WhoIAm } from '../components/features/WhoIAm'
```

**Enforced by**: `imports.instructions.md`

## Performance Best Practices

### 1. **Minimal Client JavaScript**

> **This repo's approach**: single `'use client'` boundary in `src/components/layout/AppShell.tsx`.  
> Next.js also supports granular boundaries — see the [Client Orchestration](#client-orchestration-boundary-pattern) section for trade-offs.

✅ One client boundary covers: scroll listener, navigation state, dev console, easter eggs  
❌ Avoid scattered `'use client'` in this repo's codebase (maintain the single-boundary pattern while it remains intentional)

### 2. **Server-Side Rendering**

✅ Content in `app/page.tsx` is server-rendered and sent to browser immediately
- No "flash of empty page"
- SEO-friendly
- Initial HTML includes all sections

### 3. **CSS Variables over State**

✅ Animations and color updates via CSS vars (no re-renders)
```css
--orb-r: 255;
transition: --orb-r 300ms ease-out;
```

❌ Avoid React state for frequently-changing visuals
```jsx
const [color, setColor] = useState('rgb(255, 100, 50)')
// onScroll → setColor(...) → re-render → browser recalculates layout
```

### 4. **Debounced Scroll Listeners**

```typescript
useEffect(() => {
  let rafId: number
  
  const handler = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      // Update state at most 60 times per second
    })
  }
  
  window.addEventListener('scroll', handler)
  return () => {
    window.removeEventListener('scroll', handler)
    cancelAnimationFrame(rafId)
  }
}, [])
```

## Error Handling & Fallbacks

```typescript
// app/error.tsx (Next.js error boundary)
'use client'

export default function Error({ error, reset }) {
  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

// app/not-found.tsx (404 handling)
export default function NotFound() {
  return <h1>Page not found</h1>
}
```

## Deployment (Vercel)

```bash
npm run build    # Compiles Next.js + Tailwind
npm run start    # Runs production build

# Vercel auto-deploys on git push to main branch
```

---

**See Also**:
- `architecture.instructions.md` – Framework-agnostic principles
- `docs/ARCHITECTURE.md` – Full system design & tech stack rationale
- Next.js Docs: https://nextjs.org/docs/app
