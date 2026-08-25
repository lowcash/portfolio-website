# Portfolio Website – lowcash.dev

Personal developer portfolio with scroll-based navigation, dynamic color theming, and a hidden achievement system.

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

High-level structure, key systems, and architectural decisions live in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Development Setup

```bash
npm install
npm run dev    # http://localhost:3000
```

## Commands

- `npm run dev` starts the local development server.
- `npm run lint` runs ESLint.
- `npm run test:e2e` runs the Playwright end-to-end suite.
- `npm run perf:lighthouse` runs local desktop and mobile Lighthouse audits.

For the full script list, see `package.json`.

## Testing

Three Playwright projects: `desktop-chrome`, `tablet-chrome`, `mobile-safari`.
Tests run against a production preview build on port 3101 to avoid port conflicts.

## Production

Production URL: [https://lowcash.dev](https://lowcash.dev)
Current deployment target: Vercel

**Author**: Lowcash  
**License**: MIT
