import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { openMissions, sessionExample } from './studentExamples'

export type SessionPhase = 'countdown' | 'writing' | 'sending' | 'failed' | 'paused' | 'timedOut' | 'ended' | 'finished'
export type Interruption = 'paused' | 'timedOut' | 'ended'
export type SendOutcome = 'success' | 'failure'
export type Connection = 'online' | 'offline' | 'stale'
export const countdownFrom = 3
export const sendMs = 1200

export function useStudentSessionViewModel() {
  const { missionId = '' } = useParams()
  // A mission the student can start, or one they dropped out of and can continue.
  const mission = openMissions.find((item) => item.id === missionId)
  // The answers saved before the drop are shown back as "Jawabanmu tadi"; the opening question counts as the first step.
  const resumeStep = mission?.kind === 'resume' && mission.progress ? mission.progress.done + 1 : 0
  const [phase, setPhase] = useState<SessionPhase>('countdown')
  const [count, setCount] = useState(countdownFrom)
  const [step, setStep] = useState(resumeStep)
  const [draft, setDraft] = useState('')
  const [answers, setAnswers] = useState<readonly string[]>(() => sessionExample.sampleAnswers.slice(0, resumeStep))
  const [outcome, setOutcome] = useState<SendOutcome>('success')
  const [connection, setConnection] = useState<Connection>('online')
  const total = sessionExample.questions.length
  const submitting = useRef(false)
  const editable = phase === 'writing' || phase === 'failed'

  useEffect(() => {
    if (phase !== 'countdown') return
    // 3, 2, 1, then the session; one tick per second.
    const timer = setTimeout(() => { if (count <= 1) setPhase('writing'); else setCount(count - 1) }, 1000)
    return () => clearTimeout(timer)
  }, [phase, count])

  useEffect(() => {
    if (phase !== 'sending') return
    const timer = setTimeout(() => {
      submitting.current = false
      if (outcome === 'failure') { setPhase('failed'); return }
      setAnswers((current) => [...current, draft])
      setDraft('')
      if (step + 1 >= total) setPhase('finished')
      else { setStep(step + 1); setPhase('writing') }
    }, sendMs)
    return () => clearTimeout(timer)
  }, [phase, outcome, draft, step, total])

  function submit() {
    // One send at a time, never an empty one, and not while the screen is offline or out of date; a failed send keeps the draft and can be retried.
    if (!editable || !draft.trim() || connection !== 'online' || submitting.current) return
    submitting.current = true
    setPhase('sending')
  }

  // The class can pause, close or end the session at any moment, even mid-send. The unsent draft stays in memory.
  function interrupt(kind: Interruption) {
    if (phase === 'countdown' || phase === 'finished') return
    submitting.current = false
    setPhase(kind)
  }

  return {
    mission, phase, count, step, total, draft, outcome, setOutcome, connection, setConnection, interrupt, resumeStep,
    question: sessionExample.questions[step], previous: step > 0 ? answers[step - 1] : null,
    elapsed: sessionExample.elapsedSeconds[step],
    setDraft: (value: string) => { if (editable) setDraft(value) },
    fillSample: () => { if (editable) setDraft(sessionExample.sampleAnswers[step]) },
    skipCountdown: () => setPhase('writing'),
    backToSession: () => setPhase('writing'),
    submit,
  }
}
