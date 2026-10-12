import { revisionComponentWord } from './missionText'
import { useId, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { KbConcept } from '@/domain/model/KnowledgeBase'
import type { MissionRevisionFeedback, MissionRevisionInput, MissionVersion } from '@/domain/model/Teacher'
import { cn } from '@/ui/cn'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Select } from '@/ui/components/select/Select'
import styles from './MissionRevisionForm.styles'

type Component = MissionRevisionFeedback['component']
type Entry = { enabled: boolean; id: string; issue: MissionRevisionFeedback['issue']; desired: string }
const issueWords: Record<MissionRevisionFeedback['issue'], string> = {
  too_long: 'Terlalu panjang', too_difficult: 'Terlalu sulit', unfamiliar_context: 'Konteks kurang dekat dengan siswa',
  unclear_levels: 'Tingkat penilaian sulit dibedakan', repetitive: 'Terlalu mirip atau berulang',
  gives_hint: 'Memberi petunjuk jawaban', science_concern: 'Ada penjelasan yang perlu diperiksa', other: 'Lainnya',
}
const issueOptions = Object.entries(issueWords).map(([value, label]) => ({ value, label }))
const bankModeOptions = [{ value: 'all', label: 'Seluruh bank pertanyaan' }, { value: 'selected', label: 'Pertanyaan tertentu' }]
const componentHints: Record<Component, string> = {
  anchor_problem: 'Skenario dan pertanyaan yang dilihat siswa di awal sesi.', reference_reasoning: 'Penalaran yang diharapkan; hanya terlihat oleh guru.',
  rubric: 'Kriteria dan tingkat penilaian jawaban siswa.', bank: 'Pertanyaan lanjutan yang tersedia selama sesi.',
}
const components = Object.keys(revisionComponentWord) as Component[]

