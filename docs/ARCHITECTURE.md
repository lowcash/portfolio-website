# Project Architecture

## Overview

**Portfolio Website** is a high-performance single-page portfolio built with **Next.js 16+ (App Router)**, featuring:

- Server-side rendering (RSC) with minimal client JavaScript
- Scroll-based section navigation with smooth transitions
- Dynamic achievement system ("easter eggs")
- Performance-optimized animations via CSS variables
- Responsive design (mobile-first, tablet/desktop enhancements)

**Framework**: Next.js 16+ (App Router) — currently 16.2.2  
**React**: 19+ — currently 19.2.4  
**TypeScript**: 5+ — currently 5.9.3  
**Styling**: Tailwind CSS 4+ + CSS custom properties

---

## Architectural Principles (Framework-Agnostic)

These principles apply whether you're using Next.js App Router, Vite, or other frameworks:

### 1. **Component Layering**

Organize components into layers to prevent mixing concerns:

- **UI Layer**: Base styled components, zero business logic (buttons, cards, positioning containers)
- **Feature Layer**: Content modules composed from UI primitives (sections, feature cards)
- **Shared Layer**: Utilities and effects used across features (background animations, parallax)
- **Layout Layer**: Structure wrappers with no raw styling (containers, spacing helpers)

### 2. **State Boundaries**

Clear separation of state ownership:

- **Server state**: Content, metadata, non-interactive data (rendered on page load)
- **Interactive state**: User interactions, scroll position, UI toggles (client-side only)
- **Persistent state**: Achievements, preferences (localStorage)

### 3. **Styling Strategy**

Consistent approach to styling layers:

- **Global styles**: CSS resets, animations, scroll behavior (one canonical file)
- **Component styles**: Tailwind utilities + scoped CSS when necessary
- **Dynamic values**: CSS custom properties for runtime changes (colors, opacity, metrics)

### 4. **Performance-First Defaults**

- **No layout shift**: Dimensions and spacing defined upfront
- **CSS over JavaScript**: Animations and dynamic properties via CSS vars (no React re-renders)
- **Lazy/deferred interaction**: Non-critical features (dev console, achievements) loaded on user interaction

---

## Directory Structure (Next.js App Router)

```
src/
├── app/
│   ├── layout.tsx              # Document shell (html, head, body)
│   └── page.tsx                # Server assembly (sections, content)
├── components/
│   ├── features/               # Feature modules (WhoIAm, TechJourney, etc.)
│   │   └── devtools/
│   │       └── DeveloperConsole.tsx    # Easter egg debug tool
│   ├── shared/                 # Cross-feature utilities (AnimatedBackground)
│   ├── ui/                     # Base styled components, parallax section, navigation controls
│   └── layout/                 # AppShell orchestration boundary
├── lib/                        # Utilities, constants, navigation helpers
└── styles/                     # Global CSS entrypoint and style modules
```

---

## Key Systems

### 1. Scroll Navigation & Section Tracking

**Implementation**: `src/components/layout/AppShell.tsx` + `src/components/ui/scroll-navigation.tsx`

**How it works**:

1. Client component listens to `window.scroll` events
2. Debounced with `requestAnimationFrame` (60 FPS max, prevents jank)
3. Calculates `currentSection` index by comparing scroll position to section boundaries
4. Updates active nav dot + desktop drawer highlight
5. Mobile: Custom drawer with keyboard shortcut support (Escape to close)

**Example**:

```typescript
// src/components/layout/AppShell.tsx
const [currentSection, setCurrentSection] = useState(0)
useEffect(() => {
  const handleScroll = () => {
    // Calculate which section is in viewport
    const newSection = detectCurrentSection(...)
    setCurrentSection(newSection)
  }
  window.addEventListener('scroll', handleScroll)
})
```

### 2. Achievement System ("Easter Eggs")

**Implementation**: `src/components/ui/easter-eggs.tsx`

**Mechanics**:

- Triggers detected on client (scroll position, keyboard shortcuts, user actions)
- State persisted to `localStorage` (`achievements:unlocked`)
- Popup appears above side-nav dots when triggered, derives border color from current section's CSS variable (`--orb-r`, `--orb-g`, `--orb-b`)
- Animations: CSS transitions + backdrop blur (no heavy libraries)

**Example triggers**:

- Scroll to exactly 50% of page height → "Perfectly Balanced" achievement
- Use the scroll-to-top shortcut → "Round Trip" achievement
- Unlock every base achievement → "Enlightenment" achievement

### 3. Animations & Visual Effects

**CSS Variables Drive Dynamic Styling**:

```css
/* Set by JavaScript based on currentSection */
--orb-r: 255; /* Red component */
--orb-g: 100; /* Green component */
--orb-b: 50; /* Blue component */

/* Consumed by components */
color: rgb(var(--orb-r), var(--orb-g), var(--orb-b));
```

**Benefits**:

- No React re-renders when section color changes
- GPU-accelerated CSS updates
- Smooth transitions with `transition: --orb-r 300ms ease-out`

