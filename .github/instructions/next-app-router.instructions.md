---
applyTo: 'app/**/*.{ts,tsx},src/components/**/*.{ts,tsx},src/lib/**/*.{ts,tsx}'
---

# Next.js App Router Implementation (Next.js 16+)

This file is intentionally reusable across Next.js projects; keep repo-specific conventions concise and explicit.

**Note**: Update version references (`16+`, `17+`, etc.) when the project upgrades.

## App Router Boundaries

### Document shell (`app/layout.tsx`)

- Define `<html>`, `<head>`, and `<body>`.
- Import global CSS once at the root layout.
- Export static `metadata` when values are stable.
- Keep this layer server-only: no hooks, no event handlers, no browser APIs.

### Page assembly (`app/page.tsx` and route pages)

- Default to server components.
- Compose feature sections and layout wrappers.
- Fetch data here (or in server components) when needed.
- Avoid local interactive UI state in server pages.

## Client Orchestration

- Prefer the smallest client boundary needed for interactivity.
- This repository currently uses a single client orchestrator (`src/components/layout/AppShell.tsx`) for engine state.
- Keep listener cleanup strict and debounce high-frequency work with `requestAnimationFrame`.
- Pass derived state down as props instead of duplicating global listeners.

## Metadata and SEO

- Keep `metadata` static unless route-dependent values require `generateMetadata`.
- Use file conventions for social images: `opengraph-image.tsx` and `twitter-image.tsx`.
- Keep JSON-LD in root layout via `application/ld+json` script when needed.
- If Twitter/X is not actively used, omit `twitter` metadata fields.

## Server Actions and Fullstack Boundaries

- Use server actions (`'use server'`) for authenticated mutations and server-side writes.
- Validate action input at the boundary and return typed results.
- Keep secrets, database access, and privileged logic server-only.
- Use route handlers for public HTTP endpoints, webhooks, or integrations.
- Avoid duplicating mutation logic between client fetch calls and server actions.

## Styling in App Router

- Import global CSS only in `app/layout.tsx`.
- Keep global style modules under `src/styles/`.
- Use CSS variables for frequently changing visual values.
- Keep styling decisions in UI primitives; feature components should compose those primitives.

## Performance Guardrails

- Keep client JavaScript minimal; default to server components.
- Avoid duplicate global listeners for the same signal (scroll/resize/pointer).
- Use shared metrics managers or centralized subscriptions for high-frequency events.
- Respect `prefers-reduced-motion` and avoid unnecessary animation work.
- Measure performance in production mode (`npm run build` + `npm run preview`) before diagnosing regressions.

## Imports

Import path ownership rules are defined in `imports.instructions.md`.
