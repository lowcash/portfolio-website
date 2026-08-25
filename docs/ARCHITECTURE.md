# Project Architecture

## Overview

Portfolio Website is a Next.js App Router portfolio focused on server-rendered content, section-based navigation, lightweight client interactivity, and dynamic visual theming.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Document shell
│   └── page.tsx                # Server-side section assembly
├── components/
│   ├── features/               # Content modules (Hero, FeaturedProjects, BackgroundExperience, etc.)
│   │   └── devtools/
│   │       └── DeveloperConsole.tsx
│   ├── shared/                 # Cross-feature utilities
│   ├── ui/                     # Navigation, progress, overlay primitives
│   └── layout/                 # AppShell client orchestration
├── lib/                        # Navigation helpers, constants, utilities
└── styles/                     # Tokens, typography, animations
```

## Key Systems

### 1. Section Navigation

**Implementation**: `src/components/layout/AppShell.tsx`, `src/components/ui/scroll-navigation.tsx`

`AppShell` owns the active section state and updates navigation UI from scroll position. Navigation clicks lock onto the target section until it reaches the viewport, which keeps dots, drawers, and keyboard interactions aligned instead of drifting out of sync during smooth scrolling.

### 2. Achievement Layer

**Implementation**: `src/components/ui/easter-eggs.tsx`

Achievements are unlocked from user behavior such as scroll milestones and shortcuts, persisted in `localStorage`, and rendered as a lightweight overlay tied to the current section theme.

### 3. Dynamic Visual Theming

**Implementation**: `src/components/shared/AnimatedBackground.tsx`, `src/styles/*.css`

Section changes update CSS custom properties (`--orb-r`, `--orb-g`, `--orb-b`) instead of React state. Background orbs, highlights, and motion styling all consume the same theme values without paying a per-scroll re-render cost.

## Tech Stack Decisions

- **Next.js App Router + RSC** keeps section content server-rendered and limits client code to the orchestration boundary.
- **Single client orchestration boundary** in `AppShell` centralizes section state, navigation locking, and overlays instead of scattering `'use client'` across features.
- **CSS custom properties for runtime theming** let scroll-driven color changes happen without React state churn.
- **Tailwind CSS + small CSS modules** split layout utilities from tokens and animation rules.
