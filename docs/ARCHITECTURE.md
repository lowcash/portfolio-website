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
│   ├── features/               # Sections (Hero, FeaturedProjects, Experience, Contact), server components
│   │   ├── devtools/           # console-pane (popover shell), console-controls (lazy), console-actions, use-console-stats
│   │   └── easter-eggs/        # EasterEggs state, achievement toast, achievements data, confetti, triggers/ (one hook per egg)
│   ├── shared/                 # AnimatedBackground (three lights + grain)
│   ├── ui/                     # entry, section-header (index, eyebrow, title), top-bar, status-line
│   └── layout/                 # AppShell client orchestration
├── hooks/                      # use-idle-ready
├── lib/
│   ├── navigation/             # Section hash/URL helpers, scroll spy, useActiveSection
│   ├── content.ts              # All copy, section ids/scenes/tones, entry tones
│   ├── orbs/                   # The lights: settings.ts (definitions, presets, persistence, CSS variables), physics.ts (pure spring maths), effects.ts (the single rAF loop) - all tested but effects
│   ├── shortcuts.ts            # D / 0-3 / Esc key mapping (tested)
│   └── scroll-metrics.ts       # One rAF-throttled scroll listener shared by subscribers
└── styles/                     # theme (Tailwind 4 @theme tokens), base, layout, chrome, animations
```

## Key Systems

### 1. Design: Night Paper

Three slow lights sit behind a page typeset like a research paper (serif prose, mono data, ledger entries, hairline rules). Every section and entry pins its own accent hue through a `tone-*` utility, so scrolling never repaints content. Tokens are OKLCH in `@theme` (`theme.css`) with sRGB fallbacks; the accent is `oklch(0.84 calc(0.11 * var(--sat)) calc(var(--hue) + var(--hue-shift)))`.

### 2. Chrome: title bar, status line, console

`ui/top-bar.tsx` is the conventional text menu (Intro, Projects, Experience, Contact) plus the wordmark. Below 48rem it is compact: wordmark and a `Menu` button (`aria-expanded`, closes on `Esc`, a link or the console entry) that opens a full-width list under the bar (links and the dev console entry, 48px rows); from 48rem the menu is inline. `ui/status-line.tsx` is the tmux-style status line: console button (a declarative `popovertarget`, so it works without JS), section tabs, achievement counter, scroll percentage (no progress line: nothing sweeps on scroll). Both are plain anchors without JS; with JS they run the smooth, locked scroll of `AppShell`. The chrome follows the active scene's hue (`html[data-scene]`).

Keys (`lib/shortcuts.ts`, handled in `AppShell`): `D` toggles the console, `0`-`3` jump to a section, `Esc` closes the console. Modifier combinations and editable targets are ignored.

The console is discoverable without being loud: a `D dev console` button in the top bar (from 768px), a small `D` key cap on the status-line `>_ dev` button (only where there is a keyboard, `hover: hover` and `pointer: fine`), the `>_ Dev Console` hero action, a line in the contact section, and `aria-keyshortcuts`. On touch the status-line `>_` button and the hero action open it (four fingers still work). It is a modal-style dialog (`role='dialog'`, `aria-modal`, a popover under the hood): focus moves into it on open, Tab and Shift+Tab cycle inside it, a Tab from focus that wandered out is pulled back, `Esc` or the close button close it and focus returns to what opened it.

### 3. Section Navigation

**Implementation**: `src/components/layout/AppShell.tsx`, `src/lib/navigation/`

`AppShell` owns the active section state, derives `html[data-scene]` from it and announces user-initiated jumps (`section-navigate` event, used by the Nav Master and Round Trip achievements). Navigation clicks lock onto the target section until it reaches the viewport, which keeps tabs and keyboard interactions aligned instead of drifting out of sync during smooth scrolling.

### 4. The three lights

**Implementation**: `src/components/shared/AnimatedBackground.tsx`, `src/styles/animations.css`, `src/lib/orbs/settings.ts`, `src/lib/orbs/physics.ts`, `src/lib/orbs/effects.ts`

Three radial-gradient layers (no `filter: blur`, no `backdrop-filter`) move with `transform`, `translate` and `opacity` only. There is no per-section composition (lights never travel on scroll); the subconscious drift is two keyframe animations per light on the inner element (`translate` for x, `transform` for y and a 2-3% breathing scale, both `ease-in-out`, so sine-like with no jumps): periods 64/88 s (A), 76/52 s (B), 90/70 s (C), travel +-3 to 3.5% of the viewport on each axis (measured in `orb-stability.desktop.spec.ts`: 3.0-3.5% horizontal, 2.7-3.0% vertical, at most about 6 px per second). It is compositor-only, so it stays on for phones, and it is absent under `prefers-reduced-motion`; opacity changes ease over 12 s, and nothing re-renders while scrolling. Hero is the default composition, so it is also the no-JS and reduced-motion state. The default look is deliberately calm: peak gradient alpha 0.055, OKLCH chroma 0.08-0.13, lights 64vmax wide, plus a faint `.orb-ambient` wash that breathes over 120 s, a gaussian-like seven-stop falloff with no visible edge.

**Physics** (`orbs/effects.ts`, maths in `orbs/physics.ts`): one `requestAnimationFrame` loop drives a damped spring per light (stiffness 16, about 0.64 Hz). The target of each spring is the cursor push (lights give way to the pointer, the far light less) plus the scroll parallax (the lights trail the scroll position); a click on the background adds a velocity kick away from it (not on links, buttons or inputs). Displacement is bounded to 90 px, integration uses fixed 1/120 s sub-steps (frame-rate independent) and only `translate` is written (skipped below 0.01 px). The loop sleeps when all springs are at rest, stops while the tab is hidden and is not started at all under `prefers-reduced-motion` or on coarse pointers (`(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)`, followed live), where the lights just drift. The lights are `position: fixed`, so there is no "section offscreen" state; sleeping at rest is the equivalent.

**Control audit** (every control in the dev console, what it changes and the default; each has a Playwright proof in `tests/e2e/orb-settings.desktop.spec.ts`):

| Control (key)                  | Effect (code path)                                                                           | Default | Range    | Visible proof                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------- |
| Drift speed (`animationSpeed`) | `playbackRate` of the six `drift-*` CSS animations (`startAnimationRate`)                    | 1.0x    | 0.2-3    | test reads `playbackRate` 3 on all six animations          |
| Size (`orbSize`)               | `--orb-size` -> `scale()` of `.orb`                                                          | 1.00x   | 0.5-1.6  | bounding width grows >1.4x, survives reload                |
| Intensity (`orbOpacity`)       | `--orb-opacity` -> element `opacity` (capped at 1) and, above 100%, gradient alpha via `--k` | 100%    | 0-200%   | computed opacity 0 at 0%, gradient changes at 200%         |
| Softness (`orbBlur`)           | `--orb-blur` -> `--orb-core`, the position of the first gradient stop (0 = pure haze)        | 1.00x   | 0.1-1    | first stop moves to 80% at 0.2x                            |
| Hue shift (`hue`)              | `--hue-shift` -> OKLCH hue of the lights and of the accent (status line, chrome)             | 0 deg   | 0-360    | accent colour and gradient string change                   |
| Saturation (`saturation`)      | `--sat` -> OKLCH chroma of the lights and the accent                                         | 100%    | 0-200%   | accent becomes grey at 0%, gradient chroma 0               |
| Pointer push (`pointer`)       | spring target = -pointer x reach (50 px x strength x depth)                                  | 20%     | 0-100    | light offset < -30 px at 100%, back to 0 at 0%             |
| Spring damping (`damping`)     | damping ratio of every spring (stiffness fixed)                                              | 0.90x   | 0.15-1.5 | 0.15 overshoots the target by > 6 px, 1.5 does not         |
| Scroll parallax (`parallax`)   | spring target y = (0.5 - scroll progress) x 2 x reach (56 px x strength x depth)             | 10%     | 0-100    | light shifts > 40 px between top and bottom, 0 at 0%       |
| Click nudge (`nudge`, switch)  | velocity kick of 180 px/s away from a click on the background                                | ON      | off/on   | offset peaks > 8 px after a click, not after a control hit |

The pointer, damping, parallax and nudge controls are disabled (with a hint) where the physics are off (touch, reduced motion). Every physics change plays a short demo shove so the effect is visible without moving the cursor. Removed in the audit: **Glow** (multiplied the same gradient alpha as Intensity, a duplicate), **Magnetism** (replaced by Pointer push; it wrote CSS variables on `:root` every frame and used device tilt on phones), **Section burst** (a scale pulse that only fired on a section change and competed with the scene transition) and **Click ripples** (an accent-coloured ring, flashy; the nudge keeps the click interaction without it). Presets: Calm (default), Still (35% intensity, 0.2x drift, no physics), Lively (140% intensity, 3x drift, loose spring), Vivid (the old louder look), Mono (no colour, 150%). The console shows a live note under the presets (what the hovered or active preset does and which values it moves); `tests/e2e/devtools-lights-visible.desktop.spec.ts` measures every preset and every slider extreme as a pixel difference of the strip above the open console. The defaults were lowered in the second calm pass (alpha 0.34 to 0.24, drift travel halved, spring stiffness 28 to 16, pointer and parallax strength 50% to 30%, damping 0.7 to 0.9) so the lights read as barely-there ambient light.

Contrast: text over the lights is measured on real pixels in `tests/e2e/orb-contrast.desktop.spec.ts` (all four scenes, the lights at rest and pushed 90 px into each corner, 1440 and 390 wide); the worst case at 100% intensity is 6.09:1 (needs 4.5), including the dimmed inactive sections (their opacity is multiplied into the text alpha in the test). Above 100% intensity the guarantee does not hold, which the slider hint says.

### 5. Achievement layer

**Implementation**: `src/components/features/easter-eggs/`

Achievements are unlocked from user behavior, persisted in `localStorage` and reported as a one-line toast that slides out of the status line (`role="status"`). Detection is one hook per achievement under `triggers/`. Everything is dormant until the developer console has been opened once (the flag persists), and the feature is code-split and mounted when the browser is idle. The collection is the tile grid in the console (hover, focus or tap a tile for its hint), the status-line counter (a button that opens the console; hidden on phones) and the toast, which carries the progress (`· 3/16`). `achievements.test.ts` checks that every achievement has a hint and a trigger in code; `easter-eggs*.spec.ts` trigger every one of them (desktop) and the touch ones on a phone viewport.

## Fonts

Fraunces and Martian Mono are subset (Latin + Latin Extended-A) and instanced to the axes the design uses, then loaded with `next/font/local` (`display: swap`, metric-adjusted fallback). Roman and mono are preloaded (about 74 KB together), the italic is not. Regenerate from the OFL variable fonts of the `google/fonts` repo with fontTools:

```bash
U="U+0020-007E,U+00A0-017F,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2192"
python3 -m fontTools.varLib.instancer Fraunces.ttf SOFT=100 WONK=0 wght=300:400 opsz=9:144 -o r.ttf
python3 -m fontTools.varLib.instancer Fraunces-Italic.ttf SOFT=100 WONK=0 wght=300 opsz=24:144 -o i.ttf
python3 -m fontTools.varLib.instancer MartianMono.ttf wdth=87.5 wght=400:600 -o m.ttf
pyftsubset r.ttf --unicodes="$U" --layout-features='kern,liga,ccmp,locl,mark,mkmk' --flavor=woff2 --output-file=fraunces-roman.woff2
```

## Type and orientation

The scale is deliberately restrained and lives in `theme.css`: body 17px, lead 18-21px, h3 20-26px, h2 32-52px, hero name 44-96px (fluid, one line from about 390px up), aside 18-24px and 22-32px (`--text-aside`, `--text-aside-lead`), contact email up to 52px (one colour, the link colour), mono 13px. Running text is capped at `--text-measure` (68ch). The hero is name, one-line role, stack and two actions (See projects, Dev Console); there is no chart there, because a seeded random walk carried no information. Each section opens with a rule, an index (01-03), an eyebrow ("Selected work", "Roles and education", "Get in touch") and the h2; the top bar and the status line both mark the active section with `aria-current`.

**Section orientation on scroll** (`layout.css`, end of file): the active section (`html[data-scene]`, set by `AppShell`) rests at full strength, the other sections sit at `--dim-inactive` (0.82) opacity, the active section's index number turns accent (the others are `ink-3`). Only opacity and colour change (0.9 s fade, none under `prefers-reduced-motion`), so there is no layout shift; without JavaScript there is no `data-scene` and nothing is dimmed. Text in dimmed sections is still AA (see Contrast above).

## Layout system

One grid, defined in `base.css` and used by every section (hero, section heads, entries, aside, contact): `.wrap.grid-12` is 12 columns with the page gutter. The **rail** (`.l-rail`, columns 1-2) holds the index (00-03), entry number and badge; the **content column** (`.l-col`, columns 3-12) holds everything else; entries split it into **main** (`.l-main`, 3-7) and **detail** (`.l-detail`, 8-12) from 64rem (the lead project spans 3-12). Below 48rem everything is one column on the gutter. Vertical rhythm is `--s-5` inside a block and `--s-6` and up between blocks. Lists have exactly two patterns: `.tags` (hairline chips for short facts: stack, technologies) and `.rows` (a hairline marker in a fixed 1.5rem gutter, then the text; used for bullets, sites, degrees and the contact lines), and meta facts are spans with a gap, never separated by slashes, dots or dashes. `tests/e2e/grid-alignment.desktop.spec.ts` measures the left edges of comparable elements in all sections at 1440, 1280, 834 and 390px and asserts they are equal (tolerance 1px).

## Testing

- `pnpm test` - unit tests for pure logic (colors, settings, URLs, typography).
- `pnpm run test:e2e` - Playwright (desktop, tablet, mobile), including navigation, `lights-and-hero`, `orb-settings` (one proof per control plus the rAF cost), `orb-contrast`, `grid-alignment`, `section-orientation` and `easter-eggs` specs.
- `visual-baseline.spec.ts` - local-only screenshot regression (macOS snapshots, skipped in CI). Update intentionally with `pnpm exec playwright test visual-baseline --update-snapshots=all`.
- `docs/PERF-BASELINE.md` - Lighthouse numbers before/after the optimization work.

## Tech Stack Decisions

- **Next.js App Router + RSC** keeps section content server-rendered and limits client code to the orchestration boundary.
- **Single client orchestration boundary** in `AppShell` centralizes section state, navigation locking, and overlays instead of scattering `'use client'` across features. Interaction-only features (developer console, easter eggs) are code-split with `next/dynamic` and mounted when idle.
- **CSS custom properties for runtime theming** let scroll-driven color changes happen without React state churn.
- **Layout differences in CSS, not state**: mobile/desktop/reduced-motion are media queries, never `isMobile` state, so SSR and hydration agree.
- **Tailwind 4 `@theme` tokens + a few component stylesheets** (`layout`, `chrome`, `animations`) keep the design language in CSS custom properties.
