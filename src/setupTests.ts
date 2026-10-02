import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// The 1s default for findBy/waitFor is too tight for lazy pages and dialogs when a slow CI runner is busy.
configure({ asyncUtilTimeout: 5000 })

afterEach(cleanup)
