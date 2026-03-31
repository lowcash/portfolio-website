import lighthouse from 'lighthouse'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'

const mode = process.argv[2] === 'mobile' ? 'mobile' : 'desktop'
const url = process.env.LIGHTHOUSE_URL ?? 'http://127.0.0.1:3000'
const port = mode === 'mobile' ? 9223 : 9222
const outputDir = path.resolve(process.cwd(), 'test-results')
const outputPath = path.join(outputDir, `lighthouse-${mode}.html`)
const summaryPath = path.join(outputDir, `lighthouse-${mode}.json`)

const chromeProcess = spawn(
  chromium.executablePath(),
  [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    `--user-data-dir=${path.join(outputDir, `.chromium-lighthouse-${mode}`)}`,
  ],
  {
    stdio: 'ignore',
  },
)

async function waitForDebugger(retries = 50) {
  for (let index = 0; index < retries; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) {
        return
      }
    } catch {
      // Ignore until Chromium debugger endpoint becomes available.
    }

    await delay(200)
  }

  throw new Error(`Timed out waiting for Chromium debugger on port ${port}`)
}

try {
  await fs.mkdir(outputDir, { recursive: true })
  await waitForDebugger()

  const runnerResult = await lighthouse(url, {
    port,
    output: 'html',
    logLevel: 'info',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    preset: mode === 'desktop' ? 'desktop' : undefined,
    formFactor: mode,
    screenEmulation:
      mode === 'mobile'
        ? {
            mobile: true,
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            disabled: false,
          }
        : {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
          },
  })

  if (!runnerResult?.report) {
    throw new Error('Lighthouse did not produce a report')
  }

  await fs.writeFile(outputPath, runnerResult.report)

  const categories = runnerResult.lhr.categories
  const formatScore = (key) => Math.round((categories[key]?.score ?? 0) * 100)
  const summary = {
    mode,
    url,
    outputPath,
    generatedAt: new Date().toISOString(),
    scores: {
      performance: formatScore('performance'),
      accessibility: formatScore('accessibility'),
      bestPractices: formatScore('best-practices'),
      seo: formatScore('seo'),
    },
  }

  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2))

  console.log(JSON.stringify({ ...summary, summaryPath }, null, 2))
} finally {
  chromeProcess.kill('SIGTERM')
}
