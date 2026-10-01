import { useEffect, useRef, useState } from 'react'

type Status = 'editing' | 'confirming' | 'pending' | 'success' | 'failure'

export function useCurriculumPublicationViewModel(outcome: 'success' | 'failure') {
  const [decision, setDecision] = useState('')
  const [documentSelected, setDocumentSelected] = useState(true)
  const [error, setError] = useState<'decision' | 'document'>()
  const [status, setStatus] = useState<Status>('editing')
  const submitting = useRef(false)

  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => { submitting.current = false; setStatus(outcome) }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome])

  function review() {
    if (status !== 'editing') return
    if (!decision.trim() || !documentSelected) {
      const field = decision.trim() ? 'document' : 'decision'
      setError(field)
      return field
    }
    setDecision(decision.trim())
    setStatus('confirming')
  }

  function confirm() {
    if (submitting.current || (status !== 'confirming' && status !== 'failure')) return
    submitting.current = true
    setStatus('pending')
  }

  function edit() {
    if (!submitting.current && status !== 'success') setStatus('editing')
  }

  function updateDecision(value: string) {
    if (status !== 'editing') return
    setDecision(value)
    setError(undefined)
  }

  function selectDocument(selected: boolean) {
    if (status !== 'editing') return
    setDocumentSelected(selected)
    setError(undefined)
  }

  return { decision, documentSelected, error, status, review, confirm, edit, updateDecision, selectDocument }
}
