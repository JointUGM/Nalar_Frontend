import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { OperationError } from '@/domain/model/OperationError'
import type { AccountDependencies } from './AccountDependencies'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'

// The backend ends every session of the account after a change, so a success goes back to the login page.
export function ChangePasswordDialog({ open, onClose, change }: { open: boolean; onClose: () => void; change: NonNullable<AccountDependencies['changePassword']> }) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [problem, setProblem] = useState('')
  const [pending, setPending] = useState(false)
  const busy = useRef(false)
  async function submit() {
    if (busy.current) return
    if ([...next].length < 8 || next.length > 256) return setProblem('Kata sandi baru perlu 8–256 karakter.')
    if (next !== repeat) return setProblem('Kedua kata sandi baru harus sama.')
    busy.current = true; setPending(true); setProblem('')
    try {
      await change.execute(current, next)
      navigate('/login', { state: { signOut: true } })
    } catch (failure) {
      const error = failure instanceof OperationError ? failure : new OperationError('unavailable')
      setProblem(error.code === 'invalid_credentials' ? 'Kata sandi saat ini salah.' : error.message)
      setPending(false)
    } finally { busy.current = false }
  }
  return <Dialog open={open} title="Ubah kata sandi" description="Setelah diubah, Anda masuk lagi dengan kata sandi baru di semua perangkat." onClose={() => { if (!pending) onClose() }} dismissible={!pending}>
    <form noValidate onSubmit={(event) => { event.preventDefault(); void submit() }}>
      <Field label="Kata sandi saat ini" type="password" autoComplete="current-password" maxLength={256} required value={current} disabled={pending} onChange={(event) => setCurrent(event.target.value)} />
      <Field label="Kata sandi baru" type="password" autoComplete="new-password" maxLength={256} required help="Minimal 8 karakter." value={next} disabled={pending} onChange={(event) => setNext(event.target.value)} />
      <Field label="Ulangi kata sandi baru" type="password" autoComplete="new-password" maxLength={256} required value={repeat} disabled={pending} onChange={(event) => setRepeat(event.target.value)} />
      {problem && <Feedback tone="danger" title={problem} announce />}
      <Button type="submit" pending={pending} pendingLabel="Menyimpan…" disabled={!current || !next || !repeat}>Simpan kata sandi</Button>
    </form>
  </Dialog>
}
