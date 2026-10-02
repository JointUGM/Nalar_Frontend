import { useCallback } from 'react'
import type { LiveService } from '@/domain/services/LiveService'
import type { LiveReflection } from '@/domain/model/Live'
import { LiveFeedback } from './LiveFrame'
import { useLiveResource } from './useLiveResource'

const reflectionPollMs = (data: LiveReflection | null) => data ? null : 3000

export function LiveStudentReflection({ service, sessionId }: { service: LiveService; sessionId: string }) {
  const read = useCallback((signal: AbortSignal) => service.reflection(sessionId, signal), [service, sessionId])
  const resource = useLiveResource(read, reflectionPollMs)
  return <section aria-labelledby="reflection-title"><h2 id="reflection-title">Refleksimu</h2>
    <LiveFeedback error={resource.error} online={resource.online} refresh={resource.refresh} loading={!resource.data && !resource.error} />
    {resource.data && <><h3>{resource.data.mission_title}</h3><p>{resource.data.content}</p>{resource.data.opening_guess && <p>Dugaan awalmu: {resource.data.opening_guess.text}</p>}</>}
  </section>
}
