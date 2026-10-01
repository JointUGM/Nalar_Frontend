export type PeopleRole = 'student' | 'teacher' | 'parent'
export interface PersonExample { id: string; name: string; identifier: string; classroom: string; status: 'Aktif' | 'Undangan terkirim' | 'Menunggu aktivasi' | 'Nonaktif'; parentLink?: string }

export const schoolExample = { name: 'SMPN 5 Yogyakarta', year: '2026/2027', admin: 'Hendra Santoso' }
export const roleLabels = { student: 'Siswa', teacher: 'Guru', parent: 'Orang tua' }
export const classOptions = ['8A', '8B', '8C', '8D']
const person = (name: string, identifier: string, classroom: string, status: PersonExample['status'], parentLink?: string): PersonExample => ({ id: identifier, name, identifier, classroom, status, parentLink })
export const peopleExamples: Record<PeopleRole, readonly PersonExample[]> = {
  student: [
    person('Adinda Putri', '0098123401', '8B', 'Aktif', 'Siti Aminah'), person('Bagas Saputra', '0098123402', '8B', 'Aktif', 'Yoga Pratama'),
    person('Citra Maharani', '0098123403', '8B', 'Undangan terkirim'), person('Dimas Prasetyo', '0098123404', '8A', 'Aktif'),
    person('Eka Lestari', '0098123405', '8A', 'Aktif'), person('Raka Pratama', '0098123418', '8B', 'Aktif', 'Bambang Wicaksono · tanpa email'), person('Rizky Firmansyah', '0098123477', '9C', 'Nonaktif'),
  ],
  teacher: [person('Sari Wulandari', 'sari.wulandari@example.test', '—', 'Aktif'), person('Agus Salim', 'agus.salim@example.test', '—', 'Aktif'), person('Ratna Dewi', 'ratna.dewi@example.test', '—', 'Undangan terkirim')],
  parent: [person('Bambang Wicaksono', 'Tanpa email · slip dicetak', '—', 'Menunggu aktivasi'), person('Siti Aminah', 'siti.aminah@example.test', '—', 'Aktif'), person('Yoga Pratama', 'yoga.p@example.test', '—', 'Aktif')],
}
