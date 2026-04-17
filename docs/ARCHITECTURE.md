# Project Architecture

## Overview

**Portfolio Website** is a high-performance personal portfolio built with **Next.js 16+ (App Router)**, featuring server-side rendering with minimal client JavaScript, scroll-based section navigation, a dynamic achievement system ("easter eggs"), and performance-optimized animations via CSS variables.

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Document shell
│   └── page.tsx                # Server-side section assembly
├── components/
│   ├── features/               # Content modules (WhoIAm, TechJourney, NotableWork, etc.)
│   │   └── devtools/
│   │       └── DeveloperConsole.tsx    # Easter egg debug tool
│   ├── shared/                 # Cross-feature utilities (AnimatedBackground)
│   ├── ui/                     # Base styled components (navigation, scroll progress, etc.)
│   └── layout/                 # AppShell client orchestration
├── lib/                        # Utilities, navigation helpers, constants
└── styles/                     # Global CSS (themes, animations, typography)
```

---

## Key Systems

### 1. Scroll Navigation & Section Tracking

**Implementation**: `src/components/layout/AppShell.tsx` + `src/components/ui/scroll-navigation.tsx`

Listens to `window.scroll` events, debounced with `requestAnimationFrame` (60 FPS max). Calculates active section index by comparing scroll position to section boundaries, updates nav dots and mobile drawer highlight. When user clicks a nav dot, monitors the target section element until it enters viewport (within 4px of top), then releases the navigation lock to resume normal scrolling.

**Key code**: `monitorNavigationTarget(index)` uses RAF to check `bounding rect.top ≈ 0`; 5-second fallback timeout if section doesn't reach viewport.

### 2. Achievement System ("Easter Eggs")

**Implementation**: `src/components/ui/easter-eggs.tsx`

Detects user actions (scroll position, keyboard shortcuts) and unlocks achievements. State persists to `localStorage` (`achievements:unlocked`). When unlocked, popup appears above side-nav dots with a border color derived from the current section's CSS variable (`--orb-r`, `--orb-g`, `--orb-b`).

**Example triggers**: Scroll to exactly 50% of page → "Perfectly Balanced"; use scroll-to-top shortcut → "Round Trip"; unlock every base achievement → "Enlightenment".

### 3. Animations & Visual Effects

**Implementation**: CSS custom properties + Tailwind utilities

Section colors drive dynamic styling: JavaScript sets `--orb-r`, `--orb-g`, `--orb-b` CSS variables based on `currentSection`, and components consume them with `rgb(var(--orb-r), var(--orb-g), var(--orb-b))`. This approach avoids React re-renders when colors change; CSS handles GPU-accelerated transitions.

**AnimatedBackground** layers orbs positioned absolutely; **ParallaxSection** toggles opacity/spacing based on distance from viewport center using Tailwind utilities.

---

## Tech Stack Decisions

- **Next.js App Router with RSC**: Server components render all section content upfront; only `AppShell` client component handles scroll interactivity (~15–20 KB gzipped vs. full SPA 100+ KB). Minimizes hydration cost and JavaScript execution.

- **CSS Variables over React State**: Dynamic colors set once on load; CSS handles transitions and GPU acceleration. No `setState` on every scroll event.

- **Tailwind CSS v4 + Modular CSS Structure**: Utility-first styling with organized modules (theme, typography, animations). Each file has one concern; Tailwind purges unused styles in production.

- **Single `'use client'` Boundary** (AppShell): All interactive state lives in one component—section tracking, menu state, easter egg console. Prevents scattered client boundaries and simplifies data flow.

---

## References

- **General Principles**: See `.github/instructions/architecture.instructions.md` (component layering, ownership boundaries)
- **Import & Code Standards**: `.github/instructions/clean-code.instructions.md`, `imports.instructions.md`
