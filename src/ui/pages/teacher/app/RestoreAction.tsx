import type { ApiError } from '@/domain/model/ApiError'
import { Button } from '@/ui/components/button/Button'
import { Icon } from '@/ui/components/icon/Icon'
import { useCommand } from '@/ui/pages/live/useLiveResource'

// Restoring is safe and undoable (archive again), so one tap, no dialog. A refusal stays next to the button, where the teacher is looking.
export function RestoreAction({ action, onDone, refusal, label = 'Pulihkan', blocked, className }: {
  action: (signal?: AbortSignal) => Promise<unknown>; onDone: () => void; refusal: (error: ApiError) => string | null; label?: string; blocked?: boolean; className?: string
}) {
  const command = useCommand()
  const said = command.failure && (refusal(command.failure) ?? command.failure.message)
  return <span className={className ?? 'inline-grid justify-items-start gap-1'}>
    <Button tone="secondary" pending={command.pending} pendingLabel="Memulihkan…" disabled={blocked} onClick={() => { void command.run(action).then((done) => { if (done) onDone() }) }}><Icon name="refresh" size={14} />{label}</Button>
    {said && <small role="alert" className="max-w-64 text-[12px] leading-snug font-semibold text-danger-text">{said}</small>}
  </span>
}
