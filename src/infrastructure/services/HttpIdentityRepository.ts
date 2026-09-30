import type { Identity, SchoolMembership } from '@/domain/model/Identity'
import { OperationError } from '@/domain/model/OperationError'
import type { OperationErrorCode } from '@/domain/model/OperationError'
import type { IdentityRepository } from '@/domain/services/IdentityRepository'

export interface HttpIdentityOptions {
  apiBaseUrl: string
  getAccessToken: () => Promise<string | null>
  fetch?: typeof globalThis.fetch
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requestReference(value: unknown): string | undefined {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(value) ? value : undefined
}

function mapIdentity(value: unknown): Identity | null {
  if (!isRecord(value) || typeof value.user_id !== 'string' || !uuid.test(value.user_id)
    || typeof value.full_name !== 'string' || !Array.isArray(value.roles)
    || typeof value.is_parent !== 'boolean' || typeof value.is_platform_admin !== 'boolean') return null

  const memberships: SchoolMembership[] = []
  for (const membership of value.roles) {
    if (!isRecord(membership) || (membership.role !== 'school_admin' && membership.role !== 'teacher' && membership.role !== 'student')
      || typeof membership.school_id !== 'string' || !uuid.test(membership.school_id)
      || typeof membership.school_name !== 'string') return null
    memberships.push({ role: membership.role, schoolId: membership.school_id, schoolName: membership.school_name })
  }
  return { userId: value.user_id, fullName: value.full_name, memberships, isParent: value.is_parent, isPlatformAdmin: value.is_platform_admin }
}

const statusCodes: Partial<Record<number, OperationErrorCode>> = {
  401: 'unauthenticated', 403: 'forbidden', 404: 'not_found', 429: 'rate_limited',
}

export class HttpIdentityRepository implements IdentityRepository {
  constructor(private readonly options: HttpIdentityOptions) {}

  async getMe(signal?: AbortSignal): Promise<Identity> {
    let token: string | null
    try { token = await this.options.getAccessToken() }
    catch { throw new OperationError('unavailable') }
    if (!token) throw new OperationError('unauthenticated')

    let response: Response
    try {
      response = await (this.options.fetch ?? globalThis.fetch)(`${this.options.apiBaseUrl.replace(/\/+$/, '')}/me`, {
        method: 'GET', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store', credentials: 'omit', signal,
      })
    } catch { throw new OperationError('unavailable') }

    let body: unknown
    try { body = await response.json() }
    catch { body = undefined }
    const requestId = requestReference(response.headers.get('X-Request-Id'))
      ?? requestReference(isRecord(body) ? body.request_id : undefined)
    const metadata = { status: response.status, requestId }
    if (response.status !== 200) {
      throw new OperationError(response.ok ? 'invalid_response' : statusCodes[response.status] ?? 'unavailable', metadata)
    }
    const identity = mapIdentity(body)
    if (!identity) throw new OperationError('invalid_response', metadata)
    return identity
  }
}
