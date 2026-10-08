import { useRef, useState } from 'react'
import type { NewConcept, NewMisconception } from '@/domain/model/KnowledgeBase'
import { Button } from '@/ui/components/button/Button'
import { Field } from '@/ui/components/field/Field'
import styles from '@/ui/pages/teacher/TeacherKbReview.styles'

type Props = { pending: boolean; onCancel: () => void } & (
  | { kind: 'concept'; onSubmit: (value: NewConcept, key: string) => void }
  | { kind: 'misconception'; onSubmit: (value: NewMisconception, key: string) => void }
)
const split = (value: string) => value.split('\n')

// The owner's own concept or misconception. It is saved as pending, so it is reviewed like a generated one.
export function KbNewItem(props: Props) {
  const [fields, setFields] = useState({ name: '', description: '', statement: '', correct: '', cues: '', counters: '' })
  // One key per submission: a retry after a lost answer reuses it; any edit makes it a different submission.
  const key = useRef(crypto.randomUUID())
  const set = (next: Partial<typeof fields>) => { key.current = crypto.randomUUID(); setFields((value) => ({ ...value, ...next })) }
  const concept = props.kind === 'concept'
  function submit() {
    if (props.kind === 'concept') props.onSubmit({ name: fields.name, description: fields.description }, key.current)
    else props.onSubmit({ statement: fields.statement, correct_understanding: fields.correct, detection_cues: split(fields.cues), counter_examples: split(fields.counters) }, key.current)
  }
  return <form aria-label={concept ? 'Konsep baru' : 'Miskonsepsi baru'} noValidate onSubmit={(event) => { event.preventDefault(); submit() }}>
    {concept ? <>
      <Field label="Nama konsep" required maxLength={200} value={fields.name} disabled={props.pending} onChange={(event) => set({ name: event.target.value })} />
      <label className={styles.area}>Deskripsi<textarea rows={3} maxLength={1000} value={fields.description} disabled={props.pending} onChange={(event) => set({ description: event.target.value })} /></label>
    </> : <>
      <Field label="Pernyataan keliru" required maxLength={1000} value={fields.statement} disabled={props.pending} onChange={(event) => set({ statement: event.target.value })} />
      <label className={styles.area}>Pemahaman yang benar<textarea rows={3} maxLength={1000} value={fields.correct} disabled={props.pending} onChange={(event) => set({ correct: event.target.value })} /></label>
      <label className={styles.area}>Contoh ucapan siswa (satu per baris)<textarea rows={3} value={fields.cues} disabled={props.pending} onChange={(event) => set({ cues: event.target.value })} /></label>
      <label className={styles.area}>Contoh pembanding (satu per baris)<textarea rows={3} value={fields.counters} disabled={props.pending} onChange={(event) => set({ counters: event.target.value })} /></label>
    </>}
    <p className={styles.note}>Butir ini menunggu tinjauan Anda dan belum punya halaman sumber.</p>
    <div className={styles.actions}>
      <Button type="submit" pending={props.pending} pendingLabel="Menyimpan…">Tambah</Button>
      <Button tone="secondary" disabled={props.pending} onClick={props.onCancel}>Batal</Button>
    </div>
  </form>
}
