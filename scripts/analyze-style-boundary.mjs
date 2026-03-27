import fs from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT_DIR = process.cwd()
const SOURCE_DIR = path.join(ROOT_DIR, 'src')
const UI_DIR = path.join(SOURCE_DIR, 'components', 'ui')
const TARGET_EXTENSIONS = new Set(['.tsx', '.jsx'])
const STRICT_MODE = process.argv.includes('--strict')
const CHANGED_MODE = process.argv.includes('--changed')
const BASE_REF_ARG = process.argv.find((arg) => arg.startsWith('--base='))
const BASE_REF = BASE_REF_ARG ? BASE_REF_ARG.replace('--base=', '') : 'HEAD'
const ENFORCE_ONLY_NEW = CHANGED_MODE && STRICT_MODE

const IGNORE_PARTS = new Set(['node_modules', 'build', 'dist', 'test-results', 'playwright-report'])

const ATTRIBUTE_REGEX = /\b(className|style)\s*=\s*[{"']/g
const FILE_IGNORE_DIRECTIVE = 'style-boundary-ignore-file'

function isUiFile(filePath) {
  return filePath.startsWith(UI_DIR + path.sep)
}

function toPosixPath(filePath) {
  return path.relative(ROOT_DIR, filePath).split(path.sep).join('/')
}

function parseGitFileList(output) {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function getChangedSourceFiles() {
  try {
    const changedOutput = execFileSync(
      'git',
      ['diff', '--name-only', '--diff-filter=ACMRTUXB', BASE_REF, '--', 'src'],
      { cwd: ROOT_DIR, encoding: 'utf8' },
    )

    const untrackedOutput = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', 'src'], {
      cwd: ROOT_DIR,
      encoding: 'utf8',
    })

    const relativeFiles = new Set([...parseGitFileList(changedOutput), ...parseGitFileList(untrackedOutput)])

    return [...relativeFiles]
      .map((relativePath) => path.join(ROOT_DIR, relativePath))
      .filter((filePath) => TARGET_EXTENSIONS.has(path.extname(filePath)))
  } catch (error) {
    throw new Error(
      `Failed to read changed files from git (base=${BASE_REF}). Use --base=<ref> with a valid ref. ${String(error)}`,
    )
  }
}

async function walkDirectory(directoryPath, files = []) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true })

  for (const entry of entries) {
    if (IGNORE_PARTS.has(entry.name)) {
      continue
    }

    const fullPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      await walkDirectory(fullPath, files)
      continue
    }

    if (!TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      continue
    }

    files.push(fullPath)
  }

  return files
}

function getLineNumber(fileContent, charIndex) {
  let line = 1
  for (let i = 0; i < charIndex; i += 1) {
    if (fileContent.charCodeAt(i) === 10) {
      line += 1
    }
  }
  return line
}

function analyzeContent(filePath, content) {
  if (isUiFile(filePath)) {
    return []
  }

  // File-level escape hatch: add "// style-boundary-ignore-file" near the top of a file
  // to suppress all violations. Use only for justified exceptions (e.g. dynamic runtime styles).
  if (content.slice(0, 400).includes(FILE_IGNORE_DIRECTIVE)) {
    return []
  }

  const matches = [...content.matchAll(ATTRIBUTE_REGEX)]

  return matches.map((match) => ({
    filePath,
    attribute: match[1],
    line: getLineNumber(content, match.index ?? 0),
  }))
}

async function analyzeFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8')
  return analyzeContent(filePath, content)
}

async function keepExistingFiles(files) {
  const existingFiles = []

  for (const filePath of files) {
    try {
      const stats = await fs.stat(filePath)
      if (stats.isFile()) {
        existingFiles.push(filePath)
      }
    } catch {
      // File may have been deleted in working tree; skip it.
    }
  }

  return existingFiles
}

