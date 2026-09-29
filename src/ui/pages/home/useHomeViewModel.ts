import { useState } from 'react'
import type { AddLogUseCase } from '@/application/add-log-use-case'
import type { Log } from '@/domain/model/Log'

export function useHomeViewModel(addLog: Pick<AddLogUseCase, 'execute'>) {
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState<Log[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function addMessage(): Promise<void> {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const log = await addLog.execute(message)
      setLogs((previous) => [...previous, log])
      setMessage('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save your message. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { message, setMessage, logs, error, isSubmitting, addMessage }
}
