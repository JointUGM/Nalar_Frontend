import { describe, expect, it } from 'vitest'
import { resolveAuthConfig } from './auth-config'

describe('Public Auth configuration', () => {
  it('accepts HTTPS project configuration and normalizes surrounding whitespace', () => {
    expect(resolveAuthConfig({ supabaseUrl: ' https://auth.nalar.test/ ', supabasePublishableKey: ' sb_publishable_test ' }))
      .toEqual({ supabaseUrl: 'https://auth.nalar.test/', supabasePublishableKey: 'sb_publishable_test' })
  })
  it('allows HTTP for a local Supabase development stack', () => {
    expect(resolveAuthConfig({ supabaseUrl: 'http://127.0.0.1:54321', supabasePublishableKey: 'sb_publishable_test' })).not.toBeNull()
  })
  it.each([
    {}, { supabaseUrl: 'https://auth.nalar.test' },
    { supabaseUrl: 'javascript:alert(1)', supabasePublishableKey: 'sb_publishable_test' },
    { supabaseUrl: 'http://auth.nalar.test', supabasePublishableKey: 'sb_publishable_test' },
    { supabaseUrl: 'https://user:private@auth.nalar.test', supabasePublishableKey: 'sb_publishable_test' },
    { supabaseUrl: 'https://auth.nalar.test?key=private', supabasePublishableKey: 'sb_publishable_test' },
    { supabaseUrl: 'https://auth.nalar.test', supabasePublishableKey: 'sb_secret_private' },
    { supabaseUrl: 'https://auth.nalar.test', supabasePublishableKey: 'eyJlegacy-service-role-or-anon' },
    { supabaseUrl: 'https://auth.nalar.test', supabasePublishableKey: 'sb_publishable_' },
  ])('keeps missing, unsafe or ambiguous configuration unavailable', (config) => {
    expect(resolveAuthConfig(config)).toBeNull()
  })
})