async function collectIncrementalViolations(files) {
  const violations = []
  const filesWithDiff = new Set()
  const attributeRegex = /\b(className|style)\s*=\s*[{"']/

  try {
    const diffOutput = execFileSync('git', ['diff', '-U0', BASE_REF, '--', 'src'], {
      cwd: ROOT_DIR,
      encoding: 'utf8',
    })

    let currentFilePath = null
    let currentFile = null
    let currentLine = 0

    for (const diffLine of diffOutput.split('\n')) {
      if (diffLine.startsWith('+++ b/')) {
        currentFilePath = diffLine.slice(6).trim()
        currentFile = path.join(ROOT_DIR, currentFilePath)
        if (TARGET_EXTENSIONS.has(path.extname(currentFile))) {
          filesWithDiff.add(currentFile)
          // Respect file-level escape hatch: null out currentFile to skip violation collection
          try {
            const head = readFileSync(currentFile, { encoding: 'utf8' }).slice(0, 400)
            if (head.includes(FILE_IGNORE_DIRECTIVE)) {
              currentFile = null
            }
          } catch {
            currentFile = null
          }
        } else {
          currentFile = null
        }
        continue
      }

      if (diffLine.startsWith('@@')) {
        const match = diffLine.match(/\+(\d+)(?:,\d+)?/)
        currentLine = match ? Number(match[1]) : 0
        continue
      }

      if (diffLine.startsWith('+') && !diffLine.startsWith('+++')) {
        if (currentFile && TARGET_EXTENSIONS.has(path.extname(currentFile)) && !isUiFile(currentFile)) {
          const lineContent = diffLine.slice(1)
          const attributeMatch = lineContent.match(attributeRegex)

          if (attributeMatch) {
            violations.push({
              filePath: currentFile,
              attribute: attributeMatch[1],
              line: currentLine,
            })
          }
        }

        currentLine += 1
        continue
      }

      if (diffLine.startsWith('-') && !diffLine.startsWith('---')) {
        continue
      }

      if (currentLine > 0) {
        currentLine += 1
      }
    }
  } catch (error) {
    throw new Error(`Failed to inspect git diff for incremental checks (base=${BASE_REF}). ${String(error)}`)
  }

  const filesWithoutDiff = files.filter((filePath) => !filesWithDiff.has(filePath))
  for (const filePath of filesWithoutDiff) {
    const fileViolations = await analyzeFile(filePath)
    violations.push(...fileViolations)
  }

  return violations
}

function buildByFileMap(violations) {
  const byFile = new Map()

  for (const violation of violations) {
    const key = toPosixPath(violation.filePath)
    const existing = byFile.get(key) ?? { className: 0, style: 0, lines: [] }
    existing[violation.attribute] += 1
    existing.lines.push(violation.line)
    byFile.set(key, existing)
  }

  return byFile
}

async function main() {
  const files = CHANGED_MODE ? await keepExistingFiles(getChangedSourceFiles()) : await walkDirectory(SOURCE_DIR)

  const violations = []

  for (const filePath of files) {
    const fileViolations = await analyzeFile(filePath)
    violations.push(...fileViolations)
  }

  const violationsToEnforce = ENFORCE_ONLY_NEW ? await collectIncrementalViolations(files) : violations

  const byFile = buildByFileMap(violationsToEnforce)

  const summary = {
    mode: CHANGED_MODE ? 'changed-files' : 'all-files',
    enforcement: ENFORCE_ONLY_NEW ? 'new-added-lines-only' : 'all-violations',
    baseRef: CHANGED_MODE ? BASE_REF : null,
    scannedFiles: files.length,
    checkedOutsideUi: files.filter((filePath) => !isUiFile(filePath)).length,
    violatingFiles: byFile.size,
    totalViolations: violations.length,
    enforcedViolations: violationsToEnforce.length,
  }

  console.log('STYLE BOUNDARY ANALYSIS')
  console.log(JSON.stringify(summary, null, 2))

  if (byFile.size > 0) {
    console.log('')
    console.log('Top violating files (first 25):')

    const sortedFiles = [...byFile.entries()]
      .map(([filePath, stats]) => ({
        filePath,
        className: stats.className,
        style: stats.style,
        total: stats.className + stats.style,
        lines: stats.lines,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 25)

    for (const item of sortedFiles) {
      const linePreview = [...new Set(item.lines)]
        .sort((a, b) => a - b)
        .slice(0, 8)
        .join(', ')
      console.log(
        `${item.filePath} -> total=${item.total}, className=${item.className}, style=${item.style}, lines=[${linePreview}]`,
      )
    }
  }

  if (STRICT_MODE && violationsToEnforce.length > 0) {
    process.exitCode = 1
    console.error('')
    console.error('Strict mode failed: styling boundary violations found outside src/components/ui.')
  }
}

main().catch((error) => {
  console.error('Failed to run style boundary analyzer.')
  console.error(error)
  process.exit(1)
})
