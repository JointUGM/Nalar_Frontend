import { useEffect, useRef, useState } from 'react'
import type { AuthSession } from '@/domain/model/AuthSession'
import { CredentialValidationError } from '@/domain/model/AuthSession'
import { OperationError } from '@/domain/model/OperationError'
import type { AccountDependencies } from './AccountDependencies'

type Phase = 'checking' | 'check-failed' | 'signed-out' | 'signed-in'

export function useAccountViewModel(dependencies: AccountDependencies | null) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phase, setPhase] = useState<Phase>(dependencies ? 'checking' : 'signed-out')
  const [pending, setPending] = useState<'sign-in' | 'sign-out' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState<CredentialValidationError['fields']>({})
  const [attempt, setAttempt] = useState(0)
  const [owner, setOwner] = useState(dependencies)
  const context = useRef({ generation: 0, busy: false })

  if (owner !== dependencies) {
    setOwner(dependencies)
    setEmail('')
    setPassword('')
    setError(null)
    setFields({})
    setPending(null)
    setPhase(dependencies ? 'checking' : 'signed-out')
  }

  useEffect(() => {
    const work = context.current
    const generation = ++work.generation
    work.busy = false
    let active = true
    let checking = true
    let notification: AuthSession | null | undefined
    if (!dependencies) return

    function showSession(value: AuthSession | null) {
      setPhase(value ? 'signed-in' : 'signed-out')
      setEmail('')
      setPassword('')
      setFields({})
    }
    const stop = dependencies.session.execute((value) => {
      if (!active) return
      if (checking) notification = value
      else showSession(value)
    })
    // A session-read outage must not prompt an unnecessary new sign-in.
    void dependencies.session.read().then((value) => {
      if (active) showSession(notification === undefined ? value : notification)
    }).catch((cause: unknown) => {
      if (active) {
        setPhase('check-failed')
        setError(cause instanceof OperationError ? cause.message : new OperationError('unavailable').message)
      }
    }).finally(() => { checking = false })

    return () => {
      active = false
      if (work.generation === generation) ++work.generation
      stop()
    }
  }, [dependencies, attempt])

  async function submit(): Promise<void> {
    if (!dependencies || phase !== 'signed-out' || context.current.busy) return
    const generation = context.current.generation
    context.current.busy = true
    setPending('sign-in')
    setError(null)
    setFields({})
    try {
      await dependencies.signIn.execute({ email, password })
      if (context.current.generation !== generation) return
      setEmail('')
      setPassword('')
      setPhase('signed-in')
    } catch (cause) {
      if (context.current.generation !== generation) return
      if (cause instanceof CredentialValidationError) {
        setFields(cause.fields)
        setError(cause.message)
      } else setError(cause instanceof OperationError ? cause.message : new OperationError('unavailable').message)
    } finally {
      if (context.current.generation === generation) {
        context.current.busy = false
        setPending(null)
      }
    }
  }

  async function signOut(): Promise<void> {
    if (!dependencies || phase !== 'signed-in' || context.current.busy) return
    const generation = context.current.generation
    context.current.busy = true
    setPending('sign-out')
    setError(null)
    try {
      await dependencies.signOut.execute()
      if (context.current.generation !== generation) return
      setEmail('')
      setPassword('')
      setPhase('signed-out')
    } catch (cause) {
      if (context.current.generation === generation) {
        setError(cause instanceof OperationError ? cause.message : new OperationError('unavailable').message)
      }
    } finally {
      if (context.current.generation === generation) {
        context.current.busy = false
        setPending(null)
      }
    }
  }

  return { email, setEmail, password, setPassword, phase, pending, error, fields,
    submit, signOut, retry: () => {
      setPhase('checking')
      setError(null)
      setAttempt((value) => value + 1)
    } }
}
