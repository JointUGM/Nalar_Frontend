import { describe, expect, it, vi } from 'vitest'
import { HttpApi } from './HttpApi'
import { HttpClientEvents } from './HttpClientEvents'

describe('client events', () => {
  it('reports a crash with the route shape only, never an id or a join code', async () => {
    const request = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ accepted: 1 }, { status: 202 }))
    await new HttpClientEvents(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })).reportError('route.render', '/teacher/0b9c2f4e-1d2a-4c55-9f00-3a1b2c3d4e5f/publications/AB12CD/results')
    const [url, init] = request.mock.calls[0]
    expect(url).toBe('/api/v1/client-events')
    const [event] = JSON.parse(String(init?.body)).events
    expect(event).toMatchObject({ kind: 'error', code: 'route.render', route: '/teacher/:id/publications/:id/results' })
    expect(Object.keys(event).sort()).toEqual(['code', 'event_id', 'kind', 'occurred_at', 'route'])
  })
})
