import { useEffect, useRef, useState } from 'react'

export function useSimulatedConfirmation(onApply: () => void) {
  const [status, setStatus] = useState<'confirming' | 'pending' | 'failure' | 'success'>('confirming')
  const [outcome, setOutcome] = useState<'success' | 'failure'>('success')
  const submitting = useRef(false)
  const apply = useRef(onApply)
  useEffect(() => { apply.current = onApply })
  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => {
      if (outcome === 'success') apply.current()
      setStatus(outcome); submitting.current = false
    }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome])
  function confirm() { if (status === 'pending' || status === 'success' || submitting.current) return; submitting.current = true; setStatus('pending') }
  return { status, outcome, setOutcome, confirm }
}
