import { useCallback, useEffect } from 'react'
import type { TeacherService } from '@/domain/services/TeacherService'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'

const attentionPollMs = () => 60_000

// The queue backs both the sidebar badge and the Perlu perhatian page; it is reread on every navigation and once a minute.
export function useAttention(service: TeacherService, schoolId: string, pathname: string) {
  const read = useCallback((signal: AbortSignal) => service.attention(schoolId, signal), [service, schoolId])
  const attention = useLiveResource(read, attentionPollMs)
  const { refresh } = attention
  useEffect(() => { refresh() }, [pathname, refresh])
  return attention
}
