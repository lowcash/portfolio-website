# Portfolio Website — lowcash.dev

Personal developer portfolio with scroll-based navigation, parallax effects, dynamic color theming, and a hidden achievement system.

## Tech Stack

| Tool         | Version | Purpose                           |
| ------------ | ------- | --------------------------------- |
| Next.js      | 16      | SSR framework (App Router)        |
| React        | 19      | UI layer (React Compiler enabled) |
| TypeScript   | 5       | Type safety                       |
| Tailwind CSS | 4       | Utility-first styling             |
| Lucide React | —       | Icons                             |
| Knip         | 6       | Dead code detection               |
| Playwright   | 1       | End-to-end tests                  |
| Lighthouse   | 12      | Performance baseline              |

## Project Structure

```
src/
  app/                  # Next.js App Router (layout, page)
  components/
    shared/             # Reusable components (DevTools, ScrollNav …)
    ui/                 # Base UI primitives
  hooks/                # Custom React hooks
  lib/                  # Utilities and constants
  styles/               # Modular CSS architecture
    globals.css         # Entry point (orchestrates all modules)
    theme.css           # Design tokens and CSS variables
    typography.css      # Font scale and heading styles
    base.css            # HTML/body reset, scroll behavior
    accessibility.css   # Focus styles, skip-to-content
    animations.css      # Keyframes and animation utilities
  assets/               # Static assets
tests/e2e/              # Playwright end-to-end tests
```

## Development Setup

```bash
npm install
npm run dev    # http://localhost:3000
```

No environment variables are required for local development.
This project uses Vercel Analytics, which activates automatically on Vercel deployments.

## Commands

| Command                            | Purpose                              |
| ---------------------------------- | ------------------------------------ |
| `npm run dev`                      | Start dev server (port 3000)         |
| `npm run build`                    | Production build                     |
| `npm run preview`                  | Serve production build locally       |
| `npm run lint`                     | ESLint                               |
| `npm run typecheck`                | TypeScript check                     |
| `npm run format`                   | Prettier                             |
| `npm run analyze:unused`           | Knip dead-code report                |
| `npm run analyze:style-boundary`   | Style boundary analysis              |
| `npm run test:e2e`                 | Run all Playwright tests             |
| `npm run test:e2e:baseline`        | Smoke + navigation tests (CI subset) |
| `npm run perf:lighthouse:baseline` | Build + Lighthouse + threshold check |

## Testing

Three Playwright projects: `desktop-chrome`, `tablet-chrome`, `mobile-safari`.
Tests run against a production preview build on port 3101 to avoid port conflicts.

```bash
npm run test:e2e
npm run test:e2e:ui   # interactive UI mode
```

## Deployment

Deployed on Vercel. Push to `main` triggers automatic deployment.
Live URL: [https://lowcash.dev](https://lowcash.dev)

---

**Author**: Lowcash  
**License**: MIT
