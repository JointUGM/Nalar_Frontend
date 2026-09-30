import { describe, expect, it } from 'vitest'
import { createDependencies } from './di'

describe('Public account composition', () => {
  it('leaves account entry unavailable without complete public configuration', async () => {
    const composition = await createDependencies({})
    expect(composition.account).toBeNull()
    await composition.dispose()
  })

  it('constructs and disposes the real SDK-backed use cases with a publishable key', async () => {
    const composition = await createDependencies({
      supabaseUrl: 'https://account-composition.nalar.test',
      supabasePublishableKey: 'sb_publishable_test',
    })
    try {
      expect(composition.account).not.toBeNull()
      expect(composition.account?.identity).toBeNull()
      await expect(composition.account!.session.read()).resolves.toBeNull()
      await expect(composition.account!.signIn.execute({ email: 'invalid', password: '' }))
        .rejects.toMatchObject({ fields: { email: expect.any(String), password: expect.any(String) } })
    } finally {
      await composition.dispose()
    }
  })

  it('composes identity only for a safe /api/v1 base URL', async () => {
    const base = { supabaseUrl: 'https://account-composition.nalar.test', supabasePublishableKey: 'sb_publishable_test' }
    const safe = await createDependencies({ ...base, apiBaseUrl: 'https://api.nalar.test/api/v1' })
    const unsafe = await createDependencies({ ...base, apiBaseUrl: 'https://api.nalar.test/api/v1?token=secret' })
    try {
      expect(safe.account?.identity).toBeDefined()
      expect(unsafe.account?.identity).toBeNull()
    } finally {
      await safe.dispose()
      await unsafe.dispose()
    }
  })
})
