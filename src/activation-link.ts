import type { ActivationProof } from './domain/model/AccountActivation'

export function captureActivationLink(location: Pick<Location, 'pathname' | 'search' | 'hash'>, history: Pick<History, 'replaceState' | 'state'>, page = '/activate', idName = 'activation_id'): ActivationProof | null {
  if (location.pathname.replace(/\/$/, '') !== page) return null
  const query = new URLSearchParams(location.search)
  const fragment = new URLSearchParams(location.hash.slice(1))
  history.replaceState(history.state, '', location.pathname)
  const activationId = query.get(idName)
  const tokenHash = fragment.get('token_hash')
  if (query.getAll(idName).length !== 1 || fragment.getAll('token_hash').length !== 1 || !activationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activationId) || !tokenHash || tokenHash.length > 256) return null
  return { activationId, tokenHash }
}

// A password reset link: `reset_id` in the query, the one-time proof in the fragment.
export const captureResetLink = (location: Pick<Location, 'pathname' | 'search' | 'hash'>, history: Pick<History, 'replaceState' | 'state'>) => captureActivationLink(location, history, '/reset-password', 'reset_id')
