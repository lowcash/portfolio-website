---
applyTo: 'playwright.config.ts,tests/e2e/**/*.ts,package.json'
---

# Testing Workflow (Playwright + Perf Baseline)

## Playwright Project Targeting

- Use only project names declared in `playwright.config.ts`.
- In this repository, valid projects are `desktop-chrome` and `mobile-safari`.
- Do not assume Playwright defaults like `chromium` are valid project names.

## Baseline E2E

- Keep a small baseline suite that validates core navigation and smoke behavior.
- Prefer deterministic tests (no arbitrary sleeps when event-based waiting is possible).
- Keep baseline commands in `package.json` so CI/local use the same flow.

## Accessibility

- Include at least one automated accessibility smoke test on key routes.
- Fail tests on serious/critical WCAG violations; document known exceptions in test comments.

## Motion and Interaction Regressions

- For key interactive elements (for example cards, CTA buttons, toggles), include at least one focused check that hover/focus animations are smooth and time-based, not instant jumps.
- In browser checks, verify computed `transition-property`, `transition-duration`, and `transition-delay` match the properties actually changing (`translate`, `scale`, `opacity`, `box-shadow`, etc.).
- Do not couple reveal delay and hover transition on the same element when this can cause delayed or jumpy interactions; separate reveal wrapper from interactive surface when needed.

## Performance

- Run Lighthouse only against production mode (`npm run build` + `npm run preview`).
- Store machine-readable scores under `test-results/`.
- Keep threshold checks versioned so regressions are caught automatically.
