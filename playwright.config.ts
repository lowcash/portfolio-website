import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  outputDir: 'test-results/playwright',
  use: {
    baseURL: 'http://127.0.0.1:3101',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm run preview:e2e',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 240000,
    env: {
      SITE_ENV: 'production',
    },
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/*.mobile.spec.ts', '**/*.tablet.spec.ts'],
    },
    {
      name: 'tablet-chrome',
      use: { ...devices['iPad Pro'] },
      testIgnore: ['**/*.mobile.spec.ts', '**/*.desktop.spec.ts'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
      testIgnore: ['**/*.desktop.spec.ts', '**/*.tablet.spec.ts'],
    },
  ],
})
