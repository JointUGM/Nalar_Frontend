import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { ClassMap, MisconceptionTrail, TeachingPlan } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { nextLessonGroups, suggestedMode } from '@/domain/model/NextLesson'
import type { NextLessonGroup } from '@/domain/model/NextLesson'
import { Button } from '@/ui/components/button/Button'

const jobPollMs = 4_000
const phaseLabel = { elicit: 'Gali gagasan siswa', contrast: 'Hadapkan dengan contoh', explain: 'Luruskan bersama' } as const

type PlanJob = { jobId: string; failed: boolean }

// TC-23: one focus at a time answers what to strengthen, what to do, what to ask and how to check.
// Names and counts come from the class map; Nala only drafts the activity from reviewed content.
export function NextLessonPlan({ data, trail, publicationId, base, offline, service, refresh, openStrategy }: {
  data: ClassMap; trail: MisconceptionTrail | null; publicationId: string; base: string; offline: boolean
  service: TeacherService; refresh: () => void; openStrategy: (id: string) => void
}) {
  const groups = nextLessonGroups(data, trail, publicationId)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Record<string, PlanJob>>({})
  const [status, setStatus] = useState('')
  const focus = groups.find(group => group.item.misconception_id === focusId) ?? groups[0]
  const focusKey = focus?.item.misconception_id ?? ''
  const job = jobs[focusKey]
  const waiting = !!job && !job.failed && !focus?.item.teaching_plan

  useEffect(() => {
    if (!waiting) return
    const timer = setInterval(() => {
      service.jobStatus(job.jobId).then((found) => {
        if (found.status === 'succeeded') refresh()
        if (found.status === 'failed') setJobs(current => ({ ...current, [focusKey]: { ...job, failed: true } }))
      }).catch(() => undefined)
    }, jobPollMs)
    return () => clearInterval(timer)
  }, [waiting, job, focusKey, service, refresh])

  async function requestPlan(group: NextLessonGroup) {
    setStatus('')
    try {
      const queued = await service.requestTeachingPlan(publicationId, group.item.misconception_id)
      const jobId = queued.job_id
      if (jobId) setJobs(current => ({ ...current, [group.item.misconception_id]: { jobId, failed: false } }))
      else refresh()
    } catch { setStatus('Permintaan belum terkirim. Periksa sambungan, lalu coba lagi.') }
  }

  async function copy(group: NextLessonGroup) {
    try { await navigator.clipboard.writeText(planText(group)); setStatus('Rencana disalin.') }
    catch { setStatus('Belum bisa menyalin. Pilih teks pada kartu untuk menyalin secara manual.') }
  }

  if (!focus) return <section className="mb-5 rounded-card border border-role-border bg-surface p-4 sm:p-5" aria-labelledby="next-lesson-title">
    <h2 id="next-lesson-title" className="font-semibold text-ink">Rencana pertemuan berikutnya</h2>
    <p className="mt-2">Belum ada miskonsepsi yang perlu dikuatkan dari hasil yang sudah dinilai.{data.incomplete_count > 0 ? ` ${data.incomplete_count} siswa belum selesai atau belum dinilai.` : ''}</p>
  </section>

  const { item } = focus
  const whole = suggestedMode(item.count, data.denominator) === 'whole_class'
  const repeated = focus.students.filter(student => student.stillHolding).length
  return <section className="mb-5 rounded-card border border-role-border bg-surface p-4 sm:p-5" aria-labelledby="next-lesson-title">
    <h2 id="next-lesson-title" className="font-semibold text-ink">Rencana pertemuan berikutnya</h2>
    {offline && <p className="mt-1 text-meta">Menampilkan hasil terakhir. Sambungkan kembali untuk hasil terbaru.</p>}
    {groups.length > 1 && <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Pilih fokus penguatan">
      {groups.map(group => <button key={group.item.misconception_id} type="button" aria-pressed={group === focus} onClick={() => { setFocusId(group.item.misconception_id); setStatus('') }}
        className={`rounded-full border px-3 py-1 text-meta ${group === focus ? 'border-ink bg-ink text-surface' : 'border-role-border'}`}>
        {group.item.statement.length > 48 ? `${group.item.statement.slice(0, 47)}…` : group.item.statement} · {group.item.count}
      </button>)}
    </div>}

    <div className="mt-4">
      <p className="text-meta text-text-secondary">Fokus · {focus.concept}</p>
      <h3 className="mt-1 font-semibold">“{item.statement}”</h3>
      <p className="mt-1 text-sm">{item.count} dari {data.denominator} siswa masih memegang gagasan ini{repeated > 0 ? `, ${repeated} di antaranya sejak misi sebelumnya` : ''}. {whole ? 'Saran: bahas bersama seluruh kelas.' : 'Saran: ajak kelompok kecil ini berdiskusi sementara siswa lain berlatih.'}</p>
      <details className="mt-2">
        <summary className="cursor-pointer text-sm font-semibold underline">Lihat {focus.students.length} nama</summary>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">{focus.students.map(student => <li key={student.student_id}>
          <Link className="underline" to={`${base}/publications/${publicationId}/sessions/${student.session_id}`}>{student.name}</Link>{student.stillHolding && <span className="text-text-secondary" title="Masih memegang gagasan ini sejak misi sebelumnya"> ↻</span>}
        </li>)}</ul>
        {focus.students.length < item.count && <p className="mt-1 text-meta text-text-secondary">Siswa lain yang memegang gagasan ini sudah masuk fokus yang lebih besar.</p>}
      </details>
    </div>

    {item.teaching_plan ? <PlanView plan={item.teaching_plan} /> : <div className="mt-4 rounded-card border border-role-border p-3">
      <h4 className="font-semibold">Bahan dari materi yang sudah ditinjau</h4>
      <dl className="mt-2 space-y-2 text-sm">
        <div><dt className="font-medium">Yang perlu diluruskan</dt><dd>{item.correct_understanding || 'Belum ada pemahaman yang benar yang ditinjau.'}</dd></div>
        <div><dt className="font-medium">Contoh pembanding</dt><dd>{item.counter_examples[0] ?? 'Belum ada contoh pembanding yang ditinjau. Tambahkan pada peninjauan bahan ajar.'}</dd></div>
      </dl>
      {job?.failed ? <p className="mt-3 text-sm" role="alert">Nala belum bisa menyusun kegiatan. Bahan di atas tetap bisa Anda pakai.</p>
        : waiting ? <p className="mt-3 text-sm" role="status">Nala sedang menyusun kegiatan dari bahan ini…</p> : null}
      {!offline && !waiting && <Button className="mt-3" tone="secondary" onClick={() => { void requestPlan(focus) }}>{job?.failed ? 'Coba susun lagi' : 'Susun kegiatan dengan Nala'}</Button>}
    </div>}

    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Button tone="secondary" onClick={() => { void copy(focus) }}>Salin rencana</Button>
      <button type="button" className="text-sm font-semibold underline" onClick={() => openStrategy(item.misconception_id)}>Buka kartu strategi</button>
      {!offline && <Link className="text-sm font-semibold underline" to={`${base}/missions/new`} state={{ followUpOf: publicationId }}>Buat misi lanjutan untuk mengecek lagi</Link>}
    </div>
    <p role="status" className="mt-2 text-meta">{status}</p>
  </section>
}

