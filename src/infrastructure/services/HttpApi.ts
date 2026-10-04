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

// Reads a cursor-paged list in full: one request when there is no next page, and at most `maxPages` (500 items at a limit of 100) so a runaway list cannot keep a poll busy.
export async function allItems(api: Pick<HttpApi, 'request'>, path: string, signal?: AbortSignal, maxPages = 5): Promise<unknown[]> {
  const items: unknown[] = []
  let cursor: string | null = null
  for (let page = 0; page < maxPages; page += 1) {
    const { data } = await api.request(cursor ? `${path}${path.includes('?') ? '&' : '?'}cursor=${encodeURIComponent(cursor)}` : path, { signal })
    const value = record(data)
    items.push(...list(value.items))
    cursor = nullable(value.next_cursor, text)
    if (!cursor) break
  }
  return items
}

// ponytail: HttpLiveService keeps its own copy of this request path until the pilot is over; fold it in when that file next changes.
export class HttpApi {
  private readonly retryKeys = new Map<string, string>()
  constructor(private readonly options: { apiBaseUrl: string; fetch?: typeof globalThis.fetch }) {}

  // `form` sends a multipart upload: the browser writes its own Content-Type with the boundary, and a file of up to 50 MB gets two minutes instead of ten seconds.
  // `timeoutMs` is for the few calls that wait on the AI before answering.
  // `idempotent` sends one Idempotency-Key per pending path and body: pressing the button again after a lost answer reuses it, so the server replays its receipt instead of creating a duplicate. Success frees the key.
  async request(path: string, init: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown; form?: FormData; timeoutMs?: number; raw?: boolean; idempotent?: boolean; headers?: Record<string, string>; signal?: AbortSignal } = {}): Promise<{ status: number; data: unknown }> {
    const method = init.method ?? 'GET'
    const intent = init.idempotent ? `${method} ${path} ${JSON.stringify(init.form ? [...init.form].map(([name, value]) => [name, typeof value === 'string' ? value : [value.name, value.size, value.lastModified]]) : init.body)}` : undefined
    const retryKey = intent === undefined ? undefined : this.retryKeys.get(intent) ?? crypto.randomUUID()
    if (intent !== undefined && retryKey) this.retryKeys.set(intent, retryKey)
    let response: Response
    try {
      response = await (this.options.fetch ?? globalThis.fetch)(`${this.options.apiBaseUrl}${path}`, {
        method, credentials: 'include', cache: 'no-store',
        headers: { ...init.headers, ...(retryKey ? { 'Idempotency-Key': retryKey } : {}), Accept: init.raw ? 'text/csv' : 'application/json', ...(method === 'GET' ? {} : { 'X-Nalar-CSRF': '1' }), ...(init.body === undefined ? {} : { 'Content-Type': 'application/json' }) },
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
    if (intent !== undefined) this.retryKeys.delete(intent)
    if (response.status === 204) return { status: 204, data: null }
    // `raw` is for a file answer (the row-error CSV): the body is handed over untouched, as a Blob.
    if (init.raw) return { status: response.status, data: await response.blob() }
    try { return { status: response.status, data: await response.json() } } catch { throw invalid() }
  }
}
