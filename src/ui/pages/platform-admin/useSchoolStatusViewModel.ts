import { useEffect, useRef, useState } from 'react'

type Status = 'confirming' | 'pending' | 'success' | 'failure'

export function useSchoolStatusViewModel(outcome: 'success' | 'failure') {
  const [status, setStatus] = useState<Status>('confirming')
  const submitting = useRef(false)

  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => { submitting.current = false; setStatus(outcome) }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome])

  function confirm() {
    if (submitting.current || (status !== 'confirming' && status !== 'failure')) return
    submitting.current = true
    setStatus('pending')
  }

  return { status, confirm }
}
