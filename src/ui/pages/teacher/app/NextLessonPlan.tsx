import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { ClassMap, MisconceptionTrail, TeachingPlan } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { nextLessonGroups, suggestedMode } from '@/domain/model/NextLesson'
import type { NextLessonGroup } from '@/domain/model/NextLesson'
import { Button } from '@/ui/components/button/Button'

const jobPollMs = 4_000
const card = 'grid min-w-0 gap-5 rounded-2xl bg-surface p-5 max-sm:p-4'
const title = 'm-0 text-[16px] font-bold text-ink'
const body = 'm-0 max-w-[75ch] text-[14px] leading-[1.55] text-text-secondary'
const panel = 'grid gap-3 rounded-xl bg-paper p-4'
const box = 'grid gap-1.5 rounded-xl bg-paper p-4'
const label = 'm-0 text-[12px] font-bold text-text-muted'
const term = 'text-[12px] font-bold text-text-muted'
const detail = 'm-0 text-[14px] leading-[1.55] text-ink'
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

  if (!focus) return <section className={card} aria-labelledby="next-lesson-title">
    <h2 id="next-lesson-title" className={title}>Rencana pertemuan berikutnya</h2>
    <p className={body}>Belum ada miskonsepsi yang perlu dikuatkan dari hasil yang sudah dinilai.{data.incomplete_count > 0 ? ` ${data.incomplete_count} siswa belum selesai atau belum dinilai.` : ''}</p>
  </section>

  const { item } = focus
  const plan = item.teaching_plan
  const whole = suggestedMode(item.count, data.denominator) === 'whole_class'
  const repeated = focus.students.filter(student => student.stillHolding).length
  const suggestions = data.insight?.suggestions ?? []
  return <section className={card} aria-labelledby="next-lesson-title">
    <div className="grid gap-1">
      <h2 id="next-lesson-title" className={title}>Rencana pertemuan berikutnya</h2>
      {offline && <p className="m-0 text-[13px] text-text-secondary">Menampilkan hasil terakhir. Sambungkan kembali untuk hasil terbaru.</p>}
    </div>
    {groups.length > 1 && <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih fokus penguatan">
      {groups.map(group => <button key={group.item.misconception_id} type="button" aria-pressed={group === focus} onClick={() => { setFocusId(group.item.misconception_id); setStatus('') }}
        className="min-h-9 max-w-full cursor-pointer rounded-pill border-0 bg-paper px-3.5 text-left text-[13px] font-semibold text-ink transition-[background-color,color] duration-150 hover:not-aria-pressed:bg-info-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[.97] aria-pressed:bg-ink aria-pressed:text-white motion-reduce:transition-none">
        {group.item.statement.length > 48 ? `${group.item.statement.slice(0, 47)}…` : group.item.statement} · {group.item.count}
      </button>)}
    </div>}

    {/* A lesson plan reads top to bottom on the left; what to aim for, how to check and what to do next stay beside it. */}
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
      <div className="grid min-w-0 gap-6">
        <div className="grid gap-1.5">
          <p className="m-0 text-[13px] font-semibold text-text-muted">Fokus · {focus.concept}</p>
          <h3 className="m-0 text-[20px] leading-7 font-extrabold tracking-[-.01em] text-ink [text-wrap:balance]">“{item.statement}”</h3>
          <p className={body}>{item.count} dari {data.denominator} siswa masih memegang gagasan ini{repeated > 0 ? `, ${repeated} di antaranya sejak misi sebelumnya` : ''}. {whole ? 'Saran: bahas bersama seluruh kelas.' : 'Saran: ajak kelompok kecil ini berdiskusi sementara siswa lain berlatih.'}</p>
          <details className="mt-1">
            <summary className="w-fit cursor-pointer text-[13px] font-bold text-primary">Lihat {focus.students.length} nama</summary>
            <ul className="mt-2 mb-0 flex list-none flex-wrap gap-1.5 p-0">{focus.students.map(student => <li key={student.student_id}>
              <Link className="inline-flex h-7 items-center gap-1 rounded-pill bg-paper px-2.5 text-[13px] font-semibold text-ink no-underline hover:bg-info-bg" to={`${base}/publications/${publicationId}/sessions/${student.session_id}`}>{student.name}</Link>{student.stillHolding && <span className="text-text-secondary" title="Masih memegang gagasan ini sejak misi sebelumnya"> ↻</span>}
            </li>)}</ul>
            {focus.students.length < item.count && <p className="mt-2 mb-0 text-[13px] text-text-secondary">Siswa lain yang memegang gagasan ini sudah masuk fokus yang lebih besar.</p>}
          </details>
        </div>

        {plan ? <Steps plan={plan} /> : <div className={panel}>
          <h4 className="m-0 text-[14px] font-bold">Bahan dari materi yang sudah ditinjau</h4>
          <dl className="m-0 grid gap-3">
            <div><dt className={term}>Yang perlu diluruskan</dt><dd className={detail}>{item.correct_understanding || 'Belum ada pemahaman yang benar yang ditinjau.'}</dd></div>
            <div><dt className={term}>Contoh pembanding</dt><dd className={detail}>{item.counter_examples[0] ?? 'Belum ada contoh pembanding yang ditinjau. Tambahkan pada peninjauan bahan ajar.'}</dd></div>
          </dl>
          {job?.failed ? <p className="m-0 text-[14px]" role="alert">Nala belum bisa menyusun kegiatan. Bahan di atas tetap bisa Anda pakai.</p>
            : waiting ? <p className="m-0 text-[14px]" role="status">Nala sedang menyusun kegiatan dari bahan ini…</p> : null}
          {!offline && !waiting && <Button className="w-fit" tone="secondary" onClick={() => { void requestPlan(focus) }}>{job?.failed ? 'Coba susun lagi' : 'Susun kegiatan dengan Nala'}</Button>}
        </div>}
      </div>

      <aside className="grid min-w-0 gap-3 lg:sticky lg:top-4" aria-label="Ringkasan rencana">
        {plan && <>
          <div className={box}><h4 className={label}>Tujuan</h4><p className={detail}>{plan.objective}</p></div>
          <div className={box}>
            <h4 className={label}>Cek pemahaman</h4>
            <p className={`${detail} font-semibold`}>“{plan.check_question}”</p>
            <p className="m-0 text-[13px] leading-[1.55] text-text-secondary">Dengarkan: {plan.look_for}</p>
          </div>
        </>}
        <div className="grid gap-2">
          <Button className="w-full" onClick={() => { void copy(focus) }}>Salin rencana</Button>
          <Button className="w-full" tone="secondary" onClick={() => openStrategy(item.misconception_id)}>Buka kartu strategi</Button>
          {!offline && <Link className="inline-flex min-h-10 items-center justify-center px-2 text-center text-[14px] font-bold text-primary no-underline hover:underline" to={`${base}/missions/new`} state={{ followUpOf: publicationId }}>Buat misi lanjutan untuk mengecek lagi</Link>}
          <p role="status" className="m-0 min-h-5 text-center text-[13px] text-text-secondary">{status}</p>
        </div>
        {suggestions.length > 0 && <div className={box}>
          <h4 className={label}>Saran pelajaran berikutnya</h4>
          <ul className="m-0 grid list-none gap-2 p-0">{suggestions.map((suggestion, index) => <li key={index} className="text-[14px] leading-[1.55] text-text-secondary">{suggestion}</li>)}</ul>
        </div>}
        {plan && <p className="m-0 text-[12px] leading-[1.5] text-text-muted">Draf Nala dari materi yang sudah Anda tinjau. Periksa dan sesuaikan sebelum dipakai.</p>}
      </aside>
    </div>
  </section>
}

// The three moves run down a thin rail; the question stands out because it is what the teacher says aloud.
function Steps({ plan }: { plan: TeachingPlan }) {
  return <ol className="m-0 grid list-none gap-5 p-0">{plan.steps.map((step, index) => <li key={step.phase} className="relative grid gap-1.5 pl-7 text-[14px] leading-[1.55] before:absolute before:top-1.5 before:left-0.5 before:size-3 before:rounded-pill before:border-2 before:border-primary before:bg-surface before:content-[''] after:absolute after:top-6 after:-bottom-4 after:left-[7px] after:w-px after:bg-role-border after:content-[''] last:after:hidden">
    <p className="m-0 font-bold text-ink">{index + 1}. {phaseLabel[step.phase]}</p>
    <p className="m-0 text-text-secondary">{step.teacher_action}</p>
    {step.phase === 'contrast' && plan.counter_example && <p className="m-0 text-text-secondary">Contoh yang sudah ditinjau: {plan.counter_example}</p>}
    <p className="m-0 rounded-xl bg-info-bg px-3.5 py-2.5 text-ink">Tanyakan: “{step.ask}”</p>
  </li>)}</ol>
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
