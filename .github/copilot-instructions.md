# Copilot Instructions

Use this repository's `.github` customization stack as the primary active guidance layer.

## Tech Stack

Current versions in use (update line items as your project upgrades):

- **Framework**: Next.js 16+ (App Router)
- **UI Framework**: React 19+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+
- **Testing**: Playwright E2E

**Note**: Update version references in this file and `.github/instructions/next-app-router.instructions.md` when major versions change.

## Foundational Guidance

- `.github/instructions/next-app-router.instructions.md` - Next.js App Router rules: boundaries, metadata, server actions
- `.github/instructions/architecture.instructions.md` - Stack-agnostic component layering, state boundaries, styling ownership
- `.github/instructions/clean-code.instructions.md` - Refactoring discipline, suppression rules, dead-code removal
- `.github/instructions/imports.instructions.md` - Alias and import ownership policy
- `docs/ARCHITECTURE.md` - Full system design and rationale

## Repository Notes

- React Compiler is enabled in `next.config.mjs`; keep `babel-plugin-react-compiler` in devDependencies.
- Playwright projects are `desktop-chrome` and `mobile-safari`.
