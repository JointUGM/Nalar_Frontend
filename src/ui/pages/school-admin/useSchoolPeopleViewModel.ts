import { useCallback, useRef, useState } from 'react'
import { peopleExamples } from './peopleExamples'
import type { PeopleRole, PersonExample } from './peopleExamples'

export function useSchoolPeopleViewModel() {
  const [role, setRole] = useState<PeopleRole>('student')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<PersonExample | null>(null)
  const [students, setStudents] = useState<readonly PersonExample[]>(peopleExamples.student)
  const [editor, setEditor] = useState<{ person: PersonExample | null } | null>(null)
  const [message, setMessage] = useState('')
  const nextId = useRef(0)
  const [newId, setNewId] = useState('')
  const term = query.trim().toLocaleLowerCase('id-ID')
  const dataset = role === 'student' ? students : peopleExamples[role]
  const matching = dataset.filter((person) => `${person.name} ${person.identifier}`.toLocaleLowerCase('id-ID').includes(term))
  const pageSize = 6
  function changeRole(value: PeopleRole) { setRole(value); setQuery(''); setPage(0); setSelected(null) }
  function search(value: string) { setQuery(value); setPage(0); setSelected(null) }
  const saveStudent = useCallback((person: PersonExample, previousClassroom?: string) => {
    setStudents((current) => current.some((item) => item.id === person.id) ? current.map((item) => item.id === person.id ? person : item) : [person, ...current])
    const moved = previousClassroom !== undefined && previousClassroom !== person.classroom
    setMessage(`${moved ? `${person.name} dipindahkan dari ${previousClassroom} ke ${person.classroom}` : 'Perubahan siswa tersimpan'} dalam simulasi lokal. Data sekolah dan akses akun tidak berubah; muat ulang akan mengembalikan data contoh.`)
  }, [])
  const applyStudentAction = useCallback((person: PersonExample | null, notice: string) => {
    if (person) setStudents((current) => current.map((item) => item.id === person.id ? person : item))
    setMessage(notice)
  }, [])
  function addStudent() { setEditor({ person: null }); setNewId(`review-student-${++nextId.current}`) }
  return { role, query, page, selected, editor, students, message, total: dataset.length, newId, addStudent, setEditor, saveStudent, applyStudentAction, people: matching.slice(page * pageSize, (page + 1) * pageSize), count: matching.length, pageCount: Math.max(1, Math.ceil(matching.length / pageSize)), changeRole, search, setPage, setSelected }
}
