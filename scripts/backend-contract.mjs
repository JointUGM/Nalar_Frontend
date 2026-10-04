import { isDeepStrictEqual } from 'node:util'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import openapiTS, { astToString } from 'openapi-typescript'

const source = new URL('../contracts/backend.openapi.json', import.meta.url)
const target = new URL('../src/infrastructure/services/contracts/backend.ts', import.meta.url)
const args = process.argv.slice(2)
const write = args.includes('--write')
const upstreamIndex = args.indexOf('--upstream')
const upstream = upstreamIndex >= 0 ? args[upstreamIndex + 1] : undefined
const expectedArguments = write ? 1 : 0

if (args.length !== expectedArguments + (upstreamIndex >= 0 ? 2 : 0) || (upstreamIndex >= 0 && !upstream)) {
  throw new Error('Usage: node scripts/backend-contract.mjs [--write] [--upstream <backend-openapi.json>]')
}

const pinned = JSON.parse(await readFile(source, 'utf8'))
if (upstream) {
  const actual = JSON.parse(await readFile(resolve(upstream), 'utf8'))
  if (!isDeepStrictEqual(actual, pinned)) {
    throw new Error('Backend OpenAPI differs from the pinned contract. Review the change, then update the pin and generated types together.')
  }
}

const generated = `// Generated from contracts/backend.openapi.json. Do not edit.\n${astToString(await openapiTS(source, { silent: true }))}`
if (write) {
  await mkdir(dirname(fileURLToPath(target)), { recursive: true })
  await writeFile(target, generated, 'utf8')
  process.stdout.write('Generated backend contract types.\n')
// A Windows checkout with core.autocrlf turns the generated file's endings into CRLF; only the content counts.
} else if ((await readFile(target, 'utf8')).replace(/\r\n/g, '\n') !== generated) {
  throw new Error('Generated backend types differ from the pinned contract. Run npm run contract:generate and review both files.')
} else {
  process.stdout.write('Pinned backend contract and generated types agree.\n')
}
