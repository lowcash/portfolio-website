---
applyTo: '**/*.{ts,tsx,js,jsx,mjs}'
---

Import policy:

- Prefer alias-based absolute imports over deep relative chains.
- Use `@/*` for application code that lives under `src/`.
- Prefer same-folder `./` imports only for tightly local siblings.
- Avoid `../..` chains when an alias import can express ownership more clearly.
- When migrating Next.js repos to `src/app`, keep aliases aligned with `@/* -> ./src/*`.
