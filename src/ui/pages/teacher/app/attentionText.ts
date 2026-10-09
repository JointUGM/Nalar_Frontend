import type { AttentionItem } from '@/domain/model/Teacher'
import type { IconName } from '@/ui/components/icon/Icon'
import type { NalaIconName } from '@/ui/components/nala/NalaIcon'

type Kind = AttentionItem['kind']
const number = new Intl.NumberFormat('id-ID')

// Urgency order, shared by the home cards and Perlu perhatian: student support first, then verification, material review and release.
// Safety and verification copy stays plain: a flag is a hint to review, never an accusation.
export const attentionKinds = [
  { kind: 'safety', label: 'Keselamatan', icon: 'heart', nala: 'care', action: 'Dampingi siswa', hint: 'sesi dijeda', note: 'Sesi dijeda untuk keselamatan siswa. Lanjutkan atau akhiri sesi setelah bertemu siswa.', next: 'Periksa kondisi siswa secara langsung. Sesi tetap dijeda sampai Anda melanjutkannya.' },
  { kind: 'flag', label: 'Perlu verifikasi', icon: 'flag', nala: 'verify', action: 'Tinjau sesi', hint: 'petunjuk, bukan tuduhan', note: 'Petunjuk untuk ditinjau, bukan tuduhan. Skor siswa tidak berubah karena catatan ini.', next: 'Buka dialognya dulu, lalu putuskan apakah perlu dibahas bersama siswa.' },
  { kind: 'kb_review', label: 'Tinjauan materi', icon: 'book', nala: 'book', action: 'Tinjau materi', hint: 'draf menunggu persetujuan', note: 'Konsep dan miskonsepsi menunggu persetujuan Anda.', next: 'Setujui atau ubah drafnya. Siswa hanya bertemu materi yang sudah Anda setujui.' },
  { kind: 'release_ready', label: 'Siap dirilis', icon: 'send', nala: 'send', action: 'Pratinjau rilis', hint: 'ringkasan untuk orang tua', note: 'Ringkasan siap Anda tinjau sebelum dirilis.', next: 'Pratinjau dulu. Orang tua hanya melihat ringkasan yang Anda rilis.' },
] as const satisfies readonly { kind: Kind; label: string; icon: IconName; nala: NalaIconName; action: string; hint: string; note: string; next: string }[]

export type AttentionKind = typeof attentionKinds[number]
export const attentionKind = Object.fromEntries(attentionKinds.map((entry) => [entry.kind, entry])) as Record<Kind, AttentionKind>
/** Newer backends may send kinds this build does not know; they are left out rather than shown half-described. */
export const isKnownAttention = (item: AttentionItem) => item.kind in attentionKind
export const attentionRank = (item: AttentionItem) => attentionKinds.findIndex((entry) => entry.kind === item.kind)

export const flagWord: Readonly<Record<string, string>> = { large_paste: 'Tempelan teks panjang', tab_switching: 'Sering berpindah tab', inconsistency_gap: 'Jawaban tidak konsisten', style_shift: 'Gaya tulisan berubah', cross_student_similarity: 'Mirip jawaban siswa lain', disconnect_pattern: 'Koneksi sering terputus' }
export const severityWord: Readonly<Record<string, string>> = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi' }

export interface AttentionView { to: string; who: string; title: string; summary: string; student: boolean; at: string }

// Each item opens the page where the teacher acts on it. `student` is set when the item is about a person.
export function describeAttention(item: AttentionItem, base: string): AttentionView {
  switch (item.kind) {
    case 'safety': return { to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}`, who: item.student_name, title: `${item.student_name} membutuhkan pendampingan`, summary: 'Sesi dijeda untuk keselamatan.', student: true, at: item.paused_at ?? item.created_at }
    case 'flag': return { to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}`, who: item.student_name, title: `Verifikasi sesi ${item.student_name}`, summary: flagWord[item.flag_type] ?? item.flag_type, student: true, at: item.created_at }
    case 'kb_review': return { to: `${base}/knowledge-base/${item.knowledge_base_id}`, who: item.topic_title, title: `Tinjau materi ${item.topic_title}`, summary: `${number.format(item.pending_concepts)} konsep dan ${number.format(item.pending_misconceptions)} miskonsepsi menunggu tinjauan.`, student: false, at: item.created_at }
    case 'release_ready': return { to: `${base}/publications/${item.publication_id}/release`, who: item.mission_title, title: `Ringkasan kelas ${item.class_name} siap dirilis`, summary: `${number.format(item.eligible_count)} ringkasan untuk kelas ${item.class_name}.`, student: false, at: item.created_at }
  }
}

/** How long something has waited, in the coarsest unit that still reads naturally. */
export function waitedFor(at: string, now = Date.now()) {
  const hours = Math.floor((now - Date.parse(at)) / 3_600_000)
  return hours < 1 ? 'kurang dari 1 jam' : hours < 24 ? `${number.format(hours)} jam` : `${number.format(Math.floor(hours / 24))} hari`
}
