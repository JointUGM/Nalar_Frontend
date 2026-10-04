import { useState } from 'react'
import type { ReactNode } from 'react'
import type { ApiError } from '@/domain/model/ApiError'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherSessions.module.css'

// A button that asks first, for an action that cannot be undone from the app (archive, delete).
export function ConfirmAction({ label, title, description, confirm, pendingLabel, action, onDone, refusal, disabled }: {
  label: ReactNode; title: string; description: string; confirm: string; pendingLabel: string
  action: (signal?: AbortSignal) => Promise<unknown>; onDone: () => void; refusal?: (error: ApiError) => string | null; disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const command = useCommand()
  const close = () => { command.reset(); setOpen(false) }
  const said = command.failure && (refusal?.(command.failure) ?? command.failure.message)
  return <>
    <Button tone="ghost" disabled={disabled} onClick={() => setOpen(true)}>{label}</Button>
    <Dialog open={open} onClose={close} dismissible={!command.pending} title={title} description={description}>
      {said && <Feedback tone="warning" title={said} announce />}
      <div className={styles.dialogActions}><Button tone="secondary" disabled={command.pending} onClick={close}>Kembali</Button><Button tone="danger" pending={command.pending} pendingLabel={pendingLabel} onClick={() => { void command.run(action).then((done) => { if (done) { setOpen(false); onDone() } }) }}>{confirm}</Button></div>
    </Dialog>
  </>
}
