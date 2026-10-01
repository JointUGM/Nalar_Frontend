import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { openMissions, sessionExample } from './studentExamples'

export type SessionPhase = 'countdown' | 'writing' | 'sending' | 'failed' | 'finished'
export type SendOutcome = 'success' | 'failure'
export const countdownFrom = 3
export const sendMs = 1200

export function useStudentSessionViewModel() {
  const { missionId = '' } = useParams()
  // Only a mission the student can start has a session.
  const mission = openMissions.find((item) => item.id === missionId && item.kind === 'start')
  const [phase, setPhase] = useState<SessionPhase>('countdown')
  const [count, setCount] = useState(countdownFrom)
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState('')
  const [answers, setAnswers] = useState<readonly string[]>([])
  const [outcome, setOutcome] = useState<SendOutcome>('success')
  const total = sessionExample.questions.length
  const submitting = useRef(false)

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
    // One send at a time, and never an empty one; a failed send keeps the draft and can be retried.
    if ((phase !== 'writing' && phase !== 'failed') || !draft.trim() || submitting.current) return
    submitting.current = true
    setPhase('sending')
  }

  return {
    mission, phase, count, step, total, draft, outcome, setOutcome,
    question: sessionExample.questions[step], previous: step > 0 ? answers[step - 1] : null,
    elapsed: sessionExample.elapsedSeconds[step],
    setDraft: (value: string) => { if (phase === 'writing' || phase === 'failed') setDraft(value) },
    fillSample: () => { if (phase === 'writing' || phase === 'failed') setDraft(sessionExample.sampleAnswers[step]) },
    skipCountdown: () => setPhase('writing'),
    submit,
  }
}
