import { useState } from 'react'
import { useParams } from 'react-router'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { kbTopicsBySchool } from './teacherKbExamples'
import { kbReviewByTopic } from './teacherKbReviewExamples'

export function useTeacherKbReviewViewModel() {
  const { topicId = '' } = useParams()
  const { school } = useTeacherContext()
  const topic = kbTopicsBySchool[school]?.find((item) => item.id === topicId)
  const review = topic ? kbReviewByTopic[topic.id] : undefined
  const [selectedId, setSelectedId] = useState(review?.selectedId ?? '')
  const [editing, setEditing] = useState(false)
  const [edits, setEdits] = useState<Readonly<Record<string, { name: string; desc: string }>>>({})
  const [archived, setArchived] = useState<readonly string[]>([])
  const [approved, setApproved] = useState(false)

  const concepts = (review?.concepts ?? []).map((concept) => ({
    ...concept,
    name: edits[concept.id]?.name ?? concept.name,
    desc: edits[concept.id]?.desc ?? concept.desc,
    mis: concept.mis.map((item) => ({ ...item, archived: archived.includes(item.id) })),
  }))
  const selected = concepts.find((concept) => concept.id === selectedId) ?? concepts[0]
  const nameOf = (id: string) => concepts.find((concept) => concept.id === id)?.name ?? ''
  const blank = Object.values(edits).some((edit) => !edit.name.trim())
  const misconceptions = concepts.flatMap((concept) => concept.mis)
  // Any change after approval drops the topic back to review: the approved content no longer matches.
  const changed = () => setApproved(false)

  return {
    topic, review, concepts, selected, editing, approved,
    nameError: editing && selected && !selected.name.trim() ? 'Isi nama konsep.' : '',
    counts: { concepts: concepts.length, misconceptions: misconceptions.length - archived.length, archived: archived.length },
    after: review && selected ? review.leadsTo.filter(([from]) => from === selected.id).map(([, to]) => nameOf(to)) : [],
    before: review && selected ? review.leadsTo.filter(([, to]) => to === selected.id).map(([from]) => nameOf(from)) : [],
    // A blank name can only be on the selected concept, so leaving it is blocked until it is filled.
    select: (id: string) => { if (!(editing && blank)) setSelectedId(id) },
    toggleEditing: () => { if (!(editing && blank)) setEditing(!editing) },
    edit: (patch: Partial<{ name: string; desc: string }>) => {
      if (!selected) return
      setEdits({ ...edits, [selected.id]: { name: selected.name, desc: selected.desc, ...patch } }); changed()
    },
    toggleArchive: (id: string) => { setArchived(archived.includes(id) ? archived.filter((item) => item !== id) : [...archived, id]); changed() },
    approve: () => { if (!editing && !blank) setApproved(true) },
  }
}