**ParallaxSection** (scroll-linked effect):

- Sets CSS class based on distance from viewport center
- Class toggles opacity, spacing via Tailwind utilities
- Alternative to expensive `onScroll` transform calculations

**AnimatedBackground** (orbs):

- Positioned absolutely, layered with `z-index`
- Colors derive from current section
- Opacity controlled via CSS variable: `--animation-speed`

---

## Component Architecture (Next.js Specific)

### App Router Boundaries

**`app/layout.tsx` — Document Shell**

```typescript
// Server-rendered, no interactivity
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Metadata, JSON-LD schema, Open Graph */}
      </head>
      <body>
        {children}
        {/* Global styles imported here */}
      </body>
    </html>
  )
}
```

- Defines `<html>`, `<head>`, `<body>` structure
- Sets global metadata (title, description, social preview)
- Imports `src/index.css` (global animations + Tailwind)
- No hooks, no state, no event listeners

**`app/page.tsx` — Server Assembly**

```typescript
// Pure server component, maps data to features
export default function Home() {
  return (
    <>
      <WhoIAm id="who-i-am" aria-label="About me" />
      <TechStack id="tech-stack" aria-label="Tech stack" />
      {/* ... */}
    </>
  )
}
```

- Composes feature components (WhoIAm, TechStack, NotableWork, etc.)
- Wraps each in layout helper (ParallaxSection, SectionWrapper)
- Provides unique `id` and `aria-label` per section (nav targeting, accessibility)
- No `'use client'` directive; pure server-side rendering

**`app/client-chrome.tsx` — Client Orchestrator (Single Boundary)**

```typescript
'use client'
export default function ClientChrome() {
  const [currentSection, setCurrentSection] = useState(0)
  const [devConsoleOpen, setDevConsoleOpen] = useState(false)

  return (
    <>
      <ScrollProgress currentSection={currentSection} />
      <ScrollNavigation currentSection={currentSection} />
      <ScrollToTop />
      <DeveloperConsole />
      <EasterEggs currentSection={currentSection} />
      <AnimatedBackground currentSection={currentSection} />
    </>
  )
}
```

- **Single `'use client'` boundary** for entire app
- Manages all interactive state:
  - `currentSection`: Index of active section
  - `devConsoleOpen`: Debug tool toggle
  - `menuOpen`: Mobile drawer state
- Mounts client-aware components (requires scroll listeners, state)
- Orchestrates scroll event forwarding via `requestAnimationFrame` debouncing

**Why single boundary?**

- Minimizes client JavaScript (hydration cost lower)
- Clear state ownership (all client-side state in one place)
- Prevents "scattered `'use client'` directives" anti-pattern
- Easier to reason about data flow

### Component Layers

**UI Layer** (`src/components/ui/`): Styled primitives

- `button.tsx`, `card.tsx`, `container.tsx` — Tailwind + className props
- `floating-rail.tsx` — Position wrapper for fixed elements (scroll-up button, side-nav dots)
- `scroll-navigation.tsx` — Navigation dots + mobile drawer
- `scroll-progress.tsx` — Progress bar element
- `easter-eggs.tsx` — Achievement popup
- **Rule**: No business logic, pure presentation

**Feature Layer** (`src/components/features/`): Content modules

- `WhoIAm.tsx` — About section (skills, background)
- `TechJourney.tsx` — Tech overview (tools, frameworks)
- `NotableWork.tsx` — Portfolio projects
- `devtools/DeveloperConsole.tsx` — Easter egg debug interface
- **Rule**: Compose UI primitives only; no raw `className` styling

**Shared Layer** (`src/components/shared/`): Cross-feature utilities

- `AnimatedBackground.tsx` — Scrolling orb effect
- **Rule**: May be styled/stateful; prevent duplication

**Layout Layer** (`src/components/layout/`): Structure wrappers

- `AppShell.tsx` — Client orchestration boundary for navigation and overlays
- **Rule**: Pure composition, no raw styling

---

## Styling Organization

### Global CSS Structure (`src/styles/`)

**Modular, Tailwind v4+ compatible architecture**:

```
globals.css          ← Entry point: @imports all modules in order
├── theme.css        ← Design tokens, color palette, CSS variables, @theme mapping
├── typography.css   ← Font scale, heading styles, text element defaults
├── base.css         ← HTML/body reset, scroll behavior, accessibility helpers
├── accessibility.css ← Focus indicators, skip-to-content, sr-only utilities
└── animations.css   ← All @keyframes, animation utilities, scroll-based component styles
```

**Why modular CSS?**

- **Maintainability**: Each file has a single concern (colors, typography, animations)
- **Clarity**: Navigate to relevant file based on what you're updating
- **Performance**: Tailwind purges unused styles in production; modular organization doesn't affect bundle size
- **Framework-agnostic**: Same structure works in Vite, Svelte, Next.js, etc.

**Workflow**:

```bash
npm run dev   # Tailwind watches src/styles/*.css, processes into single stylesheet
npm run build # Production: CSS purged, minified; no unused styles
```

