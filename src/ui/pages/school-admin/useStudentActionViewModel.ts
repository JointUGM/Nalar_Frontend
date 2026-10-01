import { useEffect, useRef, useState } from 'react'

export type StudentAction = 'invite' | 'deactivate'
export function useStudentActionViewModel(onApply: () => void) {
  const [status, setStatus] = useState<'confirming' | 'pending' | 'failure' | 'success'>('confirming')
  const [outcome, setOutcome] = useState<'success' | 'failure'>('success')
  const submitting = useRef(false)
  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => {
      if (outcome === 'success') onApply()
      setStatus(outcome); submitting.current = false
    }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome, onApply])
  function confirm() { if (status === 'pending' || status === 'success' || submitting.current) return; submitting.current = true; setStatus('pending') }
  return { status, outcome, setOutcome, confirm }
}
