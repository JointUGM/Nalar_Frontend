import { useState } from 'react'
import { useParams } from 'react-router'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherSchools } from './teacherHomeExamples'
import { missionLabel, missionReviews, missionsBySchool, publicationExample } from './teacherMissionExamples'

export type PublicationMode = 'live' | 'window'
export type PublicationField = 'classes' | 'opens' | 'closes'

const dateFormat = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' })
const timeFormat = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Jakarta' })

/** Formats a local WIB `datetime-local` value, independent of the computer's timezone. */
export function formatWib(local: string): string {
  const date = new Date(`${local}:00+07:00`)
  return Number.isNaN(date.getTime()) ? '' : `${dateFormat.format(date)} · ${timeFormat.format(date)} WIB`
}

export function useTeacherPublicationViewModel() {
  const { missionId = '' } = useParams()
  const { school } = useTeacherContext()
  const mission = missionsBySchool[school]?.find((item) => item.id === missionId)
  const available = mission && mission.id in missionReviews ? mission : undefined
  const classes = teacherSchools.find((item) => item.name === school)?.classes ?? []
  const [selected, setSelected] = useState<readonly string[]>(publicationExample.selectedClasses)
  const [mode, setMode] = useState<PublicationMode>('live')
  const [opens, setOpens] = useState(publicationExample.opens)
  const [closes, setCloses] = useState(publicationExample.closes)
  const [attempted, setAttempted] = useState(false)
  const [published, setPublished] = useState(false)

  const chosen = classes.filter((item) => selected.includes(item.name))
  const windowMode = mode === 'window'
  const classesError = attempted && chosen.length === 0 ? 'Pilih minimal satu kelas.' : ''
  const opensError = attempted && windowMode && !formatWib(opens) ? 'Isi waktu buka.' : ''
  const closesError = attempted && windowMode ? closeProblem(closes, opens) : ''

  /** Returns the first invalid field so the view can focus it; null when the choices are complete. */
  function check(): PublicationField | null {
    setAttempted(true)
    if (chosen.length === 0) return 'classes'
    if (windowMode && !formatWib(opens)) return 'opens'
    if (windowMode && closeProblem(closes, opens)) return 'closes'
    return null
  }

  return {
    mission: available, title: available ? `${available.title} · ${available.version}` : '', versionLabel: available ? missionLabel(available) : '',
    classes, chosen, students: chosen.reduce((sum, item) => sum + item.students, 0),
    mode, windowMode, opens, closes, published, classesError, opensError, closesError,
    setMode: (next: PublicationMode) => { if (!published) setMode(next) },
    setOpens: (value: string) => { if (!published) setOpens(value) },
    setCloses: (value: string) => { if (!published) setCloses(value) },
    toggleClass: (name: string) => { if (!published) setSelected((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]) },
    check,
    markPublished: () => setPublished(true),
    reset: () => { setPublished(false); setAttempted(false) },
  }
}

function closeProblem(closes: string, opens: string): string {
  if (!formatWib(closes)) return 'Isi waktu tutup.'
  return formatWib(opens) && closes <= opens ? 'Waktu tutup harus setelah waktu buka.' : ''
}
