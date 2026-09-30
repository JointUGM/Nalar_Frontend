import { useEffect, useState } from 'react'
import type { Identity } from '@/domain/model/Identity'
import type { AuthSession } from '@/domain/model/AuthSession'
import { OperationError } from '@/domain/model/OperationError'
import type { AccountDependencies } from './AccountDependencies'

type AccessState =
  | { phase: 'checking' | 'signed-out'; identity: null; error: null }
  | { phase: 'ready'; identity: Identity; error: null }
  | { phase: 'denied' | 'unavailable'; identity: null; error: string }

export function useIdentityAccessViewModel(dependencies: AccountDependencies | null) {
  const [state, setState] = useState<AccessState>({ phase: 'checking', identity: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    let version = 0
    let controller: AbortController | null = null
    let reading = true
    let notification: AuthSession | null | undefined

    async function check(session: AuthSession | null) {
      controller?.abort()
      const current = ++version
      if (!session) {
        setState({ phase: 'signed-out', identity: null, error: null })
        return
      }
      setState({ phase: 'checking', identity: null, error: null })
      if (!dependencies?.identity) {
        setState({ phase: 'unavailable', identity: null, error: new OperationError('unavailable').message })
        return
      }
      controller = new AbortController()
      try {
        const identity = await dependencies.identity.execute(controller.signal)
        if (!active || current !== version) return
        if (identity.userId !== session.userId) throw new OperationError('invalid_response')
        setState({ phase: 'ready', identity, error: null })
      } catch (cause) {
        if (!active || current !== version) return
        const error = cause instanceof OperationError ? cause : new OperationError('unavailable')
        if (error.code === 'unauthenticated') {
          setState({ phase: 'signed-out', identity: null, error: null })
          void dependencies.signOut.execute().catch(() => {})
        } else if (error.code === 'forbidden') {
          setState({ phase: 'denied', identity: null, error: error.message })
        } else {
          setState({ phase: 'unavailable', identity: null, error: error.message })
        }
      }
    }

    if (!dependencies) {
      queueMicrotask(() => { if (active) setState({ phase: 'signed-out', identity: null, error: null }) })
      return () => { active = false }
    }
    const stop = dependencies.session.execute((session) => {
      if (!active) return
      if (reading) notification = session
      else void check(session)
    })
    void dependencies.session.read().then((session) => {
      reading = false
      if (active) void check(notification === undefined ? session : notification)
    }).catch((cause: unknown) => {
      reading = false
      if (!active) return
      const error = cause instanceof OperationError ? cause : new OperationError('unavailable')
      setState({ phase: 'unavailable', identity: null, error: error.message })
    })
    return () => { active = false; ++version; controller?.abort(); stop() }
  }, [dependencies, attempt])

  return { ...state, retry: () => {
    setState({ phase: 'checking', identity: null, error: null })
    setAttempt((value) => value + 1)
  } }
}