**Import Flow** (from `app/layout.tsx`):

```typescript
import '../styles/globals.css'

// Entry point; cascades to all submodules
```

### Component Styles

**Tailwind Utilities** (default approach):

```tsx
// ✅ GOOD: UI primitives use className
export function Button({ children }) {
  return <button className='rounded-lg bg-blue-500 px-4 py-2 text-white'>{children}</button>
}

// ✅ GOOD: Features compose UI primitives
export function MySection() {
  return (
    <Card className='p-6'>
      <Button>Click</Button>
    </Card>
  )
}

// ❌ BAD: Features defining raw styling
export function MySection() {
  return <div className='rounded-lg border bg-white p-6 shadow'>...</div>
}
```

**CSS Custom Properties** (dynamic runtime values):

```css
/* src/styles/theme.css — Global initialization */
:root {
  --orb-r: 255;
  --orb-g: 100;
  --orb-b: 50;
}

/* src/styles/animations.css — Component consumption */
.scroll-nav-dot-active {
  background-color: rgb(var(--orb-r), var(--orb-g), var(--orb-b));
  box-shadow: 0 0 12px rgba(var(--orb-r), var(--orb-g), var(--orb-b), 0.8);
}
```

**Why CSS variables instead of React state?**

- No re-renders when values change (no performance hit)
- GPU-accelerated transitions: `transition: --orb-r 300ms ease-out`
- Simpler code: Set once on page load, CSS handles animations

### Removed Dead Code

- `src/index.css` (generated Tailwind output, deprecated)
- Old `src/styles/globals.css` (20 KB monolith, migrated to modular structure)

---

## Performance & Optimization

### 1. Server-Side Rendering (RSC)

**Benefit**: Initial HTML includes all section content; avoids "flash of empty page"

```html
<!-- Sent to browser immediately -->
<html>
  <body>
    <section id="who-i-am">...</section>
    <section id="tech-stack">...</section>
  </body>
</html>
```

### 2. Minimal Client JavaScript

**Only** `app/client-chrome.tsx` is client-rendered:

- Scroll listener
- Nav state updates
- Hidden easter egg console
- ~15–20 KB gzipped (vs. full SPA: 100+ KB)

### 3. CSS Variables vs. React State

**Without CSS vars** (❌ wasteful):

```jsx
const [color, setColor] = useState('rgb(255, 100, 50)')
/* onScroll → setColor(...) → re-render */
```

**With CSS vars** (✅ performant):

```jsx
useEffect(() => {
  document.documentElement.style.setProperty('--orb-r', 255)
  /* onScroll → inline style update → GPU handles it */
}, [])
```

### 4. Scroll Listener Debouncing

```javascript
let rafId = null
window.addEventListener('scroll', () => {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    setCurrentSection(calculateNewSection())
  })
})
```

**Result**: At most 1 state update per frame (60 FPS max), prevents jank

### 5. Dynamic Imports (Future)

For non-critical features:

```typescript
const DeveloperConsole = dynamic(() => import('@/components/features/DeveloperConsole'), { ssr: false })
```

---

## Extensibility & Framework Adaption

### Next.js to Vite Migration (If Needed)

The architecture translates well:

| Next.js                                  | Vite Equivalent                         |
| ---------------------------------------- | --------------------------------------- |
| `app/layout.tsx`                         | `index.html` + main layout component    |
| `app/page.tsx` → `app/client-chrome.tsx` | Root App component with scroll listener |
| RSC Server → Vite static data            | Static import or API call               |
| CSS vars + Tailwind                      | Same setup applicable                   |

**Key difference**: Vite forces everything to client by default, so:

1. Move scroll logic into a single "root orchestrator" component (like `client-chrome`)
2. Pass state down as props (no RSC convenience)
3. Use code splitting for non-critical features

### Why Not Svelte/Vue?

The principles remain the same:

- **Component layering**: UI → Features → Shared → Layout (language-agnostic)
- **State boundaries**: Centralize interactive state, keep UI dumb
- **CSS strategy**: Tailwind + CSS vars work in any framework

If you ever need Svelte, the conceptual model is identical; only the syntax changes.

---

## Development Workflow

### Building & Type Checking

```bash
npm run dev              # Start dev server + Tailwind watch
npm run build            # Next.js prod build + TypeScript check
npm run lint             # ESLint + Prettier format check
npm run format           # Auto-format code
```

### Testing

```bash
npm run test:e2e         # Playwright focused suite (scroll nav, devtools, mobile)
npm run test:e2e:ui      # Open Playwright Inspector
```

### Knip Unused Code Analysis

```bash
npm run analyze:unused   # Check for unused exports, imports, types
```

---

## References

- **Component Guidelines**: See `.github/instructions/architecture.instructions.md` (RSC/client boundaries, composition rules)
- **Import & Code Standards**: `.github/instructions/clean-code.instructions.md`, `imports.instructions.md`
- **Project Structure**: `.github/instructions/project-structure.instructions.md`
