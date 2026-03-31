---
applyTo: 'app/**/*.{ts,tsx},src/app/**/*.{ts,tsx},src/components/**/*.{ts,tsx},src/lib/**/*.{ts,tsx}'
---

Project structure guidance:

- Keep page-level assembly in server components (`app/page.tsx` or `src/app/page.tsx`) when interactivity is not required.
- Keep document shell, metadata, and global accessibility structure in `layout.tsx`.
- Keep interactive orchestration in focused client leaves; do not let client boundaries bleed into layout or page layers.
- Prefer `src/app` as the standard directory for new or migrated Next.js projects.
- Use `layout`, `shared`, and `features` folders by ownership semantics; do not move files purely to satisfy naming preferences.
- Keep UI primitives in `src/components/ui`; higher layers compose from them and do not re-implement styling.
