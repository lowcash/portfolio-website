# UI Polish TDD Plan (2026-03-29)

## Goal
Dokoncit 5 UI oprav v rezimu test-first po atomickem commitu regresnich oprav.

## Status
- Commit hotovy: f3ffec1
- Dal: nejdriv failing E2E testy, potom implementace fixu, pak validace.

## Scope
1. Achievement popup ma zustat na obrazovce (ne mimo viewport) a nad side nav.
2. DevTools egg ma byt jen jemna ghost ikona bez viditelneho backgroundu a borderu.
3. Mobilni hamburger: klik na "Hey There" musi spolehlive navigovat na hero.
4. Mobilni orby maji byt rozprostrene pres plochu (ne shluk uprostred) a mekci.
5. Scroll-to-top nesmi na mobilu prekryvat text ve finalni sekci.

## TDD Steps
1. Pridat failing testy:
   - tests/e2e/mobile-nav-hey-there.spec.ts
   - tests/e2e/devtools-ui.spec.ts (rozsireni)
2. Spustit jen nove testy a potvrdit fail stav.
3. Implementovat fixy po jednom:
   - src/components/ui/scroll-navigation.tsx
   - src/components/features/devtools/DeveloperConsole.tsx
   - src/components/shared/AnimatedBackground.tsx
   - src/components/ui/easter-eggs.tsx
   - src/components/features/Contact.tsx
4. Po kazdem fixu rerun relevant testu.
5. Finalni beh:
   - npx playwright test --project=mobile-safari
   - npx playwright test --project=desktop-chrome

## Acceptance
- Vsechny nove testy green.
- Bez regresi v existujicich navigation/devtools E2E testech.
