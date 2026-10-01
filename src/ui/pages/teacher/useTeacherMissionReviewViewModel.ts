import { useState } from 'react'
import { useParams } from 'react-router'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { missionReviews, missionsBySchool } from './teacherMissionExamples'

export type MissionTab = 'anchor' | 'rubric' | 'bank' | 'versions'
export const missionTabs: readonly (readonly [MissionTab, string])[] = [['anchor', 'Soal & acuan'], ['rubric', 'Rubrik'], ['bank', 'Bank pertanyaan'], ['versions', 'Versi']]

export function useTeacherMissionReviewViewModel() {
  const { missionId = '' } = useParams()
  const { school } = useTeacherContext()
  const mission = missionsBySchool[school]?.find((item) => item.id === missionId)
  const review = mission ? missionReviews[mission.id] : undefined
  const initial = review?.anchor ?? { question: '', answer: '' }
  const [tab, setTab] = useState<MissionTab>('anchor')
  const [editing, setEditing] = useState(false)
  const [anchor, setAnchor] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const [savedOnce, setSavedOnce] = useState(false)

  const questionBlank = !anchor.question.trim()
  const answerBlank = !anchor.answer.trim()
  const invalid = questionBlank || answerBlank
  const dirty = anchor.question !== saved.question || anchor.answer !== saved.answer

  return {
    mission, review, tab, setTab, editing, anchor, dirty,
    questionError: editing && questionBlank ? 'Isi soal pembuka.' : '',
    answerError: editing && answerBlank ? 'Isi jawaban acuan.' : '',
    // 'saved' is local to this page: nothing is stored, frozen or sent to students.
    saveState: dirty ? 'unsaved' as const : savedOnce ? 'saved' as const : 'clean' as const,
    canSave: dirty && !invalid,
    toggleEditing: () => { if (!(editing && invalid)) setEditing(!editing) },
    edit: (patch: Partial<typeof anchor>) => setAnchor({ ...anchor, ...patch }),
    save: () => { if (dirty && !invalid) { setSaved(anchor); setSavedOnce(true) } },
  }
}
