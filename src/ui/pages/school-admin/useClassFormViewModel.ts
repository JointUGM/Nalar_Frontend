import { useEffect, useRef, useState } from 'react'
import { classNameFor, unassignedHomeroom, validateClassLetter } from './classExamples'
import type { ClassExample, Grade } from './classExamples'

type Fields = { grade: Grade; letter: string; homeroom: string }
export function useClassFormViewModel(classes: readonly ClassExample[], onSave: (item: ClassExample) => void) {
  const [fields, setFields] = useState<Fields>({ grade: 8, letter: '', homeroom: '' })
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<'editing' | 'pending' | 'failure' | 'success'>('editing')
  const [outcome, setOutcome] = useState<'success' | 'failure'>('success')
  const submitting = useRef(false)
  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => {
      if (outcome === 'success') { const name = classNameFor(fields.grade, fields.letter); onSave({ id: name, name, grade: fields.grade, students: 0, homeroom: fields.homeroom || unassignedHomeroom }) }
      setStatus(outcome); submitting.current = false
    }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome, onSave, fields])
  function update(next: Partial<Fields>) {
    if (submitting.current || status === 'success') return
    setFields((current) => ({ ...current, ...next })); setError(undefined); setStatus('editing')
  }
  function submit(): boolean {
    if (submitting.current || status === 'success') return true
    const problem = validateClassLetter(classes, fields.grade, fields.letter)
    setError(problem)
    if (problem) return false
    submitting.current = true; setStatus('pending')
    return true
  }
  return { fields, error, status, outcome, setOutcome, update, submit, name: classNameFor(fields.grade, fields.letter) }
}
