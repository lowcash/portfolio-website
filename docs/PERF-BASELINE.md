# Performance baseline

Captured 2026-10-17 on `main` (414d2b6) before the optimization/refactor work. Lighthouse via `npm run perf:lighthouse`.

| Metric         | Desktop | Mobile |
| -------------- | ------- | ------ |
| Performance    | 76      | 77     |
| Accessibility  | 100     | 100    |
| Best practices | 100     | 100    |
| SEO            | 100     | 100    |
| LCP            | 3.3 s   | 3.3 s  |
| FCP            | 1.4 s   | 1.4 s  |
| TBT            | 90 ms   | n/a    |
| CLS            | n/a     | 0.287  |

Other findings: render blocking requests (~560 ms est.), unused JavaScript (~48 KiB est.).
Largest JS chunk: 227 KB (71 KB gzip). Total chunk JS: ~712 KB.

## Visual regression

`tests/e2e/visual-baseline.spec.ts` snapshots 4 sections on desktop, tablet and mobile with animations frozen.
It is local only (macOS snapshots, skipped when `CI` is set). Update intentionally with
`npx playwright test visual-baseline --update-snapshots`.
