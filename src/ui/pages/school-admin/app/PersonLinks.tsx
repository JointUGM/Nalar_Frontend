import { useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { Person, Relationship } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import { StudentPicker } from './StudentPicker'
import { Select } from '@/ui/components/select/Select'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'

const relationships: readonly [Relationship, string][] = [['ibu', 'Ibu'], ['ayah', 'Ayah'], ['wali', 'Wali']]
const refusals: Readonly<Record<string, string>> = {
  NOT_FOUND: 'Tautan ini tidak bisa diubah. Orang tua harus sudah tertaut ke siswa lain di sekolah ini, dan siswanya harus aktif.',
}

// Parent-child links of one person. A link is removed after a confirmation, because the parent loses the child's released results at once.
// A new link needs a parent the school already knows through another child; a brand-new parent is added with "Tambah orang".
export function PersonLinks({ service, schoolId, person, editable, onDone }: { service: SchoolAdminUseCases; schoolId: string; person: Person; editable: boolean; onDone: (message: string) => void }) {
  const isParent = person.role === 'parent'
  const others = isParent ? person.linked_children : person.linked_parents
  const [removing, setRemoving] = useState<string | null>(null)
  const [relationship, setRelationship] = useState<Relationship>('ibu')
  const command = useCommand()
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  const pair = (otherId: string) => isParent ? [person.user_id, otherId] as const : [otherId, person.user_id] as const

  async function unlink(otherId: string, otherName: string) {
    const [parentId, studentId] = pair(otherId)
    if (await command.run((signal) => service.unlinkParent(schoolId, parentId, studentId, signal))) onDone(`${otherName} tidak lagi tertaut ke ${person.full_name}.`)
  }
  async function link(student: { user_id: string; full_name: string }) {
    if (await command.run((signal) => service.linkParent(schoolId, person.user_id, student.user_id, relationship, signal))) onDone(`${student.full_name} ditautkan ke ${person.full_name}.`)
  }

  if (others.length === 0 && !(editable && isParent)) return null
  return <div>
    <strong>{isParent ? 'Anak' : 'Orang tua'}</strong>
    <ul className={shared.linkedList}>{others.map((other) => <li key={other.user_id} className={shared.linkedItem}>
      <div className={shared.linkedInfo}>
        <NalaAvatar seed={other.full_name} size={28} />
        <span>{other.full_name}</span>
      </div>
      {editable && (removing === other.user_id
        ? <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button tone="danger" pending={command.pending} pendingLabel="Melepas…" aria-label={`Ya, lepas ${other.full_name}`} onClick={() => void unlink(other.user_id, other.full_name)}>Ya, lepas</Button>
            <Button tone="secondary" disabled={command.pending} onClick={() => { command.reset(); setRemoving(null) }}>Batal</Button>
          </div>
        : <Button tone="ghost" aria-label={`Lepas ${other.full_name}`} disabled={command.pending} onClick={() => { command.reset(); setRemoving(other.user_id) }}>Lepas</Button>)}
      {removing === other.user_id && <div style={{ width: '100%', marginBlockStart: '8px' }}><Feedback tone="warning" title={`Lepas ${other.full_name}?`}>{isParent ? `${person.full_name} tidak bisa lagi melihat hasil ${other.full_name}.` : `${other.full_name} tidak bisa lagi melihat hasil ${person.full_name}.`}</Feedback></div>}
    </li>)}</ul>
    {editable && isParent && <>
      <Select
        label="Hubungan untuk anak baru"
        value={relationship}
        disabled={command.pending}
        onChange={(val) => setRelationship(val as Relationship)}
        options={relationships.map(([val, text]) => ({ value: val, label: text }))}
      />
      <StudentPicker service={service} schoolId={schoolId} exclude={others.map((other) => other.user_id)} disabled={command.pending} onPick={(student) => void link(student)} />
    </>}
    {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
  </div>
}
