import { useState } from 'react'
import { releaseExample, releaseSummary } from './teacherReleaseExamples'
import { useSessionTarget } from './useSessionTarget'

export function useTeacherReleaseViewModel() {
  const { mission, klass } = useSessionTarget()
  const [selected, setSelected] = useState(0)
  const [released, setReleased] = useState(false)
  const rows = releaseExample.students.map((name, index) => ({ name, index, ready: !releaseExample.unfinished.includes(index) }))
  const student = rows[selected]

  return {
    mission, klass, rows, released, selected,
    readyCount: rows.filter((row) => row.ready).length,
    initials: student.name.split(' ').map((part) => part[0]).join(''),
    student: student.name,
    summary: releaseSummary(student.name, selected),
    // A student who has not finished has no summary to preview.
    select: (index: number) => { if (rows[index]?.ready) setSelected(index) },
    release: () => setReleased(true),
  }
}
