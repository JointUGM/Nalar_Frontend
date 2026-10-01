export const assignmentSubjects = ['IPA', 'Matematika', 'Bahasa Indonesia', 'IPS']
export const unassignedLabel = 'Belum ditugaskan'

export interface AssignmentRow { classroom: string; teachers: Readonly<Record<string, string | null>> }
export interface TeacherExample { name: string; status: 'Aktif' | 'Undangan terkirim' }

export const teacherExamples: readonly TeacherExample[] = [
  { name: 'Sari Wulandari', status: 'Aktif' }, { name: 'Agus Salim', status: 'Aktif' }, { name: 'Ratna Dewi', status: 'Undangan terkirim' },
  { name: 'Hari Purnomo', status: 'Aktif' }, { name: 'Dewi Lestari', status: 'Aktif' },
]

const byClass = [
  ['Sari Wulandari', 'Agus Salim', 'Dewi Lestari', 'Hari Purnomo'],
  ['Sari Wulandari', 'Agus Salim', 'Dewi Lestari', 'Hari Purnomo'],
  ['Sari Wulandari', 'Agus Salim', null, 'Hari Purnomo'],
  ['Ratna Dewi', 'Agus Salim', 'Dewi Lestari', 'Hari Purnomo'],
]

export const assignmentExamples: readonly AssignmentRow[] = ['8A', '8B', '8C', '8D'].map((classroom, row) => ({
  classroom, teachers: Object.fromEntries(assignmentSubjects.map((subject, column) => [subject, byClass[row][column]])),
}))

export function withAssignment(rows: readonly AssignmentRow[], classroom: string, subject: string, teacher: string | null): AssignmentRow[] {
  return rows.map((row) => row.classroom === classroom ? { ...row, teachers: { ...row.teachers, [subject]: teacher } } : row)
}

export function assignmentSummary(rows: readonly AssignmentRow[]): { filled: number; total: number } {
  const cells = rows.flatMap((row) => assignmentSubjects.map((subject) => row.teachers[subject]))
  return { filled: cells.filter(Boolean).length, total: cells.length }
}
