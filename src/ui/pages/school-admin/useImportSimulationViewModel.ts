import { useRef, useState } from 'react'

export type ImportPhase = 'idle' | 'confirming' | 'queued' | 'running' | 'success' | 'failure'
export function useImportSimulationViewModel(eligibleCount: number) {
  const [phase, setPhase] = useState<ImportPhase>('idle')
  const [outcome, setOutcome] = useState<'success' | 'failure'>('success')
  const current = useRef<ImportPhase>('idle')
  function move(next: ImportPhase) { current.current = next; setPhase(next) }
  function open() { if (eligibleCount && (current.current === 'idle' || current.current === 'failure')) move('confirming') }
  function dismiss() { if (current.current === 'confirming') move('idle') }
  function confirm() { if (current.current === 'confirming' && eligibleCount) move('queued') }
  function run() { if (current.current === 'queued') move('running') }
  function finish() { if (current.current === 'running') move(outcome) }
  function cancel() { if (current.current === 'queued' || current.current === 'running') move('idle') }
  function review() { if (current.current === 'success' || current.current === 'failure') move('idle') }
  return { phase, outcome, setOutcome, open, dismiss, confirm, run, finish, cancel, review }
}
