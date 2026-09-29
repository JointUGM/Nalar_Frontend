import { isAuthError, isAuthSessionMissingError } from '@supabase/supabase-js'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'
import { OperationError } from '@/domain/model/OperationError'
import type { AuthService } from '@/domain/services/AuthService'

export type SupabaseAuthGateway = Pick<SupabaseClient['auth'], 'signInWithPassword' | 'signOut' | 'getSession' | 'onAuthStateChange'>

function safeError(error: unknown, signingIn = false): OperationError {
  if (error instanceof OperationError) return error
  if (!isAuthError(error)) return new OperationError('unavailable')
  const rawStatus = error.status
  const status = typeof rawStatus === 'number' && Number.isInteger(rawStatus) && rawStatus >= 100 && rawStatus <= 599 ? rawStatus : undefined
  const metadata = { status }
  if (error.name === 'AuthInvalidTokenResponseError') return new OperationError('invalid_response', metadata)
  if (isAuthSessionMissingError(error) || status === 401 ||
    ['session_not_found', 'session_expired', 'refresh_token_not_found', 'refresh_token_already_used'].includes(error.code ?? '')) {
    return new OperationError('unauthenticated', metadata)
  }
  if (status === 429) return new OperationError('rate_limited', metadata)
  if (signingIn && (status === 400 || status === 422)) return new OperationError('invalid_credentials', metadata)
  if (status === 403) return new OperationError('forbidden', metadata)
  return new OperationError('unavailable', metadata)
}

function metadata(session: Session): AuthSession {
  try {
    const userId = session.user?.id
    const expiresAt = session.expires_at
    if (typeof userId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ||
      typeof session.access_token !== 'string' || !session.access_token.trim() ||
      typeof expiresAt !== 'number' || !Number.isSafeInteger(expiresAt) || expiresAt <= 0) {
      throw new OperationError('invalid_response')
    }
    if (expiresAt <= Date.now() / 1000) throw new OperationError('unauthenticated')
    return { userId, expiresAt }
  } catch (error) {
    throw safeError(error)
  }
}

export class SupabaseAuthService implements AuthService {
  constructor(private readonly auth: SupabaseAuthGateway) {}

  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    try {
      const { data, error } = await this.auth.signInWithPassword({ email: credentials.email, password: credentials.password })
      if (error) throw error
      if (!data.session) throw new OperationError('invalid_response')
      return metadata(data.session)
    } catch (error) {
      throw safeError(error, true)
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.auth.signOut({ scope: 'local' })
      if (error) throw error
    } catch (error) {
      throw safeError(error)
    }
  }

  async getSession(): Promise<AuthSession | null> {
    const session = await this.readSession()
    return session ? metadata(session) : null
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.readSession()
    if (!session) return null
    metadata(session)
    return session.access_token
  }

  private async readSession(): Promise<Session | null> {
    try {
      // The SDK owns persistence, refresh, refresh deduplication and cross-tab events.
      const { data, error } = await this.auth.getSession()
      if (error) throw error
      return data.session
    } catch (error) {
      throw safeError(error)
    }
  }

  subscribe(listener: (session: AuthSession | null) => void): () => void {
    let active = true
    const pending = new Set<ReturnType<typeof setTimeout>>()
    const { data: { subscription } } = this.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      let value: AuthSession | null = null
      try { value = session ? metadata(session) : null } catch { /* Invalid local metadata grants nothing. */ }
      // Auth subscribers must not re-enter the SDK's awaited notification cycle.
      const timer = setTimeout(() => {
        pending.delete(timer)
        if (active) listener(value)
      }, 0)
      pending.add(timer)
    })
    return () => {
      if (!active) return
      active = false
      subscription.unsubscribe()
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }
}
