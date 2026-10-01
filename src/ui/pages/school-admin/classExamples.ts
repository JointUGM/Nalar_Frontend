export type Grade = 7 | 8 | 9
export interface ClassExample { id: string; name: string; grade: Grade; students: number; homeroom: string }

export const gradeOptions: readonly Grade[] = [7, 8, 9]
export const homeroomTeachers = ['Agus Salim', 'Sari Wulandari', 'Ratna Dewi', 'Hari Purnomo']
export const unassignedHomeroom = 'Belum ditentukan'

export const classExamples: readonly ClassExample[] = gradeOptions.flatMap((grade) => ['A', 'B', 'C', 'D'].map((letter, index) => ({
  id: `${grade}${letter}`, name: `${grade}${letter}`, grade, students: 30 + ((grade + index) % 3), homeroom: homeroomTeachers[index],
})))

export function classNameFor(grade: Grade, letter: string): string { return `${grade}${letter.trim().toLocaleUpperCase('id-ID')}` }

export function validateClassLetter(classes: readonly ClassExample[], grade: Grade, letter: string): string | undefined {
  if (!/^[A-Za-z]$/.test(letter.trim())) return 'Isi satu huruf A–Z untuk nama kelas.'
  const name = classNameFor(grade, letter)
  if (classes.some((item) => item.id === name)) return `Kelas ${name} sudah ada dalam data contoh ini.`
}
