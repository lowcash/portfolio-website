## Plan: Cross-Project Clean Code Baseline

Unify code-quality and architecture conventions across portfolio-website, massage-website, and zive-sklo-website by first fixing TypeScript and formatting/tooling issues, then standardizing repository conventions, and finally codifying guidance so GitHub Copilot applies it consistently. The recommended approach is migration-first (no silencing), minimal structural churn in portfolio (keep proven layout), and explicit Copilot instructions referencing your guardrails and onepager blueprint.

**Steps**

1. Phase 1: Toolchain baseline and migration-first fixes.
2. Standardize Prettier import sorting in all three repos using one canonical config (recommended source: zive-sklo-website), including plugin set and import ordering rules, then run format:check in each repo. _parallel with step 3_
3. Fix TypeScript warnings in portfolio-website by migration, not suppression: remove deprecated baseUrl usage, migrate moduleResolution to bundler, and set composite: true in referenced project configs. Then validate with tsc/noEmit and Next build. _parallel with step 2_
4. Decide and apply Knip schema strategy across repos: either trust external schema host in editor settings or remove $schema for portable CI/editor behavior. Recommended default: remove $schema from knip.json files to avoid editor trust friction. _depends on 2_
5. Phase 2: Package manifest normalization across projects.
6. Normalize Next.js app package.json conventions: keep private: true for non-published repos, remove main from app repos, and align type/module policy consistently (or explicitly document exceptions). Re-run npm install and analyzer scripts afterward. _depends on 3_
7. Validate dead-code workflow policy: keep knip as primary dead-code audit tool, define strict-vs-report usage per environment (local report, CI strict on changed scope), and capture this policy in repo docs. _depends on 4_
8. Phase 3: Portfolio architecture and CSS decisions.
9. Perform classification audit in portfolio for layout/shared/features without forced deletion: keep layout for page-level orchestration, keep shared for cross-feature primitives, and classify DebugInfo as devtools/layout concern unless product scope changes. Introduce targeted moves only when ownership is clearly wrong. _depends on 7_
10. Rationalize constants strategy in portfolio: retain one central constants file for app-wide values and add feature-local constants files only for high-cohesion domains; avoid scattering global constants. _parallel with step 9_
11. Audit CSS layering in portfolio: keep src/styles/globals.css as authored styles and treat src/index.css as generated Tailwind output artifact. Decide if generated file should be committed or generated in pipeline, then enforce one policy. _depends on 9_
12. Confirm app/page.tsx, app/layout.tsx, and app/client-chrome.tsx responsibilities with an RSC-first rule: server assembly in app/page.tsx, metadata/a11y shell in app/layout.tsx, and interactive chrome only in client-chrome.tsx. Keep client-chrome.tsx unless interaction is split into smaller client leaves. _depends on 9_
13. Phase 4: Copilot activation and reusable guidance.
14. Create shared Copilot instruction files that map your docs into active behavior: workspace instructions plus file-scoped instructions for onepager architecture and clean-code guardrails. Add clear trigger language and applyTo globs so guidance loads predictably. _depends on 7_
15. Add optional reusable templates/prompts for Next.js onepager and Next.js fullstack flows; provide a framework-agnostic core variant for Vite projects so principles are reusable beyond Next.js. _depends on 14_

**Relevant files**

