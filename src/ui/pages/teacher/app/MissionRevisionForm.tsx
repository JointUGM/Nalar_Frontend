import { revisionComponentWord } from './missionText'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { KbConcept } from '@/domain/model/KnowledgeBase'
import type { MissionRevisionFeedback, MissionRevisionInput, MissionVersion } from '@/domain/model/Teacher'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import styles from './MissionRevisionForm.styles'

type Component = MissionRevisionFeedback['component']
type Entry = { enabled: boolean; id: string; issue: MissionRevisionFeedback['issue']; desired: string }
const issueWords: Record<MissionRevisionFeedback['issue'], string> = {
  too_long: 'Terlalu panjang', too_difficult: 'Terlalu sulit', unfamiliar_context: 'Konteks kurang dekat dengan siswa',
  unclear_levels: 'Tingkat penilaian sulit dibedakan', repetitive: 'Terlalu mirip atau berulang',
  gives_hint: 'Memberi petunjuk jawaban', science_concern: 'Ada penjelasan yang perlu diperiksa', other: 'Lainnya',
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

  return <Dialog open onClose={onClose} title="Revisi dengan AI" description={`Revisi dari v${version.version_number}. Pilih bagian yang perlu diperbaiki. Hasil disimpan sebagai draf baru untuk Anda tinjau.`} presentation="drawer" className={styles.drawer} dismissible={!pending}>
    <form className={styles.form} onSubmit={(event) => { void submit(event) }}>
      {components.map((key) => <fieldset key={key} className={styles.group} disabled={pending}>
        <label className={styles.heading}><input type="checkbox" className={styles.check} checked={entries[key].enabled} onChange={(event) => update(key, { enabled: event.target.checked })} />{revisionComponentWord[key]}</label>
        {entries[key].enabled && <>
          <label className={styles.field}>Apa yang kurang sesuai?<select className={styles.input} value={entries[key].issue} onChange={(event) => update(key, { issue: event.target.value as Entry['issue'] })}>{Object.entries(issueWords).map(([value, word]) => <option key={value} value={value}>{word}</option>)}</select></label>
          <label className={styles.field}>Perubahan untuk {revisionComponentWord[key].toLowerCase()}<textarea className={styles.input} rows={3} maxLength={1000} value={entries[key].desired} onChange={(event) => update(key, { desired: event.target.value })} placeholder="Contoh: ringkas narasi tanpa menghilangkan pengamatan yang diperlukan." /></label>
          {key === 'bank' && <>
            <label className={styles.field}>Cakupan pertanyaan<select className={styles.input} value={bankMode} onChange={(event) => setBankMode(event.target.value as typeof bankMode)}><option value="all">Seluruh bank pertanyaan</option><option value="selected">Pertanyaan tertentu</option></select></label>
            {bankMode === 'selected' && <div className={styles.choices}>{version.question_bank.map((question) => <label key={question.id} className={styles.choice}><input type="checkbox" className={styles.check} checked={selectedQuestions.includes(question.id)} onChange={(event) => setSelectedQuestions((old) => event.target.checked ? [...old, question.id] : old.filter((id) => id !== question.id))} /><span>{question.text}</span></label>)}</div>}
          </>}
        </>}
      </fieldset>)}
      <fieldset className={styles.group} disabled={pending}>
        <label className={styles.heading}><input type="checkbox" className={styles.check} checked={editGoal} onChange={(event) => setEditGoal(event.target.checked)} />Ubah tujuan dan konsep target</label>
        {editGoal && <>
          <label className={styles.field}>Tujuan pembelajaran<textarea className={styles.input} rows={3} maxLength={1000} value={objective} onChange={(event) => setObjective(event.target.value)} /></label>
          <p className={styles.note}>Pilih 2–3 konsep yang sudah disetujui dari basis pengetahuan misi ini.</p>
          {concepts === null ? <Feedback tone="warning" title="Konsep belum dapat dimuat">Tutup form dan muat ulang halaman untuk mengubah konsep. Tujuan tetap dapat direvisi.</Feedback> : <div className={styles.choices}>{approved.map((concept) => <label key={concept.id} className={styles.choice}><input type="checkbox" className={styles.check} checked={targets.includes(concept.id)} onChange={(event) => setTargets((old) => event.target.checked ? [...old, concept.id] : old.filter((id) => id !== concept.id))} /><span>{concept.name}</span></label>)}</div>}
        </>}
      </fieldset>
      <fieldset className={styles.group} disabled={pending}>
        <label className={styles.heading}><input type="checkbox" className={styles.check} checked={editTitle} onChange={(event) => setEditTitle(event.target.checked)} />Ubah judul versi</label>
        {editTitle && <label className={styles.field}>Judul versi<input className={styles.input} maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} /></label>}
      </fieldset>
      <div className={styles.impact} aria-live="polite"><strong>Dampak revisi</strong><p className="mb-0 mt-1">{whole ? 'Soal, jawaban acuan, rubrik, dan bank pertanyaan disusun ulang agar selaras. Pemanasan lama tidak disalin ke draf baru.' : 'Bagian yang dipilih diperbarui; bagian lainnya dipertahankan.'} Versi yang sudah diterbitkan tetap digunakan oleh kelasnya.</p></div>
      {(validation || error) && <Feedback tone="warning" title={validation ?? error ?? ''} announce />}
      <div className={styles.actions}><Button type="button" tone="secondary" disabled={pending} onClick={onClose}>Batal</Button><Button type="submit" pending={pending} pendingLabel="Meminta revisi…">Buat draf revisi</Button></div>
    </form>
  </Dialog>
}
