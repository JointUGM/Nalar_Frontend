import { describe, expect, it, vi } from 'vitest'
import { captureActivationLink, captureResetLink } from './activation-link'

const activationId = '00000000-0000-4000-8000-000000000001'

describe('Activation link capture', () => {
  it('retains only the activation proof in memory and removes the query and fragment', () => {
    const history = { state: { key: 'existing' }, replaceState: vi.fn() }
    expect(captureActivationLink({ pathname: '/activate', search: `?activation_id=${activationId}`, hash: '#token_hash=recipient-proof' }, history)).toEqual({ activationId, tokenHash: 'recipient-proof' })
    expect(history.replaceState).toHaveBeenCalledWith(history.state, '', '/activate')
  })

  it.each([
    [`?activation_id=${activationId}&token_hash=wrong-location`, ''],
    ['?activation_id=invalid', '#token_hash=proof'],
    [`?activation_id=${activationId}&activation_id=${activationId}`, '#token_hash=proof'],
    [`?activation_id=${activationId}`, '#token_hash=first&token_hash=second'],
    [`?activation_id=${activationId}`, `#token_hash=${'a'.repeat(257)}`],
  ])('cleans invalid activation URLs without retaining a proof (%s)', (search, hash) => {
    const history = { state: null, replaceState: vi.fn() }
    expect(captureActivationLink({ pathname: '/activate', search, hash }, history)).toBeNull()
    expect(history.replaceState).toHaveBeenCalledWith(null, '', '/activate')
  })

  it('captures a password reset link by its reset id and strips it the same way', () => {
    const history = { state: null, replaceState: vi.fn() }
    expect(captureResetLink({ pathname: '/reset-password', search: `?reset_id=${activationId}`, hash: '#token_hash=reset-proof' }, history)).toEqual({ activationId, tokenHash: 'reset-proof' })
    expect(history.replaceState).toHaveBeenCalledWith(null, '', '/reset-password')
    expect(captureActivationLink({ pathname: '/reset-password', search: `?reset_id=${activationId}`, hash: '#token_hash=reset-proof' }, { state: null, replaceState: vi.fn() })).toBeNull()
  })

  it('preserves queries and anchors on other pages', () => {
    const history = { state: null, replaceState: vi.fn() }
    expect(captureActivationLink({ pathname: '/login', search: '?next=/teacher', hash: '#help' }, history)).toBeNull()
    expect(history.replaceState).not.toHaveBeenCalled()
  })
})
