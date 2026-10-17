# Project Architecture

## Overview

Portfolio Website is a Next.js App Router portfolio focused on server-rendered content, section-based navigation, lightweight client interactivity, and dynamic visual theming.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Document shell, fonts (Inter latin + latin-ext for the "š" in the hero)
│   └── page.tsx                # Server-side section assembly
├── components/
│   ├── features/               # Content modules (Hero, FeaturedProjects, BackgroundExperience, Contact)
│   │   ├── devtools/           # DeveloperConsole + orb-controls (sliders generated from orb-settings)
│   │   └── easter-eggs/        # EasterEggs state/overlays, achievements data, confetti, triggers/ (one hook per egg)
│   ├── shared/                 # AnimatedBackground
│   ├── ui/                     # Navigation, progress, card and layout primitives
│   └── layout/                 # AppShell client orchestration
├── hooks/                      # use-idle-ready
├── lib/
│   ├── navigation/             # Section hash/URL helpers, scroll spy, useActiveSection
│   ├── orb-color.ts            # Pure color math for the background (tested)
│   ├── orb-settings.ts         # Orb settings store: definitions, presets, persistence, CSS variables (tested)
│   ├── orb-effects.ts          # Magnetism, section burst, click ripples, animation playback rate
│   └── scroll-metrics.ts       # One rAF-throttled scroll listener shared by subscribers
└── styles/                     # Tokens, typography, animations (including the .orb rules)
```

## Key Systems

### 1. Section Navigation

**Implementation**: `src/components/layout/AppShell.tsx`, `src/components/ui/scroll-navigation.tsx`, `src/lib/navigation/`

`AppShell` owns the active section state and updates navigation UI from scroll position. Navigation clicks lock onto the target section until it reaches the viewport, which keeps dots, drawers, and keyboard interactions aligned instead of drifting out of sync during smooth scrolling. Pure URL/hash helpers live in `section-url.ts` and are unit tested.

### 2. Achievement Layer

**Implementation**: `src/components/features/easter-eggs/`

Achievements are unlocked from user behavior such as scroll milestones and shortcuts, persisted in `localStorage`, and rendered as a lightweight overlay. Detection is split into one hook per achievement under `triggers/`; `EasterEggs` owns unlock state, persistence and the overlays. Everything is dormant until the developer console has been opened once, and the whole feature is code-split and mounted when the browser is idle.

### 3. Background Orbs

**Implementation**: `src/components/shared/AnimatedBackground.tsx`, `src/lib/orb-*.ts`, `.orb` rules in `src/styles/animations.css`

The background never re-renders React while scrolling. One rAF loop eases the scroll position and writes colors to CSS custom properties (`--orb-r/g/b` for the page, `--orb-c0..c6` per orb slot). Layout, size, blur, opacity and the mobile/reduced-motion variants are CSS (`.orb`), driven by per-orb custom properties set inline, so the server HTML already matches the final layout (no hydration layout shift).

User tunables live in `orb-settings.ts`: a single definition list drives the console sliders, persistence (legacy `localStorage` keys preserved), CSS variables and presets. Defaults reproduce the original look; everything else is opt-in. Animation speed is applied as `playbackRate` so dragging the slider never restarts or jumps the animation. `orb-effects.ts` adds magnetism (`translate` composed with the keyframed `transform`), section burst, and click ripples via the Web Animations API.

## Testing

- `npm test` - unit tests for pure logic (colors, settings, URLs, typography).
- `npm run test:e2e` - Playwright (desktop, tablet, mobile), including `orb-settings` and `easter-eggs` specs.
- `visual-baseline.spec.ts` - local-only screenshot regression (macOS snapshots, skipped in CI). Update intentionally with `npx playwright test visual-baseline --update-snapshots=all`.
- `docs/PERF-BASELINE.md` - Lighthouse numbers before/after the optimization work.

## Tech Stack Decisions

- **Next.js App Router + RSC** keeps section content server-rendered and limits client code to the orchestration boundary.
- **Single client orchestration boundary** in `AppShell` centralizes section state, navigation locking, and overlays instead of scattering `'use client'` across features. Interaction-only features (developer console, easter eggs) are code-split with `next/dynamic` and mounted when idle.
- **CSS custom properties for runtime theming** let scroll-driven color changes happen without React state churn.
- **Layout differences in CSS, not state**: mobile/desktop/reduced-motion are media queries, never `isMobile` state, so SSR and hydration agree.
- **Tailwind CSS + small CSS modules** split layout utilities from tokens and animation rules.
