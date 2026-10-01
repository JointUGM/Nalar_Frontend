import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { kbBuildSteps, kbFailureStep, kbMaxPdfBytes, kbSampleFile, kbStepMs, kbTopicsBySchool } from './teacherKbExamples'

export type UploadPhase = 'idle' | 'running' | 'failed' | 'done'
export type StepState = 'waiting' | 'running' | 'done' | 'failed'
export interface SelectedPdf { name: string; bytes: number; pages?: number }

const fileMessage = 'Pilih file .pdf yang tidak kosong, maksimal 50 MB.'

export function formatPdfSize(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toLocaleString('id-ID', { maximumFractionDigits: 1 })} MB`
}

export function useTeacherKbUploadViewModel() {
  const { school } = useTeacherContext()
  const [params] = useSearchParams()
  const [name, setName] = useState(() => kbTopicsBySchool[school]?.find((topic) => topic.id === params.get('topik') && topic.status === 'empty')?.name ?? '')
  const [file, setFile] = useState<SelectedPdf | null>(null)
  const [fileError, setFileError] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [outcome, setOutcome] = useState<'success' | 'failure'>('success')
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [step, setStep] = useState(0)
  const locked = phase !== 'idle'

  useEffect(() => {
    if (phase !== 'running') return
    const timer = setTimeout(() => {
      if (outcome === 'failure' && step === kbFailureStep) setPhase('failed')
      else if (step === kbBuildSteps.length - 1) { setStep(kbBuildSteps.length); setPhase('done') }
      else setStep(step + 1)
    }, kbStepMs)
    return () => clearTimeout(timer)
  }, [phase, step, outcome])

  const steps = kbBuildSteps.map((label, index): { label: string; state: StepState } => ({
    label,
    state: index < step ? 'done' : index === step && phase === 'running' ? 'running' : index === step && phase === 'failed' ? 'failed' : 'waiting',
  }))

  /** Returns the first invalid control so the view can move focus there; null when the simulation started. */
  function start(): 'name' | 'file' | null {
    if (locked) return null
    setAttempted(true)
    const invalid = !name.trim() ? 'name' : !file ? 'file' : null
    if (invalid) return invalid
    setStep(0); setPhase('running')
    return null
  }
  function selectFile(selected: File) {
    if (locked) return
    if (!selected.name.toLowerCase().endsWith('.pdf') || selected.size === 0 || selected.size > kbMaxPdfBytes) { setFile(null); setFileError(fileMessage); return }
    setFile({ name: selected.name, bytes: selected.size }); setFileError('')
  }

  return {
    name, setName, file, steps, outcome, setOutcome, phase, step,
    nameError: attempted && !name.trim() ? 'Isi nama topik.' : '',
    fileError: fileError || (attempted && !file ? 'Pilih satu file PDF.' : ''),
    start, selectFile,
    selectSample: () => { if (!locked) { setFile(kbSampleFile); setFileError('') } },
    clearFile: () => { if (!locked) { setFile(null); setFileError('') } },
    retry: () => { if (phase === 'failed') setPhase('running') },
    back: () => { setPhase('idle'); setStep(0) },
  }
}
