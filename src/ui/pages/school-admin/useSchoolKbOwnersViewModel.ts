import { useCallback, useState } from 'react'
import { teacherExamples } from './assignmentExamples'
import { kbExamples, ownerStateFor } from './kbOwnerExamples'
import type { KbExample } from './kbOwnerExamples'

export function useSchoolKbOwnersViewModel() {
  const [kbs, setKbs] = useState<readonly KbExample[]>(kbExamples)
  const [editing, setEditing] = useState<KbExample | null>(null)
  const [message, setMessage] = useState('')
  const applyOwner = useCallback((id: string, owner: string) => {
    const status = teacherExamples.find((teacher) => teacher.name === owner)?.status ?? 'Aktif'
    setKbs((current) => current.map((kb) => kb.id === id ? { ...kb, owner, ownerState: ownerStateFor(status) } : kb))
    const subject = kbExamples.find((kb) => kb.id === id)?.subject ?? ''
    setMessage(`Pemilik basis pengetahuan ${subject} dialihkan ke ${owner} dalam simulasi lokal. Data sekolah dan akses guru tidak berubah; muat ulang akan mengembalikan data contoh.`)
  }, [])
  return { kbs, editing, setEditing, message, applyOwner }
}
