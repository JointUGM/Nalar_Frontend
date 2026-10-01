import { useCallback, useState } from 'react'
import { classExamples, gradeOptions } from './classExamples'
import type { ClassExample } from './classExamples'

export function useSchoolClassesViewModel() {
  const [classes, setClasses] = useState<readonly ClassExample[]>(classExamples)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const addClass = useCallback((item: ClassExample) => {
    setClasses((current) => current.some((existing) => existing.id === item.id) ? current : [...current, item])
    setMessage(`Kelas ${item.name} ditambahkan dalam simulasi lokal. Data sekolah tidak berubah; muat ulang akan mengembalikan data contoh.`)
  }, [])
  const groups = gradeOptions.map((grade) => ({ grade, items: classes.filter((item) => item.grade === grade).sort((a, b) => a.name.localeCompare(b.name, 'id-ID')) }))
  return { classes, groups, creating, setCreating, message, addClass }
}
