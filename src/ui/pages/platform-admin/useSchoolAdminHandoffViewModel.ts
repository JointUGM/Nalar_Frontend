import { useEffect, useRef, useState } from 'react'

type Status = 'editing' | 'confirming' | 'pending' | 'failure' | 'success'

export function useSchoolAdminHandoffViewModel(outcome: 'success' | 'failure') {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<Status>('editing')
  const submitting = useRef(false)

  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => { submitting.current = false; setStatus(outcome) }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome])

  function update(value: string) {
    if (submitting.current || status === 'success') return
    setEmail(value)
    setError(undefined)
  }

  function review(emailValid: boolean) {
    if (status !== 'editing') return
    if (!email.trim() || !emailValid) {
      setError(email.trim() ? 'Gunakan format email yang valid.' : 'Isi email admin baru.')
      return false
    }
    setEmail(email.trim())
    setStatus('confirming')
    return true
  }

  function edit() {
    if (!submitting.current && status !== 'success') setStatus('editing')
  }

  function confirm() {
    if (submitting.current || (status !== 'confirming' && status !== 'failure')) return
    submitting.current = true
    setStatus('pending')
  }

  return { email, error, status, update, review, edit, confirm }
}
