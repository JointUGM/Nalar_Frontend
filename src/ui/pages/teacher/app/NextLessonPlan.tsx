import { useState } from 'react'
import { Link } from 'react-router'
import type { ClassMap, MisconceptionTrail } from '@/domain/model/Teacher'
import { nextLessonGroups } from '@/domain/model/NextLesson'
import { Button } from '@/ui/components/button/Button'

export function NextLessonPlan({ data, trail, publicationId, base, offline, openStrategy }: {
  data: ClassMap; trail: MisconceptionTrail | null; publicationId: string; base: string; offline: boolean; openStrategy: (id: string) => void
}) {
  const groups = nextLessonGroups(data, trail, publicationId)
  const [copyStatus, setCopyStatus] = useState('')
  async function copy() {
    const text = groups.map((group, index) => `Kelompok ${index + 1}: ${group.item.statement}\n${group.students.map(student => student.name).join(', ')}`).join('\n\n')
    try { await navigator.clipboard.writeText(text); setCopyStatus('Kelompok disalin.') }
    catch { setCopyStatus('Belum bisa menyalin. Pilih nama pada kartu untuk menyalin secara manual.') }
  }
  return <section className="mb-5 rounded-card border border-role-border bg-surface p-4 sm:p-5" aria-labelledby="next-lesson-title">
    <h2 id="next-lesson-title" className="font-semibold text-ink">Rencana pertemuan berikutnya</h2>
    <p className="mt-1 text-meta text-text-secondary">Kelompok sementara dari hasil yang sudah dinilai. Setiap siswa masuk satu kelompok; Anda dapat menyesuaikannya.</p>
    {!groups.length ? <p className="mt-3">Belum ada kelompok penguatan dari hasil yang tersedia.{data.incomplete_count > 0 ? ` ${data.incomplete_count} siswa belum selesai atau belum dinilai.` : ''}</p> : <>
      {offline && <p className="mt-2 text-meta">Menampilkan hasil terakhir. Sambungkan kembali untuk hasil terbaru.</p>}
      <p className="mt-3 font-medium">Fokus berikutnya: “{groups[0].item.statement}” · {groups[0].concept}</p>
      <ol className="mt-3 grid gap-3 sm:grid-cols-2">{groups.map((group, index) => <li key={group.item.misconception_id} className="rounded-card border border-role-border p-3">
        <h3 className="font-semibold">Kelompok {index + 1} · {group.students.length} siswa ditempatkan</h3>
        <p className="mt-1 text-meta">“{group.item.statement}” · {group.item.count} siswa menunjukkan miskonsepsi ini</p>
        <ul className="mt-2 space-y-1">{group.students.map(student => <li key={student.student_id}>
          <Link className="underline" to={`${base}/publications/${publicationId}/sessions/${student.session_id}`}>{student.name}</Link>
          {student.stillHolding && <span className="ml-2 text-meta text-text-secondary">Masih perlu penguatan sejak misi sebelumnya</span>}
        </li>)}</ul>
      </li>)}</ol>
      <div className="mt-4">
        <h3 className="font-semibold">Contoh pembanding untuk fokus berikutnya</h3>
        <p className="mt-1 text-sm">{groups[0].item.counter_examples[0] || 'Belum ada contoh pembanding yang tersedia untuk miskonsepsi ini.'}</p>
        <Button tone="secondary" onClick={() => openStrategy(groups[0].item.misconception_id)}>Buka strategi fokus berikutnya</Button>
        {!!data.insight?.suggestions.length && <div className="mt-3"><h3 className="font-semibold">Saran untuk kelas</h3><ul className="mt-1 list-disc pl-5">{data.insight.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}</ul></div>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button tone="secondary" onClick={() => { void copy() }}>Salin kelompok</Button>
        {!offline && <Link className="text-sm font-semibold underline" to={`${base}/missions/new`} state={{ followUpOf: publicationId }}>Buat misi lanjutan untuk kelas</Link>}
      </div>
      <p className="mt-2 text-meta text-text-secondary">Misi lanjutan mengutamakan hingga tiga konsep kelas yang masih keliru, lalu Anda meninjau draf sebelum menerbitkannya.</p>
      <p role="status" className="mt-2 text-meta">{copyStatus}</p>
    </>}
  </section>
}