function PlanView({ plan }: { plan: TeachingPlan }) {
  return <div className="mt-4 rounded-card border border-role-border p-3">
    <p className="text-sm"><span className="font-semibold">Tujuan:</span> {plan.objective}</p>
    <ol className="mt-3 space-y-3">{plan.steps.map((step, index) => <li key={step.phase} className="text-sm">
      <p className="font-semibold">{index + 1}. {phaseLabel[step.phase]}</p>
      <p className="mt-1">{step.teacher_action}</p>
      {step.phase === 'contrast' && plan.counter_example && <p className="mt-1 text-text-secondary">Contoh yang sudah ditinjau: {plan.counter_example}</p>}
      <p className="mt-1">Tanyakan: “{step.ask}”</p>
    </li>)}</ol>
    <div className="mt-3 text-sm">
      <p className="font-semibold">Cek pemahaman</p>
      <p className="mt-1">“{plan.check_question}”</p>
      <p className="mt-1 text-text-secondary">Dengarkan: {plan.look_for}</p>
    </div>
    <p className="mt-3 text-meta text-text-secondary">Draf Nala dari materi yang sudah Anda tinjau. Periksa dan sesuaikan sebelum dipakai.</p>
  </div>
}

function planText(group: NextLessonGroup): string {
  const { item } = group
  const plan = item.teaching_plan
  const body = plan
    ? [`Tujuan: ${plan.objective}`, ...plan.steps.map((step, index) => `${index + 1}. ${phaseLabel[step.phase]}: ${step.teacher_action} Tanyakan: "${step.ask}"`),
      `Cek pemahaman: "${plan.check_question}" Dengarkan: ${plan.look_for}`]
    : [`Yang perlu diluruskan: ${item.correct_understanding}`, ...(item.counter_examples[0] ? [`Contoh pembanding: ${item.counter_examples[0]}`] : [])]
  return [`Fokus: "${item.statement}" (${group.concept})`, ...body, `Siswa: ${group.students.map(student => student.name).join(', ')}`].join('\n')
}
