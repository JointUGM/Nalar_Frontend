import { useEffect, useRef, useState } from 'react'
import { classOptions } from './peopleExamples'
import type { PersonExample } from './peopleExamples'

type Fields = { name: string; identifier: string; classroom: string }
export function useStudentFormViewModel(person: PersonExample | null, newId: string, students: readonly PersonExample[], onSave: (person: PersonExample, previousClassroom?: string) => void) {
  const [fields, setFields] = useState<Fields>({ name: person?.name ?? '', identifier: person?.identifier ?? '', classroom: person?.classroom ?? '' })
  const [errors, setErrors] = useState<Partial<Fields>>({})
  const [status, setStatus] = useState<'editing' | 'confirming' | 'pending' | 'failure' | 'success'>('editing')
  const [outcome, setOutcome] = useState<'success' | 'failure'>('success')
  const submitting = useRef(false)
  const canMove = person !== null && person.status !== 'Nonaktif'
  const moving = canMove && fields.classroom !== person.classroom
  useEffect(() => {
    if (status !== 'pending') return
    const timer = setTimeout(() => {
      if (outcome === 'success') onSave({ id: person?.id ?? newId, name: fields.name.trim(), identifier: fields.identifier.trim(), classroom: fields.classroom, status: person?.status ?? 'Menunggu aktivasi' }, person?.classroom)
      setStatus(outcome); submitting.current = false
    }, 650)
    return () => clearTimeout(timer)
  }, [status, outcome, onSave, person, newId, fields])
  function update(field: keyof Fields, value: string) {
    if (submitting.current || status === 'success' || (field === 'classroom' && person && !canMove)) return
    setFields((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); setStatus('editing')
  }
  function review(): keyof Fields | undefined {
    if (submitting.current || status === 'success') return
    const next: Partial<Fields> = {}
    if (!fields.name.trim()) next.name = 'Isi nama lengkap siswa.'
    else if (fields.name.trim().length > 120) next.name = 'Nama maksimal 120 karakter untuk pratinjau.'
    if (!/^\d{10}$/.test(fields.identifier.trim())) next.identifier = 'NISN harus berupa 10 digit. Nol di awal tetap disimpan.'
    else if (students.some((item) => item.id !== person?.id && item.identifier === fields.identifier.trim())) next.identifier = 'NISN sudah dipakai siswa lain dalam data contoh ini.'
    if (!person && !classOptions.includes(fields.classroom)) next.classroom = 'Pilih kelas contoh untuk siswa baru.'
    setErrors(next)
    const first = (['name', 'identifier', 'classroom'] as const).find((field) => next[field])
    if (!first) setStatus('confirming')
    return first
  }
  function confirm() { if (status !== 'confirming' || submitting.current) return; submitting.current = true; setStatus('pending') }
  return { fields, errors, status, outcome, canMove, moving, setOutcome, update, review, confirm, revise: () => setStatus('editing') }
}
