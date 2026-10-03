import { useEffect, useRef, useState } from 'react'
import type { ActivationProof } from '@/domain/model/AccountActivation'
import { OperationError } from '@/domain/model/OperationError'
import type { AccountDependencies } from './AccountDependencies'

export function useActivateAccountViewModel(proof: ActivationProof | null, activate: AccountDependencies['activate']) {
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [fields, setFields] = useState<{ password?: string; repeat?: string }>({})
  const [status, setStatus] = useState<'ready' | 'pending' | 'done' | 'invalid'>('ready')
  const [error, setError] = useState<OperationError | null>(null)
  const busy = useRef(false)
  const mounted = useRef(true)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])

  async function submit() {
    if (busy.current || !proof || !activate || status === 'done' || status === 'invalid') return
    const errors: typeof fields = {}
    if ([...password].length < 8 || password.length > 256) errors.password = 'Gunakan 8–256 karakter.'
    if (password !== repeat || !repeat) errors.repeat = 'Kedua kata sandi harus sama.'
    setFields(errors)
    setError(null)
    if (Object.keys(errors).length) return
    busy.current = true
    setStatus('pending')
    try {
      await activate.execute({ ...proof, password })
      if (mounted.current) { setPassword(''); setRepeat(''); setStatus('done') }
    } catch (failure) {
      if (!mounted.current) return
      const safe = failure instanceof OperationError ? failure : new OperationError('unavailable')
      setError(safe)
      setStatus(safe.code === 'invalid_activation' ? 'invalid' : 'ready')
      if (safe.code === 'invalid_activation') { setPassword(''); setRepeat('') }
    } finally { busy.current = false }
  }

  return { password, setPassword, repeat, setRepeat, fields, status, error, submit }
}
