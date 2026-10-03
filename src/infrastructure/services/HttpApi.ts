import { ApiError } from '@/domain/model/ApiError'

const invalid = () => new ApiError(502, 'INVALID_RESPONSE')

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid()
  return value as Record<string, unknown>
}
export function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw invalid()
  return value
}
export function text(value: unknown): string {
  if (typeof value !== 'string') throw invalid()
  return value
}
export function count(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) throw invalid()
  return value
}
export function flag(value: unknown): boolean {
  if (typeof value !== 'boolean') throw invalid()
  return value
}
export function instant(value: unknown): string {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value)) || !/(Z|[+-]\d{2}:\d{2})$/.test(value)) throw invalid()
  return value
}
export function nullable<T>(value: unknown, read: (value: unknown) => T): T | null {
  return value === null || value === undefined ? null : read(value)
}

// ponytail: HttpLiveService keeps its own copy of this request path until the pilot is over; fold it in when that file next changes.
export class HttpApi {
  constructor(private readonly options: { apiBaseUrl: string; fetch?: typeof globalThis.fetch }) {}

  // `form` sends a multipart upload: the browser writes its own Content-Type with the boundary, and a file of up to 50 MB gets two minutes instead of ten seconds.
  // `timeoutMs` is for the few calls that wait on the AI before answering.
  async request(path: string, init: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH'; body?: unknown; form?: FormData; timeoutMs?: number; headers?: Record<string, string>; signal?: AbortSignal } = {}): Promise<{ status: number; data: unknown }> {
    const method = init.method ?? 'GET'
    let response: Response
    try {
      response = await (this.options.fetch ?? globalThis.fetch)(`${this.options.apiBaseUrl}${path}`, {
        method, credentials: 'include', cache: 'no-store',
        headers: { ...init.headers, Accept: 'application/json', ...(method === 'GET' ? {} : { 'X-Nalar-CSRF': '1' }), ...(init.body === undefined ? {} : { 'Content-Type': 'application/json' }) },
        body: init.form ?? (init.body === undefined ? undefined : JSON.stringify(init.body)),
        signal: AbortSignal.any([...(init.signal ? [init.signal] : []), AbortSignal.timeout(init.timeoutMs ?? (init.form ? 120_000 : 10_000))]),
      })
    } catch { throw new ApiError(0, 'UNAVAILABLE') }
    if (!response.ok) {
      let code = 'HTTP_ERROR'
      let problems: string[] = []
      try {
        const error = record(record(await response.json()).error)
        if (typeof error.code === 'string') code = error.code
        // A validation refusal lists what is wrong; only the codes are kept, never the backend's text.
        problems = list(record(error.details).problems).map((item) => text(record(item).code))
      } catch { /* The status is authoritative when the error body is unreadable. */ }
      const reference = response.headers.get('X-Request-Id')
      throw new ApiError(response.status, code, reference && /^[A-Za-z0-9_-]{1,64}$/.test(reference) ? reference : undefined, undefined, problems)
    }
    if (response.status === 204) return { status: 204, data: null }
    try { return { status: response.status, data: await response.json() } } catch { throw invalid() }
  }
}
