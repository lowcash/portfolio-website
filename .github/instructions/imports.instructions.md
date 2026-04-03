---
applyTo: '**/*.{ts,tsx,js,jsx,mjs}'
---

This file owns import path policy for the repository.

- Prefer alias-based absolute imports over deep relative chains.
- Use `@/*` for application code that lives under `src/`.
- Prefer same-folder `./` imports only for tightly local siblings.
- Avoid `../..` chains when an alias import can express ownership more clearly.
- Keep aliases aligned with `tsconfig.json` path mappings (e.g. `@/* -> ./src/*`). When reorganising the project structure, update both the tsconfig paths and all import sites together.
