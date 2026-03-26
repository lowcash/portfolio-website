# Clean Code Guardrails

## Goal

Keep architecture consistent, remove dead code continuously, and prevent styling drift.

## 1) Unused Code Detection

Use Knip as a periodic architecture audit:

- `npm run analyze:unused`
- `npm run analyze:unused:json`

This checks:

- Unused dependencies from `package.json`
- Unused exports and files
- Entry-point reachability issues

Recommended workflow:

1. Run `npm run analyze:unused:json` and inspect `test-results/knip-report.json`
2. Remove unused code in small PRs
3. Re-run e2e and Lighthouse baseline after each cleanup

## 2) Styling Boundary Detection

Use the style-boundary analyzer:

- Report mode: `npm run analyze:style-boundary`
- Gate mode: `npm run analyze:style-boundary:strict`
- Changed files (report): `npm run analyze:style-boundary:changed`
- Changed files (strict, incremental): `npm run analyze:style-boundary:changed:strict`

In incremental strict mode, only violations introduced on added lines in the git diff against base ref are enforced.

Optional CI usage against main branch:

- `node ./scripts/analyze-style-boundary.mjs --changed --strict --base=origin/main...HEAD`

Policy target:

- Styling implementation should live in `src/components/ui`
- `features`, `layout`, and `shared` should prefer composing UI components instead of defining raw styles

## 3) Is "No className/style outside ui" a good idea?

Yes as a direction, but enforce it in phases:

1. **Phase A (now):** report-only
2. **Phase B:** strict mode for new/changed files (`analyze:style-boundary:changed:strict`)
3. **Phase C:** full strict mode for the whole codebase

Why phased:

- Avoid massive disruptive refactor in one shot
- Keep velocity while reducing debt steadily
- Protect UX with existing e2e and Lighthouse checks

## 4) Migration Recommendation For All 3 Projects

After portfolio stabilizes, apply the same guardrails to:

- `zive-sklo-website`
- `massage-website`

Use the same sequence: baseline tests -> report analyzers -> incremental cleanup -> strict mode.