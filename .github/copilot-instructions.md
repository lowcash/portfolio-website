# Copilot Instructions

Use the `.github` instruction stack in this repository as the primary active guidance layer, not as optional suggestions.

## Tech Stack

Current versions in use (update line items as your project upgrades):

- **Framework**: Next.js 16+ (App Router)
- **UI Framework**: React 19+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+
- **Testing**: Playwright E2E

**Note**: Always update version references in `.copilot-instructions.md` and `.github/instructions/next-app-router.instructions.md` when major versions change.

## Required References

- `.github/instructions/next-app-router.instructions.md` – App Router boundaries, client/server split, metadata
- `.github/instructions/architecture.instructions.md` – Component layering, state boundaries, styling strategy
- `.github/instructions/clean-code.instructions.md` – Code quality, dead-code auditing
- `.github/instructions/imports.instructions.md` – Import organization and alias usage
- `docs/ARCHITECTURE.md` – System design and styling architecture

## Core Expectations

- **Prefer migration-first fixes** over suppression or rule bypasses
- **Prefer alias-based imports** (`@/*`) over deep relative chains
- **Keep styling** inside `src/styles/` as modular files
- **Use CSS variables** for dynamic styling (colors, animations) instead of React state
- **Remove dead code** incrementally and validate with existing analyzers
- **RSC-first flow**: `app/layout.tsx` (document shell) → `app/page.tsx` (server assembly) → client orchestration layer

## Style Architecture

CSS organized into logical modules with a single entry point:

```
[project]/styles/
├── globals.css[.ts]     ← Entry point (@imports or main stylesheet)
├── theme.css            ← Design tokens, color palette, CSS variables
├── typography.css       ← Font scale, heading styles (optional)
├── base.css             ← HTML/body reset, accessibility helpers, scroll behavior
├── accessibility.css    ← Focus states, skip-to-content, sr-only
└── animations.css       ← @keyframes, animation utilities
```

**Import location**:

- Import global CSS once in `app/layout.tsx` → `import '../styles/globals.css'`

## Standards

- **Component naming**: PascalCase (`.tsx`)
- **Utilities**: camelCase (`.ts`)
- **Styles**: kebab-case (`.css`)
- **Hooks**: `use*` prefix (camelCase)
- **Import order**: External → `@/` aliases → relative (rare)
- **Formatting**: Prettier automatic format (run `npm run format` before commit)
