import { useCallback, useState } from 'react'
import { assignmentExamples, assignmentSummary, unassignedLabel, withAssignment } from './assignmentExamples'
import type { AssignmentRow } from './assignmentExamples'

export function useSchoolAssignmentsViewModel() {
  const [rows, setRows] = useState<readonly AssignmentRow[]>(assignmentExamples)
  const [editing, setEditing] = useState<{ classroom: string; subject: string } | null>(null)
  const [message, setMessage] = useState('')
  const applyAssignment = useCallback((classroom: string, subject: string, teacher: string | null) => {
    setRows((current) => withAssignment(current, classroom, subject, teacher))
    setMessage(`Penugasan ${subject} kelas ${classroom} diubah ke ${teacher ?? unassignedLabel.toLocaleLowerCase('id-ID')} dalam simulasi lokal. Data sekolah dan akses guru tidak berubah; muat ulang akan mengembalikan data contoh.`)
  }, [])
  return { rows, editing, setEditing, message, applyAssignment, summary: assignmentSummary(rows) }
}