- /Users/lowcash/repos/portfolio-website/tsconfig.json — migrate deprecated TS options and keep alias behavior modern.
- /Users/lowcash/repos/portfolio-website/tsconfig.app.json — enable composite for project references.
- /Users/lowcash/repos/portfolio-website/package.json — keep analyzer/format scripts consistent with migrated config.
- /Users/lowcash/repos/portfolio-website/knip.json — apply schema trust strategy.
- /Users/lowcash/repos/massage-website/package.json — preserve private app status and align manifest conventions.
- /Users/lowcash/repos/zive-sklo-website/package.json — remove main and align private/type conventions.
- /Users/lowcash/repos/massage-website/.prettierrc — migrate to canonical import-sort setup (or replace with prettier.config.js).
- /Users/lowcash/repos/portfolio-website/.prettierrc — migrate to canonical import-sort setup (or replace with prettier.config.js).
- /Users/lowcash/repos/zive-sklo-website/prettier.config.js — source baseline for import sorting.
- /Users/lowcash/repos/portfolio-website/src/components/layout/DebugInfo.tsx — classification decision (layout/devtools vs feature).
- /Users/lowcash/repos/portfolio-website/src/lib/constants.ts — central constants strategy.
- /Users/lowcash/repos/portfolio-website/src/styles/globals.css — authored custom styling layer.
- /Users/lowcash/repos/portfolio-website/src/index.css — generated Tailwind output layer policy.
- /Users/lowcash/repos/portfolio-website/app/layout.tsx — metadata, JSON-LD, skip-link shell.
- /Users/lowcash/repos/portfolio-website/app/page.tsx — server-side section assembly.
- /Users/lowcash/repos/portfolio-website/app/client-chrome.tsx — client interaction orchestration.
- /Users/lowcash/repos/portfolio-website/app/robots.ts — app-router metadata route placement.
- /Users/lowcash/repos/portfolio-website/app/sitemap.ts — app-router metadata route placement.
- /Users/lowcash/repos/portfolio-website/docs/CLEAN_CODE_GUARDRAILS.md — quality policy source.
- /Users/lowcash/repos/massage-website/reference/universal_onepager_blueprint.md — onepager architecture source.
- /Users/lowcash/repos/portfolio-website/.agents — reusable agent assets evaluation.
- /Users/lowcash/repos/portfolio-website/.github/copilot-instructions.md — new active Copilot instruction entrypoint.
- /Users/lowcash/repos/portfolio-website/.github/instructions/onepager.instructions.md — file-scoped onepager enforcement.
- /Users/lowcash/repos/portfolio-website/.github/instructions/clean-code.instructions.md — file-scoped guardrail enforcement.

**Verification**

1. Run format checks in all repos and confirm import ordering changes are deterministic:
   - npm run format:check
2. Validate TypeScript migration in portfolio:
   - npm run build and/or tsc --noEmit
3. Validate dead-code workflow in all repos:
   - npm run analyze:unused
   - npm run analyze:unused:strict
4. Validate no new architecture regressions in portfolio:
   - npm run analyze:style-boundary
   - npm run analyze:style-boundary:changed:strict
5. Spot-check metadata routes and app-router outputs:
   - confirm robots/sitemap routes resolve from app folder.

**Decisions**

- Knip is best-practice for dead-code auditing in modern TS/Next monorepo-like apps, especially for dependency-level and export-level reachability. Keep it as primary tool.
- massage-website should remain private: true unless you explicitly publish it to npm.
- main in Next.js application package.json is typically unnecessary and should be removed for clarity.
- layout/shared in portfolio should not be removed by default; keep or refactor only by ownership semantics, not by folder-name preference alone.
- More constants files make sense only when scoped by domain. Keep one global constants file plus feature-local constants where cohesion is strong.
- scripts folder is justified when custom analyzers exist; if other repos adopt equivalent tooling, add scripts there too.
- robots.ts and sitemap.ts are correctly placed directly in app for Next.js App Router.
- app in root and app in src are both valid Next.js patterns; choose one style per repo and document it.

**Further Considerations**

1. Scope choice for framework strategy: Option A = Next.js-first only (fastest, least cognitive overhead), Option B = Next.js plus generalized cross-framework rules for Vite (more reusable), Option C = Vite-only for frontend microsites (less aligned with current repos). Recommendation: Option B.
2. Copilot guidance scope: Option A = per-repo instructions only, Option B = shared instruction template plus per-repo overlays, Option C = user-level global instructions. Recommendation: Option B.
3. TS migration strictness: Option A = pure migration without ignoreDeprecations, Option B = temporary ignoreDeprecations: 6.0 with tracked removal task. Recommendation: Option A.
