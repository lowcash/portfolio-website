# CI/CD Setup

## GitHub Actions Workflows

Každý one-pager projekt má nastavený GitHub Actions workflow, který automaticky spouští testy při pull requestech a pushech do main branch.

### Workflow: `.github/workflows/test.yml`

Workflow provádí:

1. **Format Check** - Ověří, že kód odpovídá Prettier formátu (warning, pokud selže)
2. **Typecheck** - TypeScript typecheck (warning, pokud selže, jen pro yacht-website)
3. **E2E Tests** - Spustí Playwright E2E testy na desktop-chrome (BLOKUJÍCÍ - musí projít)

### Jak to funguje

- Na každý **pull request** do `main` se automaticky spustí testy
- Pokud E2E testy selžou, **merge se zablokuje**
- Formátovací a typecheck errory jsou jen **varovné** (neblokují merge, aby bylo možné je fixnout lokalně)
- Při selhání testů se nahraje **Playwright report** (k dispozici 7 dní)

### Blokování merges

Aby se workflow stal **povinným** k mergi, je potřeba v GitHub repositáři nastavit **branch protection rule**:

1. Jdi na Settings → Branches → Add rule
2. Nastav pattern na `main`
3. Zaškrtni "Require status checks to pass before merging"
4. Vyber check: `test` (z workflow)

### Lokální testování

Před push můžeš spustit testy lokálně:

```bash
npm run format:check  # Portfolio, Massage, Zive-sklo
npm run format -- --check  # Yacht

npm run typecheck  # Jen Yacht-website

npm run test:e2e  # Všechny projekty
npm run test:e2e -- --project=desktop-chrome  # Jen desktop testy
```

### Artifact retention

Playwright report se automaticky nahraje pokud testy selžou. Je dostupný 7 dní a lze ho stáhnout z Actions sekce.

## Projekty s CI/CD

- ✅ portfolio-website
- ✅ massage-website
- ✅ yacht-website
- ✅ zive-sklo-website

(land-of-machala nemá nastaveno - má složitější workflow se speciálními testy)
