import { useEffect, useRef, useState } from 'react'

type Fields = { name: string; npsn: string; email: string }
type Status = 'editing' | 'pending' | 'failure' | 'success'

export function useSchoolOnboardingViewModel(outcome: 'success' | 'failure') {
  const [fields, setFields] = useState<Fields>({ name: '', npsn: '', email: '' })
  const [errors, setErrors] = useState<Partial<Fields>>({})
  const [status, setStatus] = useState<Status>('editing')
  const submitting = useRef(false)

  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => { submitting.current = false; setStatus(outcome) }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome])

  function update(field: keyof Fields, value: string) {
    if (submitting.current) return
    setFields((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus('editing')
  }

  function submit(emailValid: boolean): keyof Fields | undefined {
    if (submitting.current || status === 'success') return
    const next: Partial<Fields> = {}
    if (!fields.name.trim()) next.name = 'Isi nama sekolah.'
    if (!fields.npsn.trim()) next.npsn = 'Isi NPSN sekolah.'
    if (!fields.email.trim()) next.email = 'Isi email admin sekolah pertama.'
    else if (!emailValid) next.email = 'Gunakan format email yang valid.'
    setErrors(next)
    const first = (['name', 'npsn', 'email'] as const).find((field) => next[field])
    if (first) return first
    submitting.current = true
    setStatus('pending')
  }

  return { fields, errors, status, update, submit }
}
