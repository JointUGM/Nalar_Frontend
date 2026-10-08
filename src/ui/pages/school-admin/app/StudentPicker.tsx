import { useCallback, useEffect, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { LinkedPerson } from '@/domain/model/SchoolAdmin'
import { Field } from '@/ui/components/field/Field'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'
import shared from '@/ui/pages/school-admin/dialogForm.styles'

// Finds one student by name or NISN; the admin picks from the first page of matches.
export function StudentPicker({ service, schoolId, exclude, disabled, onPick }: { service: SchoolAdminUseCases; schoolId: string; exclude: readonly string[]; disabled?: boolean; onPick: (student: LinkedPerson) => void }) {
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  useEffect(() => { const timer = setTimeout(() => setQ(search.trim()), 300); return () => clearTimeout(timer) }, [search])
  const read = useCallback(async (signal: AbortSignal) => q ? (await service.people(schoolId, 'student', q, null, signal)).items : [], [service, schoolId, q])
  const found = (useLiveResource(read, noPollMs).data ?? []).filter((student) => !exclude.includes(student.user_id))
  return <>
    <Field label="Cari siswa (nama atau NISN)" type="search" value={search} disabled={disabled} onChange={(event) => setSearch(event.target.value)} />
    {found.length > 0 && <ul className={shared.pickerList} aria-label="Hasil pencarian siswa">{found.map((student) => <li key={student.user_id}>
      <button type="button" aria-label={`${student.full_name}${student.class_name ? ` · ${student.class_name}` : ''}`} className={shared.pickerItem} disabled={disabled} onClick={() => onPick({ user_id: student.user_id, full_name: student.full_name })}>
        <NalaAvatar seed={student.full_name} size={24} />
        <span className={shared.personName}>{student.full_name}</span>
        {student.class_name && <span className={shared.selectionBadge}>· {student.class_name}</span>}
      </button>
    </li>)}</ul>}
  </>
}
