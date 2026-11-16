# Performance baseline

Captured 2026-10-17 on `main` (414d2b6) before the optimization/refactor work. Lighthouse via `pnpm run perf:lighthouse`.

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
`pnpm exec playwright test visual-baseline --update-snapshots`.

## After block B (background rewrite, code splitting, font fix)

| Metric      | Desktop | Mobile |
| ----------- | ------- | ------ |
| Performance | 78      | 92     |
| LCP         | 3.3 s   | 3.3 s  |
| FCP         | 1.2 s   | 1.2 s  |
| TBT         | 70 ms   | 40 ms  |
| CLS         | 0       | 0      |

- Mobile CLS 0.287 -> 0: orb layout is now CSS-first, so SSR HTML equals the hydrated layout.
- Initial JS 696 KB -> 647 KB raw (developer console and easter eggs are code-split and mounted when idle).
- Scrolling no longer re-renders React; colors are written to CSS custom properties from one rAF loop.
- Fixed a bug where the background color easing stopped after one frame and stayed stale at rest.
- Hero heading needs the Inter latin-ext subset ("š"); it is now preloaded.
- Lighthouse runs with `--disable-gpu`, so the large blurred orbs rasterize on the CPU. The reported LCP is mostly that
  artifact (unthrottled LCP is ~0.2 s); hiding the orbs entirely only moves it to 2.9 s.

## After the Night Paper redesign (2026-11)

Same machine and `scripts/run-lighthouse.mjs` as above; wave-1 baseline measured side by side on the same load.

| Metric      | Wave 1 desktop | Night Paper desktop | Wave 1 mobile | Night Paper mobile |
| ----------- | -------------- | ------------------- | ------------- | ------------------ |
| Performance | 77             | 80                  | 92            | 95-99              |
| LCP         | 3.6 s          | 3.0 s               | 3.3 s         | 2.1-3.0 s          |
| FCP         | 1.2 s          | 1.2 s               | 1.2 s         | 0.8-1.2 s          |
| CLS         | 0              | 0                   | 0             | 0                  |

- Fonts were the cost: stock Google Fraunces (roman latin + latin-ext, italic) was about 415 KB before first paint and
  gave FCP 2.0 s, LCP 4.4 s and mobile CLS 0.25. Subsetting and instancing brought it to about 74 KB preloaded.
- No `filter: blur`, no `backdrop-filter`; three gradient layers animate transform and opacity only.
