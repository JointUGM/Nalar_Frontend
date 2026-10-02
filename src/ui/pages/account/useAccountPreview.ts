import { useEffect, useState } from 'react'

export type PreviewOutcome = 'success' | 'failure'
export type PreviewStatus = 'idle' | 'pending' | 'done' | 'failed'
export const previewMs = 650

/** A simulated submit for the account preview screens: pending for a moment, then the outcome the reviewer picked. Nothing is sent. */
export function useAccountPreview() {
  const [status, setStatus] = useState<PreviewStatus>('idle')
  const [outcome, setOutcome] = useState<PreviewOutcome>('success')
  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => setStatus(outcome === 'success' ? 'done' : 'failed'), previewMs)
    return () => clearTimeout(timer)
  }, [status, outcome])
  return {
    status, outcome, setOutcome,
    // One submit at a time.
    start: () => { if (status !== 'pending') setStatus('pending') },
    reset: () => setStatus('idle'),
  }
}
