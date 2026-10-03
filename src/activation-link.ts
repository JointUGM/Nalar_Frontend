import type { ActivationProof } from './domain/model/AccountActivation'

export function captureActivationLink(location: Pick<Location, 'pathname' | 'search' | 'hash'>, history: Pick<History, 'replaceState' | 'state'>): ActivationProof | null {
  if (!/^\/activate\/?$/.test(location.pathname)) return null
  const query = new URLSearchParams(location.search)
  const fragment = new URLSearchParams(location.hash.slice(1))
  history.replaceState(history.state, '', location.pathname)
  const activationId = query.get('activation_id')
  const tokenHash = fragment.get('token_hash')
  if (query.getAll('activation_id').length !== 1 || fragment.getAll('token_hash').length !== 1 || !activationId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activationId) || !tokenHash || tokenHash.length > 256) return null
  return { activationId, tokenHash }
}
