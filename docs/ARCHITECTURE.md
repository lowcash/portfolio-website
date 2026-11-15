# Project Architecture

## Overview

Portfolio Website is a Next.js App Router portfolio focused on server-rendered content, section-based navigation, lightweight client interactivity, and dynamic visual theming.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Document shell, next/font/local (subset Fraunces + Martian Mono), <noscript> style for .js-only
│   ├── fonts/                  # fraunces-roman / fraunces-italic / martian-mono .woff2 (subset, see Fonts)
│   └── page.tsx                # Server-side section assembly inside AppShell
├── components/
│   ├── features/               # Sections (Hero, FeaturedProjects, BackgroundExperience, Contact), server components
│   │   ├── devtools/           # console-pane (popover shell), console-controls (lazy), console-actions, use-console-stats
│   │   └── easter-eggs/        # EasterEggs state, achievement toast, achievements data, confetti, triggers/ (one hook per egg)
│   ├── shared/                 # AnimatedBackground (three lights + grain)
│   ├── ui/                     # entry, section-header, hero-chart (server SVG), hero-crosshair, top-bar, status-line, copy-address
│   └── layout/                 # AppShell client orchestration
├── hooks/                      # use-idle-ready
├── lib/
│   ├── navigation/             # Section hash/URL helpers, scroll spy, useActiveSection
│   ├── content.ts              # All copy, section ids/scenes/tones, entry tones
│   ├── orb-settings.ts         # Settings of the lights: definitions, presets, persistence, CSS variables (tested)
│   ├── orb-effects.ts          # Magnetism, section burst, click ripples, animation playback rate (opt-in)
│   ├── series.ts               # Seeded random walk (seed 174) and chart geometry (tested)
│   ├── shortcuts.ts            # D / 0-3 / Esc key mapping (tested)
│   └── scroll-metrics.ts       # One rAF-throttled scroll listener shared by subscribers
└── styles/                     # theme (Tailwind 4 @theme tokens), base, layout, chrome, animations
```

## Key Systems

### 1. Design: Night Paper

Three slow lights sit behind a page typeset like a research paper (serif prose, mono data, ledger entries, hairline rules). Every section and entry pins its own accent hue through a `tone-*` utility, so scrolling never repaints content. Tokens are OKLCH in `@theme` (`theme.css`) with sRGB fallbacks; the accent is `oklch(0.84 calc(0.11 * var(--sat)) calc(var(--hue) + var(--hue-shift)))`.

### 2. Chrome: title bar, status line, console

`ui/top-bar.tsx` is the conventional text menu (Intro, Projects, Experience, Contact) plus the wordmark. `ui/status-line.tsx` is the tmux-style status line: console button (a declarative `popovertarget`, so it works without JS), section tabs, achievement counter, scroll percentage and a 1px progress hairline (CSS `animation-timeline: scroll()` under `@supports`, `--p` otherwise). Both are plain anchors without JS; with JS they run the smooth, locked scroll of `AppShell`. The chrome follows the active scene's hue (`html[data-scene]`).

Keys (`lib/shortcuts.ts`, handled in `AppShell`): `D` toggles the console, `0`-`3` jump to a section, `Esc` closes the console. Modifier combinations and editable targets are ignored.

### 3. Section Navigation

**Implementation**: `src/components/layout/AppShell.tsx`, `src/lib/navigation/`

`AppShell` owns the active section state, derives `html[data-scene]` from it and announces user-initiated jumps (`section-navigate` event, used by the Nav Master and Round Trip achievements). Navigation clicks lock onto the target section until it reaches the viewport, which keeps tabs and keyboard interactions aligned instead of drifting out of sync during smooth scrolling.

### 4. The three lights

**Implementation**: `src/components/shared/AnimatedBackground.tsx`, `src/styles/animations.css`, `src/lib/orb-*.ts`

Three radial-gradient layers (no `filter: blur`, no `backdrop-filter`) move with `transform` and `opacity` only. The composition per section is CSS (`html[data-scene='projects'] .orb-a { --x … }`), the slow drift is a keyframe animation on the inner element, and nothing re-renders while scrolling. Hero is the default composition, so it is also the no-JS and reduced-motion state. Console sliders write CSS custom properties (`--orb-size`, `--orb-opacity`, `--orb-glow`, `--orb-blur`, `--hue-shift`, `--sat`); speed is `playbackRate`. Magnetism, section burst and click ripples are opt-in and drive the same three elements.

### 5. Achievement layer

**Implementation**: `src/components/features/easter-eggs/`

Achievements are unlocked from user behavior, persisted in `localStorage` and reported as a one-line toast that slides out of the status line (`role="status"`). Detection is one hook per achievement under `triggers/`. Everything is dormant until the developer console has been opened once (the flag persists), and the feature is code-split and mounted when the browser is idle.

## Fonts

Fraunces and Martian Mono are subset (Latin + Latin Extended-A) and instanced to the axes the design uses, then loaded with `next/font/local` (`display: swap`, metric-adjusted fallback). Roman and mono are preloaded (about 74 KB together), the italic is not. Regenerate from the OFL variable fonts of the `google/fonts` repo with fontTools:

```bash
U="U+0020-007E,U+00A0-017F,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2192"
python3 -m fontTools.varLib.instancer Fraunces.ttf SOFT=100 WONK=0 wght=300:400 opsz=9:144 -o r.ttf
python3 -m fontTools.varLib.instancer Fraunces-Italic.ttf SOFT=100 WONK=0 wght=300 opsz=24:144 -o i.ttf
python3 -m fontTools.varLib.instancer MartianMono.ttf wdth=87.5 wght=400:600 -o m.ttf
pyftsubset r.ttf --unicodes="$U" --layout-features='kern,liga,ccmp,locl,mark,mkmk' --flavor=woff2 --output-file=fraunces-roman.woff2
```

The two fitted sizes (hero name 5.04em, contact email 8.9em of container width) were measured with these files; re-measure if the font or the copy changes.

## Testing

- `pnpm test` - unit tests for pure logic (colors, settings, URLs, typography).
- `pnpm run test:e2e` - Playwright (desktop, tablet, mobile), including navigation, `lights-and-chart`, `orb-settings` and `easter-eggs` specs.
- `visual-baseline.spec.ts` - local-only screenshot regression (macOS snapshots, skipped in CI). Update intentionally with `pnpm exec playwright test visual-baseline --update-snapshots=all`.
- `docs/PERF-BASELINE.md` - Lighthouse numbers before/after the optimization work.

## Tech Stack Decisions

- **Next.js App Router + RSC** keeps section content server-rendered and limits client code to the orchestration boundary.
- **Single client orchestration boundary** in `AppShell` centralizes section state, navigation locking, and overlays instead of scattering `'use client'` across features. Interaction-only features (developer console, easter eggs) are code-split with `next/dynamic` and mounted when idle.
- **CSS custom properties for runtime theming** let scroll-driven color changes happen without React state churn.
- **Layout differences in CSS, not state**: mobile/desktop/reduced-motion are media queries, never `isMobile` state, so SSR and hydration agree.
- **Tailwind 4 `@theme` tokens + a few component stylesheets** (`layout`, `chrome`, `animations`) keep the design language in CSS custom properties.
