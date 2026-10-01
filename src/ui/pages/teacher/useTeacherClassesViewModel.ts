import { useState } from 'react'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherSchools } from './teacherHomeExamples'
import { classRoster } from './teacherClassExamples'
import type { ClassStudentStatus } from './teacherClassExamples'

export type StatusFilter = 'all' | ClassStudentStatus

export function useTeacherClassesViewModel() {
  const { school: schoolName } = useTeacherContext()
  const classes = (teacherSchools.find((item) => item.name === schoolName) ?? teacherSchools[0]).classes
  const [className, setClassName] = useState(classes[0]?.name ?? '')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const klass = classes.find((item) => item.name === className) ?? classes[0]
  const roster = klass ? classRoster(klass.students) : []
  const needle = query.trim().toLocaleLowerCase('id-ID')
  const students = roster.filter((student) => (status === 'all' || student.status === status) && student.name.toLocaleLowerCase('id-ID').includes(needle))
  return { classes, klass, roster, students, query, setQuery, status, setStatus, selectClass: setClassName }
}
