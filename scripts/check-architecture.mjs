import assert from 'node:assert/strict'
import { ESLint } from 'eslint'

const eslint = new ESLint()
const forbiddenImports = [
  ['src/domain/model/Probe.ts', '@/application/add-log-use-case'],
  ['src/domain/model/Probe.ts', '@/infrastructure/services/InMemoryLoggerService'],
  ['src/domain/model/Probe.ts', 'react'],
  ['src/domain/model/Probe.ts', 'react-router'],
  ['src/application/Probe.ts', '@/review-di'],
  ['src/application/Probe.ts', '@/infrastructure/services/InMemoryLoggerService'],
  ['src/application/Probe.ts', '@/ui/pages/home/Home'],
  ['src/application/Probe.ts', '../infrastructure/services/InMemoryLoggerService'],
  ['src/ui/pages/home/Probe.tsx', '@/infrastructure/services/InMemoryLoggerService'],
  ['src/ui/pages/home/Probe.tsx', '@/di'],
  ['src/ui/pages/home/Probe.tsx', '@/di.ts'],
  ['src/ui/pages/home/Probe.tsx', '@/review-di'],
  ['src/ui/pages/home/Probe.tsx', '@/review-di.ts'],
  ['src/infrastructure/services/Probe.ts', '@/ui/pages/home/Home'],
]

for (const [filePath, source] of forbiddenImports) {
  const [result] = await eslint.lintText(
    `import * as dependency from ${JSON.stringify(source)}; export { dependency };`,
    { filePath },
  )
  assert.ok(
    result.messages.some((message) => message.ruleId === 'no-restricted-imports'),
    `${filePath} must reject ${source}`,
  )
}

const [browserAccess] = await eslint.lintText(
  'export const load = () => fetch("/api/logs");',
  { filePath: 'src/application/Probe.ts' },
)
assert.ok(browserAccess.messages.some((message) => message.ruleId === 'no-restricted-globals'))

const [allowedImport] = await eslint.lintText(
  'import type { Log } from "@/domain/model/Log"; export type { Log };',
  { filePath: 'src/application/Probe.ts' },
)
assert.equal(allowedImport.errorCount, 0, 'Application must allow domain types')

console.log('Architecture checks passed: forbidden imports/browser access rejected; domain types allowed.')
