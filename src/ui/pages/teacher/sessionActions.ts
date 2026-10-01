import type { SessionAction } from './SessionActionDialog'
import { publicationExample } from './teacherMissionExamples'

type Rows = readonly (readonly [string, string])[]

export const startSessionAction = (rows: Rows): SessionAction => ({
  title: 'Mulai sesi (simulasi)', description: 'Siswa yang sudah bergabung mulai mengerjakan soal pembuka. Lobi tidak menilai apa pun.', rows,
  note: 'Siswa yang belum bergabung masih bisa masuk sampai penerimaan ditutup. Ini hanya simulasi; tidak ada sesi yang dimulai.',
  confirmLabel: 'Mulai sesi', doneText: 'Tampilan berpindah ke sesi langsung. Tidak ada siswa yang menerima soal.',
})

export const closeAdmissionAction = (rows: Rows): SessionAction => ({
  title: 'Tutup penerimaan (simulasi)', description: 'Siswa baru tidak dapat bergabung lagi dengan kode ini.', rows,
  note: `Siswa yang sudah mulai tetap boleh menyelesaikan sesinya sampai ${publicationExample.maxDuration} setelah penerimaan ditutup; batas waktu mereka tidak berubah. Ini hanya simulasi.`,
  confirmLabel: 'Tutup penerimaan', doneText: 'Kode tidak lagi menerima siswa baru. Tidak ada batas waktu siswa yang diubah.',
})
