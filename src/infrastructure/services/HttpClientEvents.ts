import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']

// Any segment with a digit or an unexpected character is an id or a code, so only the route's shape leaves the browser.
export const routePattern = (pathname: string) => pathname.split('/').map((segment) => /^[A-Za-z_.-]*$/.test(segment) ? segment : ':id').join('/').slice(0, 160) || '/'

export class HttpClientEvents {
  constructor(private readonly api: HttpApi) {}

  // Best effort: the backend dedupes by event id and drops anything over its rate cap.
  async reportError(code: string, pathname: string): Promise<void> {
    const body: Schemas['ClientEventsIn'] = { events: [{ event_id: crypto.randomUUID(), kind: 'error', code, route: routePattern(pathname), occurred_at: new Date().toISOString() }] }
    await this.api.request('/client-events', { method: 'POST', body })
  }
}
