import type { ReportFlagEvidence } from '@/domain/model/Teacher'
import { formatDayTime } from '@/ui/formatInstant'
import styles from '@/ui/pages/teacher/TeacherReport.styles'

const seconds = (value: number) => value < 60 ? `${Math.round(value)} detik` : `${Math.floor(value / 60)} menit ${Math.round(value % 60)} detik`

function lines(evidence: ReportFlagEvidence): string[] {
  switch (evidence.kind) {
    case 'large_paste': return [`Teks yang ditempel: ${evidence.paste_chars} karakter, dari jawaban ${evidence.answer_chars} karakter.`]
    case 'tab_switching': return [
      `Meninggalkan halaman misi ${evidence.away_events} kali.`,
      ...evidence.away_seconds_by_turn.map((turn) => `Pertanyaan ${turn.turn_index}: ${seconds(turn.seconds)} di luar halaman.`),
    ]
    case 'inconsistency_gap': return [`Tingkat kualitas jawaban per giliran: ${evidence.quality_levels.join(' → ')}.`]
    case 'disconnect_pattern': return [`Koneksi terputus ${evidence.disconnect_count} kali; kualitas jawaban naik ${evidence.quality_jump} tingkat.`]
    case 'cross_student_similarity': return [`Kemiripan dengan jawaban siswa lain: ${Math.round(evidence.similarity_score * 100)}%.`]
  }
}

// Cues for the teacher's own judgment. "Tercatat" is when E1 recorded the flag, not the exact moment of the activity.
export function FlagEvidence({ evidence, turnIndex, createdAt }: { evidence: ReportFlagEvidence | null; turnIndex: number | null; createdAt: string | null }) {
  const meta = [turnIndex !== null && `Pertanyaan ${turnIndex}`, createdAt && `Tercatat ${formatDayTime(createdAt)}`].filter(Boolean).join(' · ')
  return <div className={styles.evidence}>
    {meta && <p>{meta}</p>}
    {evidence ? lines(evidence).map((line) => <p key={line}>{line}</p>) : <p>Bukti rinci belum tersedia.</p>}
  </div>
}
