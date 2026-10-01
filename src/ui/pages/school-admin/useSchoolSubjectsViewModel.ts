import { useCallback, useState } from 'react'
import { subjectExamples, unmappedLabel } from './subjectExamples'
import type { SubjectExample } from './subjectExamples'

export function useSchoolSubjectsViewModel() {
  const [subjects, setSubjects] = useState<readonly SubjectExample[]>(subjectExamples)
  const [editing, setEditing] = useState<SubjectExample | null>(null)
  const [message, setMessage] = useState('')
  const applyMapping = useCallback((id: string, cp: string | null) => {
    setSubjects((current) => current.map((item) => item.id === id ? { ...item, cp } : item))
    const name = subjectExamples.find((item) => item.id === id)?.name ?? ''
    setMessage(`Pemetaan ${name} diubah ke ${cp ?? unmappedLabel.toLocaleLowerCase('id-ID')} dalam simulasi lokal. Data sekolah tidak berubah; muat ulang akan mengembalikan data contoh.`)
  }, [])
  return { subjects, editing, setEditing, message, applyMapping }
}
