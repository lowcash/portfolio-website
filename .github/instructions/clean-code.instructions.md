---
applyTo: '**/*.{ts,tsx,js,jsx,mjs,json,css}'
---

# Clean Code Guardrails

## Dead Code

- Detect unused exports, imports, and types with Knip (`npm run analyze:unused` / `knip --strict`).
- Remove dead code incrementally in small, safe commits — never suppress or ignore Knip errors.
- Do not add new exports "for later" — add them when they are consumed.

## Styling Boundary

- Raw class definitions and styling decisions live in `src/components/ui/` (or your project's ui layer).
- Feature components compose UI primitives — they do not define raw `className` styling.
- CSS custom properties (variables) for runtime-dynamic values (colors, animations); avoid React state for frequently-updated visuals.

## Refactoring Discipline

- Prefer **migration-first** fixes: update the code, then remove the old path. Never suppress type errors or lint rules as a shortcut.
- Keep refactors **incremental and reviewable**: one concern per commit. Avoid broad renames mixed with logic changes.
- Preserve existing UX behaviour while restructuring. Refactors must not change observable behaviour unless that is the stated goal.

## Suppression Rules

- `// eslint-disable`, `@ts-ignore`, `@ts-expect-error` require a comment explaining why.
- Never use `any` as a type unless bridging an untyped third-party boundary — document the reason.
- Do not use `!` (non-null assertion) when a null check is feasible.

## General

- Logic that is used once does not need a helper or abstraction.
- Do not add docstrings, comments, or type annotations to code you did not change.
- Do not add error handling for scenarios that cannot happen at a given system boundary.
