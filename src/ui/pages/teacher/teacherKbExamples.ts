export type KbStatus = 'approved' | 'review' | 'empty'
export interface KbTopic { id: string; name: string; status: KbStatus; concepts: number | null; misconceptions: number | null; file: string | null; when: string }

export const kbStatusLabels: Record<KbStatus, string> = { approved: 'Disetujui', review: 'Perlu tinjauan', empty: 'Kosong' }
export const kbBuildSteps = ['Membaca PDF', 'Memotong teks dan membuat penanda', 'Menyusun konsep dan urutannya', 'Mencocokkan dengan Capaian Pembelajaran', 'Menyusun miskonsepsi dan contoh pembanding'] as const
export const kbFailureStep = 2
export const kbStepMs = 1400
export const kbMaxPdfBytes = 50 * 1024 * 1024
export const kbSampleFile = { name: 'IPA 8 Bab 4 - Tekanan Zat.pdf', bytes: 4_404_019, pages: 18 }
export const kbGrade = 'Kelas 8'
export const kbOwnership = 'Anda pemilik · dipakai 3 guru IPA lain (hanya baca) · CP BSKAP 046/2025 Fase D'

export const kbTopicsBySchool: Readonly<Record<string, readonly KbTopic[]>> = {
  'SMPN 5 Yogyakarta': [
    { id: 'gaya-dan-gerak', name: 'Gaya dan Gerak', status: 'approved', concepts: 9, misconceptions: 14, file: 'IPA 8 Bab 3 - Gaya.pdf', when: '12 Sep' },
    { id: 'tekanan-zat', name: 'Tekanan Zat', status: 'review', concepts: 7, misconceptions: 4, file: 'IPA 8 Bab 4 - Tekanan Zat.pdf', when: 'Tadi pagi' },
    { id: 'getaran-dan-gelombang', name: 'Getaran dan Gelombang', status: 'empty', concepts: null, misconceptions: null, file: null, when: '' },
  ],
  'SMP Muhammadiyah 2': [],
}
