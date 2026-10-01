import { useState } from 'react'
import { peopleExamples } from './peopleExamples'
import type { PeopleRole, PersonExample } from './peopleExamples'

export function useSchoolPeopleViewModel() {
  const [role, setRole] = useState<PeopleRole>('student')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<PersonExample | null>(null)
  const term = query.trim().toLocaleLowerCase('id-ID')
  const matching = peopleExamples[role].filter((person) => `${person.name} ${person.identifier}`.toLocaleLowerCase('id-ID').includes(term))
  const pageSize = 6
  function changeRole(value: PeopleRole) { setRole(value); setQuery(''); setPage(0); setSelected(null) }
  function search(value: string) { setQuery(value); setPage(0); setSelected(null) }
  return { role, query, page, selected, people: matching.slice(page * pageSize, (page + 1) * pageSize), count: matching.length, pageCount: Math.max(1, Math.ceil(matching.length / pageSize)), changeRole, search, setPage, setSelected }
}