export function MissionRevisionForm({ version, latestId, concepts, initialComponent, initialInput, pending, error, onClose, onSubmit }: {
  version: MissionVersion; latestId: string; concepts: KbConcept[] | null; initialComponent: Component | null
  initialInput: MissionRevisionInput | null
  pending: boolean; error: string | null; onClose: () => void; onSubmit: (input: MissionRevisionInput) => Promise<void>
}) {
  const [entries, setEntries] = useState<Record<Component, Entry>>(() => Object.fromEntries(components.map((key) => {
    const saved = initialComponent === null ? initialInput?.feedback.find((f) => f.component === key) : null
    return [key, { enabled: Boolean(saved) || initialComponent === key, id: saved?.id ?? crypto.randomUUID(), issue: saved?.issue ?? 'other', desired: saved?.desired_change ?? '' }]
  })) as Record<Component, Entry>)
  const [editGoal, setEditGoal] = useState(Boolean(initialInput?.learning_objective || initialInput?.target_concept_ids))
  const [objective, setObjective] = useState(initialInput?.learning_objective ?? version.learning_objective)
  const [targets, setTargets] = useState(initialInput?.target_concept_ids ?? version.target_concept_ids)
  const [editTitle, setEditTitle] = useState(Boolean(initialInput?.title))
  const [title, setTitle] = useState(initialInput?.title ?? version.title)
  const [bankMode, setBankMode] = useState<'all' | 'selected'>(initialInput?.feedback.some((f) => f.component === 'bank' && f.question_ids.length > 0) ? 'selected' : 'all')
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(initialInput?.feedback.filter((f) => f.component === 'bank').flatMap((f) => f.question_ids) ?? [])
  const [validation, setValidation] = useState<string | null>(null)
  const approved = concepts?.filter((concept) => concept.review_status === 'approved') ?? []
  const targetChange = targets.join(',') !== version.target_concept_ids.join(',')
  const goalChanged = editGoal && (objective.trim() !== version.learning_objective || targetChange)
  const whole = entries.anchor_problem.enabled || entries.reference_reasoning.enabled || goalChanged
  const update = (key: Component, patch: Partial<Entry>) => setEntries((old) => ({ ...old, [key]: { ...old[key], ...patch } }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setValidation(null)
    const chosen = components.filter((key) => entries[key].enabled)
    if (chosen.some((key) => !entries[key].desired.trim())) { setValidation('Tuliskan perubahan yang diinginkan untuk setiap bagian yang dipilih.'); return }
    if (entries.bank.enabled && bankMode === 'selected' && selectedQuestions.length === 0) { setValidation('Pilih sedikitnya satu pertanyaan atau revisi seluruh bank.'); return }
    if (editGoal && (!objective.trim() || targets.length < 2 || targets.length > 3 || (targetChange && targets.some((id) => !approved.some((c) => c.id === id))))) { setValidation('Tujuan wajib diisi dan pilih 2–3 konsep yang sudah disetujui.'); return }
    if (editTitle && !title.trim()) { setValidation('Judul versi tidak boleh kosong.'); return }
    const titleChanged = editTitle && title.trim() !== version.title
    if (!chosen.length && !goalChanged && !titleChanged) { setValidation('Pilih bagian atau ubah tujuan, konsep, atau judul versi.'); return }
    const input: MissionRevisionInput = {
      base_version_id: version.id, expected_latest_version_id: latestId,
      feedback: chosen.map((key) => ({ id: entries[key].id, component: key, issue: entries[key].issue, desired_change: entries[key].desired.trim(), question_ids: key === 'bank' && bankMode === 'selected' ? selectedQuestions : [] })),
      ...(editGoal && objective.trim() !== version.learning_objective ? { learning_objective: objective.trim() } : {}),
      ...(editGoal && targetChange ? { target_concept_ids: targets } : {}),
      ...(titleChanged ? { title: title.trim() } : {}),
    }
    await onSubmit(input)
  }

  const picked = components.filter((key) => entries[key].enabled).length + Number(editGoal) + Number(editTitle)

  return <Dialog open onClose={onClose} icon="sparkle" title="Revisi dengan AI" description={`Revisi dari v${version.version_number}. Pilih bagian yang perlu diperbaiki. Hasil disimpan sebagai draf baru untuk Anda tinjau.`} className={styles.dialog} dismissible={!pending}>
    <form className={styles.form} onSubmit={(event) => { void submit(event) }}>
      <section className={styles.section} aria-labelledby="revision-parts">
        <h3 id="revision-parts" className={styles.sectionTitle}>Bagian yang direvisi</h3>
        <p className={styles.sectionHint}>Pilih satu atau lebih. Bagian yang tidak dipilih tetap seperti semula.</p>
        {components.map((key) => <Part key={key} checked={entries[key].enabled} onChange={(enabled) => update(key, { enabled })} title={revisionComponentWord[key]} hint={componentHints[key]} disabled={pending}>
          <Select label="Apa yang kurang sesuai?" value={entries[key].issue} options={issueOptions} onChange={(value) => update(key, { issue: value as Entry['issue'] })} />
          <label className={styles.field}>Perubahan untuk {revisionComponentWord[key].toLowerCase()}<textarea className={styles.input} rows={3} maxLength={1000} value={entries[key].desired} onChange={(event) => update(key, { desired: event.target.value })} placeholder="Contoh: ringkas narasi tanpa menghilangkan pengamatan yang diperlukan." /></label>
          {key === 'bank' && <>
            <Select label="Cakupan pertanyaan" value={bankMode} options={bankModeOptions} onChange={(value) => setBankMode(value as typeof bankMode)} />
            {bankMode === 'selected' && <div className="flex flex-col gap-2">
              <div className={styles.choices}>{version.question_bank.map((question) => <label key={question.id} className={styles.choice}><input type="checkbox" className={styles.check} checked={selectedQuestions.includes(question.id)} onChange={(event) => setSelectedQuestions((old) => event.target.checked ? [...old, question.id] : old.filter((id) => id !== question.id))} /><span>{question.text}</span></label>)}</div>
              <p className={styles.choiceCount} aria-live="polite">{selectedQuestions.length} dari {version.question_bank.length} pertanyaan dipilih</p>
            </div>}
          </>}
        </Part>)}
      </section>
      <section className={styles.section} aria-labelledby="revision-other">
        <h3 id="revision-other" className={styles.sectionTitle}>Penyesuaian lain</h3>
        <Part checked={editGoal} onChange={setEditGoal} title="Ubah tujuan dan konsep target" hint="Tujuan pembelajaran dan 2–3 konsep yang disasar." disabled={pending}>
          <label className={styles.field}>Tujuan pembelajaran<textarea className={styles.input} rows={3} maxLength={1000} value={objective} onChange={(event) => setObjective(event.target.value)} /></label>
          <p className={styles.note}>Pilih 2–3 konsep yang sudah disetujui dari basis pengetahuan misi ini.</p>
          {concepts === null ? <Feedback tone="warning" title="Konsep belum dapat dimuat">Tutup form dan muat ulang halaman untuk mengubah konsep. Tujuan tetap dapat direvisi.</Feedback> : <div className="flex flex-col gap-2">
            <div className={styles.choices}>{approved.map((concept) => <label key={concept.id} className={styles.choice}><input type="checkbox" className={styles.check} checked={targets.includes(concept.id)} onChange={(event) => setTargets((old) => event.target.checked ? [...old, concept.id] : old.filter((id) => id !== concept.id))} /><span>{concept.name}</span></label>)}</div>
            <p className={styles.choiceCount} aria-live="polite">{targets.length} konsep dipilih</p>
          </div>}
        </Part>
        <Part checked={editTitle} onChange={setEditTitle} title="Ubah judul versi" hint="Judul yang tampil untuk versi baru ini." disabled={pending}>
          <label className={styles.field}>Judul versi<input className={styles.input} maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        </Part>
      </section>
      <div className={styles.impact} aria-live="polite"><strong>Dampak revisi</strong><p className="mb-0 mt-1">{whole ? 'Soal, jawaban acuan, rubrik, dan bank pertanyaan disusun ulang agar selaras. Pemanasan lama tidak disalin ke draf baru.' : 'Bagian yang dipilih diperbarui; bagian lainnya dipertahankan.'} Versi yang sudah diterbitkan tetap digunakan oleh kelasnya.</p></div>
      {(validation || error) && <Feedback tone="warning" title={validation ?? error ?? ''} announce />}
      <div className={styles.actions}>
        <p className={styles.summary} aria-live="polite">{picked ? `${picked} bagian dipilih` : 'Belum ada bagian dipilih'}</p>
        <div className={styles.buttons}><Button type="button" tone="secondary" disabled={pending} onClick={onClose}>Batal</Button><Button type="submit" pending={pending} pendingLabel="Meminta revisi…">Buat draf revisi</Button></div>
      </div>
    </form>
  </Dialog>
}

/** One selectable part of the revision: a checkbox row whose fields unfold underneath once it is chosen. */
function Part({ checked, onChange, title, hint, disabled, children }: { checked: boolean; onChange: (checked: boolean) => void; title: string; hint: string; disabled: boolean; children: ReactNode }) {
  const id = useId()
  return <fieldset className={styles.part} disabled={disabled}>
    <label className={styles.head}>
      <input type="checkbox" className={styles.check} checked={checked} onChange={(event) => onChange(event.target.checked)} aria-labelledby={`${id}-title`} aria-describedby={`${id}-hint`} />
      <span className="min-w-0"><span id={`${id}-title`} className={styles.title}>{title}</span><span id={`${id}-hint`} className={styles.hint}>{hint}</span></span>
    </label>
    <div className={cn(styles.reveal, checked && styles.revealOn)} inert={!checked}><div className={styles.clip}><div className={styles.body}>{children}</div></div></div>
  </fieldset>
}
