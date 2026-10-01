import { teacherExamples } from './assignmentExamples'
import type { AssignmentRow, TeacherExample } from './assignmentExamples'

export type OwnerState = 'active' | 'invited' | 'left'
export interface KbExample { id: string; subject: string; topics: number; concepts: number; owner: string; ownerState: OwnerState }

export const kbExamples: readonly KbExample[] = [
  { id: 'ipa', subject: 'IPA', topics: 2, concepts: 16, owner: 'Sari Wulandari', ownerState: 'active' },
  { id: 'ips', subject: 'IPS', topics: 1, concepts: 8, owner: 'Hari Purnomo', ownerState: 'left' },
]

export const ownerStateLabels: Record<OwnerState, string> = { active: 'Guru aktif', invited: 'Undangan terkirim', left: 'Sudah tidak mengajar di sini' }

const departedTeachers = kbExamples.filter((kb) => kb.ownerState === 'left').map((kb) => kb.owner)

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toLocaleUpperCase('id-ID')).join('')
}

export function ownerStateFor(status: TeacherExample['status']): OwnerState { return status === 'Aktif' ? 'active' : 'invited' }

export interface OwnerCandidate { name: string; status: TeacherExample['status']; teaches: boolean }

export function eligibleOwners(kb: KbExample, rows: readonly AssignmentRow[]): OwnerCandidate[] {
  const teaching = new Set(rows.map((row) => row.teachers[kb.subject]))
  return teacherExamples
    .filter((teacher) => teacher.name !== kb.owner && !departedTeachers.includes(teacher.name))
    .map((teacher) => ({ name: teacher.name, status: teacher.status, teaches: teaching.has(teacher.name) }))
    .sort((a, b) => Number(b.teaches) - Number(a.teaches))
}
