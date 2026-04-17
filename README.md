# Portfolio Website — lowcash.dev

Personal developer portfolio with scroll-based navigation, parallax effects, dynamic color theming, and a hidden achievement system.

## Tech Stack

| Tool         | Version | Purpose                           |
| ------------ | ------- | --------------------------------- |
| Next.js      | 16      | SSR framework (App Router)        |
| React        | 19      | UI layer (React Compiler enabled) |
| TypeScript   | 5       | Type safety                       |
| Tailwind CSS | 4       | Utility-first styling             |
| Lucide React | 0.487   | Icons                             |
| Knip         | 6       | Dead code detection               |
| Playwright   | 1       | End-to-end tests                  |
| Lighthouse   | 12      | Performance baseline              |

## Architecture

High-level structure, component ownership, and runtime notes live in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Development Setup

```bash
npm install
npm run dev    # http://localhost:3000
```

No environment variables are required for local development.
Vercel Analytics is optional and activates only when the app runs in a Vercel environment.

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

## Production

Production URL: [https://lowcash.dev](https://lowcash.dev)
Current deployment target: Vercel

---

**Author**: Lowcash  
**License**: MIT
