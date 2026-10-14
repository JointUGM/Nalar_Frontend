import { Link } from 'react-router'
import type { LiveMonitor } from '@/domain/model/Live'

const reasons = {
  frustration: 'Mungkin perlu dukungan untuk melanjutkan',
  repeated_evasive: 'Dua jawaban belum menjelaskan alasan',
  persistent_misconception: 'Pemahaman tampak belum berubah setelah contoh pembanding',
}

export function TeacherMentoringSignals({ data, base, publicationId, offline }: {
  data: LiveMonitor; base: string; publicationId: string; offline: boolean
}) {
  const students = data.run.status === 'closed' || offline ? [] : data.students
    .filter(student => student.status === 'in_progress' && !student.safety_paused && student.help_signal)
    .sort((a, b) => a.help_signal!.rank - b.help_signal!.rank).slice(0, 5)
  if (!students.length) return null
  return <section className="my-4 rounded-card border border-role-border bg-surface p-4" aria-labelledby="mentoring-title">
    <h2 id="mentoring-title" className="font-semibold text-ink">Sinyal pendampingan · Perlu didatangi</h2>
    <p className="mt-1 text-meta text-text-secondary">Petunjuk dari jawaban terakhir, bukan diagnosis. Periksa bersama siswa.</p>
    <ol className="mt-3 grid gap-3 sm:grid-cols-2">
      {students.map(student => <li key={student.student_id} className="rounded-card border border-role-border p-3">
        <strong>{student.help_signal!.rank}. {student.name}</strong>
        <p className="mt-1 text-meta">{reasons[student.help_signal!.reason]}</p>
        {student.help_signal!.misconception_statement && <p className="mt-1 text-meta">“{student.help_signal!.misconception_statement}”</p>}
        <p className="mt-2 text-sm text-ink">{student.help_signal!.suggestion}</p>
        {student.session_id && <Link className="mt-2 inline-block text-meta underline" to={`${base}/publications/${publicationId}/sessions/${student.session_id}`}>Lihat percakapan</Link>}
      </li>)}
    </ol>
  </section>
}
