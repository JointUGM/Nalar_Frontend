// Supplied "NALAR — Orang tua" sample: Bambang Wicaksono with two linked children. Everything here is fictional and already released
// by the teacher. There is no score, flag, class comparison or unreleased title, count or status anywhere in it.
import type { ParentChild } from '@/ui/components/parent-shell/ParentContext'

export const parentUser = 'Bambang Wicaksono'
export const homePath = '/review/parent/home'
export const weekShort = '21–27 September'
export const week = `${weekShort} 2026`

export interface ChildNews {
  kpis: readonly { label: string; value: string; caption: string; trend: readonly number[] }[]
  summary: { released: string; subject: string; teacher: string; mission: string; reflection: string; text: string; tryAtHome: string }
  concepts: readonly { name: string; status: 'Sudah dipahami' | 'Berkembang'; from: string }[]
  talk: readonly { question: string; from: string }[]
  /** The shorter wording of the weekly email. */
  email: { teacher: string; text: string; tryAtHome: string }
}

export const settingsPath = '/review/parent/settings'
export const emailSamplePath = '/review/parent/settings/email'
// Fictional contact. The weekly email is a preview only: nothing is ever sent.
export const account = { email: 'bambang.w@gmail.com', greeting: 'Bapak Bambang', schedule: 'Senin, 07.00', sender: 'kabar@nalar.id' }

export const reflectionsPath = '/review/parent/reflections'
export const reflectionPath = (id: string) => `${reflectionsPath}/${id}`

// A released reflection. Only the first one has the full write-up in the supplied sample; the others show the released excerpt and the
// question to ask at home, and nothing is invented for the rest. Prose is plain text and is rendered as such.
export interface ParentReflection {
  id: string; date: string; title: string; subject: string; excerpt: string; question: string
  detail?: { released: string; good: string; shift: string; understood: readonly string[]; growing: readonly string[]; tryAtHome: string }
}

export const childrenExample: readonly ParentChild[] = [
  { id: 'raka', name: 'Raka Pratama', initials: 'R', detail: '8B · SMPN 5 Yogyakarta', klass: '8B', tone: 'warm' },
  { id: 'nadia', name: 'Nadia Pratama', initials: 'N', detail: '7A · SMP Muhammadiyah 2', klass: '7A', tone: 'info' },
]

// A child with no entry here has no released reflection, and the list says only that.
export const reflections: Readonly<Record<string, readonly ParentReflection[]>> = {
  raka: [
    { id: 'kelereng', date: '24 Sep 2026', title: 'Kenapa kelereng berhenti?', subject: 'IPA · Bu Sari',
      excerpt: 'Raka memakai contoh es dan karpet untuk menjelaskan kenapa gesekan penting.',
      question: 'Kalau tidak ada gesekan sama sekali, apa yang akan terjadi pada kelereng itu?',
      detail: {
        released: '24 September 2026 · dirilis Bu Sari Wulandari',
        good: 'Raka memakai contoh es dan karpet untuk menjelaskan kenapa gesekan penting. Penjelasannya makin rinci di setiap pertanyaan.',
        shift: 'Awalnya Raka bilang kelereng berhenti karena dorongannya habis. Setelah memikirkan pesawat luar angkasa, ia menyadari ada gaya yang melawan gerak kelereng.',
        understood: ['Gaya gesek'], growing: ['Kelembaman'],
        tryAtHome: 'Gelindingkan bola di lantai lalu di karpet. Minta Raka menjelaskan bedanya.',
      } },
    { id: 'bola', date: '17 Sep 2026', title: 'Bola yang dilempar ke atas', subject: 'IPA · Bu Sari',
      excerpt: 'Raka menjelaskan arah gaya gravitasi dengan jelas, bahkan saat bola sedang naik.',
      question: 'Di titik paling tinggi, apakah bola itu sedang diberi gaya?' },
    { id: 'tarik-tambang', date: '10 Sep 2026', title: 'Tarik tambang', subject: 'IPA · Bu Sari',
      excerpt: 'Raka berubah pikiran soal tim yang “lebih kuat” setelah membandingkan dua gaya.',
      question: 'Kalau dua tim sama kuat, apakah talinya diam atau bergerak?' },
  ],
}

// Only a child whose teacher has released something has news. The other child's page is a neutral "nothing yet" and says nothing about
// work that is still with the teacher.
export const news: Readonly<Record<string, ChildNews>> = {
  raka: {
    kpis: [
      { label: 'Misi selesai', value: '4', caption: 'Semester ini', trend: [1, 2, 3, 4] },
      { label: 'Sudah dipahami', value: '3 konsep', caption: 'Gaya dan Gerak', trend: [0, 1, 2, 3] },
      { label: 'Masih berkembang', value: '2 konsep', caption: 'Sedang dipelajari', trend: [3, 3, 2, 2] },
      { label: 'Berubah pikiran', value: '3 kali', caption: 'Menemukan alasan sendiri', trend: [0, 1, 1, 3] },
    ],
    summary: {
      released: 'Dirilis 24 Sep, 09.14', subject: 'IPA · Gaya dan Gerak', teacher: 'Bu Sari Wulandari', mission: 'Kenapa kelereng berhenti?',
      reflection: 'kelereng',
      text: 'Raka awalnya berpikir dorongan bisa habis, lalu mengubah pendapatnya sendiri setelah memikirkan contoh pesawat luar angkasa. Ia sudah bisa menyebut gaya yang melawan gerak benda, dan masih mengembangkan pemahaman tentang kelembaman.',
      tryAtHome: 'Gelindingkan bola di lantai lalu di karpet. Minta Raka menjelaskan bedanya.',
    },
    concepts: [
      { name: 'Gaya gesek', status: 'Sudah dipahami', from: 'Kenapa kelereng berhenti?' },
      { name: 'Gaya gravitasi', status: 'Sudah dipahami', from: 'Bola yang dilempar ke atas' },
      { name: 'Kecepatan', status: 'Sudah dipahami', from: 'Mendorong mobil mogok' },
      { name: 'Kelembaman', status: 'Berkembang', from: 'Kenapa kelereng berhenti?' },
      { name: 'Resultan gaya', status: 'Berkembang', from: 'Tarik tambang' },
    ],
    email: {
      teacher: 'Bu Sari',
      text: 'Raka awalnya berpikir dorongan bisa habis, lalu mengubah pendapatnya sendiri. Ia sudah bisa menyebut gaya yang melawan gerak benda.',
      tryAtHome: 'gelindingkan bola di lantai lalu di karpet, dan tanyakan bedanya.',
    },
    talk: [
      { question: 'Kalau tidak ada gesekan sama sekali, apa yang akan terjadi pada kelereng itu?', from: 'Kenapa kelereng berhenti? · 24 Sep' },
      { question: 'Di titik paling tinggi, apakah bola itu sedang diberi gaya?', from: 'Bola yang dilempar ke atas · 17 Sep' },
      { question: 'Kalau dua tim sama kuat, apakah talinya diam atau bergerak?', from: 'Tarik tambang · 10 Sep' },
    ],
  },
}
