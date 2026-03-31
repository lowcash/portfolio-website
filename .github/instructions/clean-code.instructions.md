---
applyTo: '**/*.{ts,tsx,js,jsx,mjs,json,css}'
---

Follow the clean-code guardrails from `.github/reference/CLEAN_CODE_GUARDRAILS.md`.

Enforcement intent:

- Keep dead-code auditing with Knip (`analyze:unused`, strict mode in gated flows).
- Keep styling boundary discipline: raw styling should primarily live in `src/components/ui`.
- Prefer incremental, migration-first refactors and avoid broad suppression patterns.
- Preserve existing UX behavior while refactoring for ownership and cohesion.
