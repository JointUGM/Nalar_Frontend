import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { generatedMissionId, missionsPath, newMissionExample } from './teacherMissionExamples'

export function useTeacherMissionNewViewModel() {
  const navigate = useNavigate()
  const [goal, setGoal] = useState<string>(newMissionExample.goal)
  const [topic, setTopic] = useState(newMissionExample.topics[0])
  const [cp, setCp] = useState(newMissionExample.cps[0])
  const [concepts, setConcepts] = useState<readonly string[]>(newMissionExample.selectedConcepts)
  const [attempted, setAttempted] = useState(false)
  const [pending, setPending] = useState(false)

  // Simulated "Buat misi": after a fixed delay open the one example review. Nothing is generated.
  useEffect(() => {
    if (!pending) return
    const timer = setTimeout(() => navigate(`${missionsPath}/${generatedMissionId}`, { state: { generated: true } }), newMissionExample.generateMs)
    return () => clearTimeout(timer)
  }, [pending, navigate])

  /** Returns the first invalid field so the view can focus it; null when the simulation started. */
  function start(): 'goal' | 'concepts' | null {
    if (pending) return null
    setAttempted(true)
    const invalid = !goal.trim() ? 'goal' : concepts.length === 0 ? 'concepts' : null
    if (!invalid) setPending(true)
    return invalid
  }

  return {
    goal, setGoal, topic, setTopic, cp, setCp, concepts, pending, start,
    goalError: attempted && !goal.trim() ? 'Tulis tujuan pembelajaran.' : '',
    conceptsError: attempted && concepts.length === 0 ? 'Pilih minimal satu konsep sasaran.' : '',
    toggleConcept: (name: string) => { if (!pending) setConcepts(concepts.includes(name) ? concepts.filter((item) => item !== name) : [...concepts, name]) },
  }
}
