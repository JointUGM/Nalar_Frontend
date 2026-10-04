import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// The 1s default for findBy/waitFor is too tight for lazy pages and dialogs when a slow CI runner is busy.
configure({ asyncUtilTimeout: 5000 })

// Node 25 ships its own Web Storage, which hides jsdom's and has no methods unless started with a storage file.
const { jsdom } = globalThis as unknown as { jsdom?: { window: Window } }
for (const name of ['localStorage', 'sessionStorage'] as const) {
  if (jsdom && typeof globalThis[name]?.clear !== 'function') Object.defineProperty(globalThis, name, { configurable: true, value: jsdom.window[name] })
}

afterEach(cleanup)
