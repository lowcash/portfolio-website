---
applyTo: 'app/**/*.{ts,tsx},src/components/**/*.{ts,tsx},src/lib/**/*.{ts,tsx}'
---

# Architecture & Component Organization

Applied to all server/client components and library files.

## App Router Boundaries

### Document Shell (`app/layout.tsx`)
- Defines `<html>`, `<head>`, `<body>` structure
- Sets global metadata, JSON-LD schema, Open Graph tags
- Imports global CSS (`src/index.css`)
- Includes accessibility scaffolding (skip link)
- **Constraint**: No interactivity; pure document structure

### Page Assembly (`app/page.tsx`)
- Server-side only; maps section data to components
- Imports feature components (WhoIAm, TechStack, etc.)
- Wraps each section in layout wrapper (e.g., `<ParallexSection>`)
- Provides unique `id` and `aria-label` per section for nav targeting
- **Constraint**: No `'use client'` directive; pure RSC composition

### Client Orchestration (`app/client-chrome.tsx`)
- Single `'use client'` root boundary
- Manages all interactive state: scroll position, menu open/close, dev console open
- Mounts: `ScrollProgress`, `ScrollNavigation`, `ScrollToTop`, `DeveloperConsole`, `EasterEggs`, `AnimatedBackground`
- Coordinates scroll listeners with `requestAnimationFrame` debouncing
- **Rule**: All client-side state lives here; features are dumb consumers

## Component Layers

### UI Layer (`src/components/ui/`)
**Purpose**: Base styled components, no business logic

**Examples**:
- `button.tsx` – styled button component
- `card.tsx` – styled container with border/shadow
- `floating-rail.tsx` – positioning container (center-right, bottom-left variants)
- `scroll-progress.tsx` – progress bar (reads scroll state from parent)
- `scroll-navigation.tsx` – nav dots + mobile drawer (reads currentSection from parent)

**Rules**:
- Import and apply styles (Tailwind + CSS custom properties)
- Accept `className` prop for composition
- Accept event handlers as props (e.g., `onClick`, `onSectionClick`)
- NO business logic; pure presentation

### Feature Layer (`src/components/features/`)
**Purpose**: Content modules + interactive features, composed entirely from UI layer

**Examples**:
- `WhoIAm.tsx` – section about skills/background
- `TechStack.tsx` – section about tools
- `NotableWork.tsx` – portfolio projects
- `devtools/DeveloperConsole.tsx` – easter egg debug tool

**Rules**:
- Compose styled components from `ui/`
- May contain local state (e.g., DeveloperConsole draggable position)
- May accept props from parent (e.g., `currentSection`)
- **Constraint**: Do NOT define raw `className` styling; use UI components

### Shared Layer (`src/components/shared/`)
**Purpose**: Interactive utilities shared across features

**Examples**:
- `AnimatedBackground.tsx` – animated orbs effect
- `ParallaxSection.tsx` – section wrapper with scroll-linked class names

**Rules**:
- May be styled (e.g., orbs rendering logic)
- May have complex state/logic
- Avoid business-logic duplication; extract to `lib/`

### Layout Layer (`src/components/layout/`)
**Purpose**: Layout wrappers, navigation structure

**Examples**:
- `SectionWrapper.tsx` – standard section padding/spacing
- `Container.tsx` – max-width container

**Rules**:
- Pure composition; NO raw styling
- Wrap content with predictable spacing/structure

## Styling Organization

### Global Styles (`src/styles/globals.css`)
- **Authored source** (hand-written)
- Animation definitions, scroll behavior, CSS custom properties
- Reset/normalize styles
- Reference: scroll progress colors, orb brightness, animation timing

### Component Styles (`src/styles/*.tsx` or inline classNames)
- Tailwind utility classes (preferred)
- Scoped CSS when complex (e.g., shimmer animation)
- CSS custom properties for dynamic values (colors, opacity)

### Generated Output (`src/index.css`)
- Tailwind JIT output; **DO NOT edit manually**
- Compiled from all `className` attributes + Tailwind config
- Output from build process

### CSS Custom Properties (Dynamic Styling)
```css
--orb-r, --orb-g, --orb-b     /* Section color (RGB components) */
--scroll-progress             /* 0-1 scroll position */
--animation-speed             /* Tunable orb animation speed */
--orb-brightness              /* Tunable brightness adjustment */
```

**Pattern**: Set in parent (e.g., `DeveloperConsole`), consumed by children via `rgb(var(--orb-r), ...)` or `color: rgb(var(--orb-r), ...)`

## File Naming Conventions

- **Components**: PascalCase, `.tsx` extension
- **Hooks**: camelCase, `use*` prefix, `.ts` or `.tsx`
- **Utilities**: camelCase, `.ts` extension
- **Styles**: kebab-case, `.css` extension
- **Types**: PascalCase, `.ts` extension (or inline in component if small)

## Import Order

1. External modules (`react`, `lucide-react`, etc.)
2. Project aliases (`@/components`, `@/lib`, `@/hooks`)
3. Relative imports (rare; prefer aliases)
4. Alphabetically sorted within each group

**Enforced by Prettier**: `@trivago/prettier-plugin-sort-imports` + `prettier-plugin-tailwindcss`

## Composition Pattern (Preferred)

```typescript
// ✅ GOOD: Feature composes styled UI
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function MyFeature() {
  return (
    <Card className='p-6'>
      <Button variant='primary'>Click me</Button>
    </Card>
  )
}

// ❌ BAD: Feature defines raw styling
export function MyFeature() {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-md'>
      <button className='rounded bg-blue-500 px-4 py-2 text-white'>Click me</button>
    </div>
  )
}
```

## Server vs. Client Components

**When to use Server Components** (default):
- Static content (sections, text, images)
- Data fetching required
- No interactivity (no hooks, event handlers, state)
- Example: `app/page.tsx`, `WhoIAm.tsx`

**When to use Client Components** (`'use client'`):
- Event handlers (`onClick`, `onChange`)
- React hooks (`useState`, `useEffect`)
- Browser APIs (`localStorage`, `window`)
- Example: `app/client-chrome.tsx`, button components

**Rule**: Server components are default; mark as client only when necessary to keep bundle small.

## Performance Notes

- **CSS Variables over JS**: Animated colors use CSS vars instead of React state (no re-renders)
- **requestAnimationFrame**: Scroll listeners debounced to 60fps
- **Lazy Loading**: Heavy components (e.g., future analytics) imported on demand
- **Tailwind JIT**: Unused styles purged at build time

---

See `docs/ARCHITECTURE.md` for full system design, tech stack rationale, and deployment info.
