# Copilot Instructions

Use the `.github` instruction stack in this repository as the primary active guidance layer, not as optional suggestions.

Required references:

- `.github/instructions/architecture.instructions.md` – app/component layering, RSC boundaries
- `.github/instructions/clean-code.instructions.md` – styling boundaries, dead-code auditing, refactoring patterns
- `.github/instructions/imports.instructions.md` – import organization, alias-based paths
- `.github/instructions/project-structure.instructions.md` – project layout, directory conventions, RSC boundaries
- `docs/ARCHITECTURE.md` – full system design, tech stack, performance notes

Core expectations:

- Prefer migration-first fixes over suppression or rule bypasses.
- Prefer alias-based absolute imports (`@/*`) over deep relative chains.
- Keep style implementation inside `src/components/ui`; higher-level layers should compose UI primitives.
- Preserve RSC-first boundaries in App Router (`app/page.tsx` server assembly, `app/layout.tsx` document shell, `app/client-chrome.tsx` interactive client orchestration).
- Prefer `src/app` as the standard layout for new or migrated Next.js projects.
- Remove dead code in small safe increments and validate with existing analyzers/scripts.
