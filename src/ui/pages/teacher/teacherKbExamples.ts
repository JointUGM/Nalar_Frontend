export type KbStatus = 'approved' | 'review' | 'empty'
export interface KbTopic { id: string; name: string; status: KbStatus; concepts: number | null; misconceptions: number | null; file: string | null; when: string }

export const kbStatusLabels: Record<KbStatus, string> = { approved: 'Disetujui', review: 'Perlu tinjauan', empty: 'Kosong' }
export const kbGrade = 'Kelas 8'
export const kbOwnership = 'Anda pemilik · dipakai 3 guru IPA lain (hanya baca) · CP BSKAP 046/2025 Fase D'

export const kbTopicsBySchool: Readonly<Record<string, readonly KbTopic[]>> = {
  'SMPN 5 Yogyakarta': [
    { id: 'gaya-dan-gerak', name: 'Gaya dan Gerak', status: 'approved', concepts: 9, misconceptions: 14, file: 'IPA 8 Bab 3 - Gaya.pdf', when: '12 Sep' },
    { id: 'tekanan-zat', name: 'Tekanan Zat', status: 'review', concepts: 7, misconceptions: 9, file: 'IPA 8 Bab 4 - Tekanan Zat.pdf', when: 'Tadi pagi' },
    { id: 'getaran-dan-gelombang', name: 'Getaran dan Gelombang', status: 'empty', concepts: null, misconceptions: null, file: null, when: '' },
  ],
  'SMP Muhammadiyah 2': [],
}
